pragma solidity ^0.4.0;

import "./Math.sol";
import "./Concept.sol";
import "./ConceptRegistry.sol";
import "./UserRegistry.sol";

contract Assessment {
  address assessee; //The address of the user being assessed
  address[] assessors;
  address[] finalAssessors; //The assessors who actually give an assessment
  mapping (address => State) assessorState;
  mapping(uint => int[]) clusters; //Initializes mapping to store clusters of scores
  enum State {//The state of the assessors
    Called, //Been called as a potential assessor
    Confirmed, //Confirmed as assessing
    Committed, //Committed a score
    Done, //Completed the assessment processs
    Burned //Entire stake has been burned
  }
  uint public assessorPoolLength; //how many users are potential assessors (also changed to public)
  address concept;
  address userRegistry;
  address conceptRegistry;
  address math = 0x90B66E80448eb60938FAed4A738dE0D5b630B2Fd;
  uint public startTime;
  uint public size;
  uint cost;
  mapping(address => string[]) public data; //IFFS hashes of data that can be passed between the assessors and the assessee for the assessment to occur
  mapping(address => bytes32) commits;
  mapping(address => uint) stake;
  uint done = 0;
  mapping(address => int8) scores; //could save gas by making this an int8
  mapping(int => bool) inRewardCluster;
  int finalScore;
  event DataSet(address _dataSetter, uint _index);

  modifier onlyThis() {
    if(msg.sender != address(this)){
      throw;
    }
    _;
  }

  modifier onlyAssessorAssessee() {
    if(msg.sender != assessee && uint(assessorState[msg.sender]) == 0) {
      throw;
    }
    _;
  }

  modifier onlyConceptAssessment() {
    if(msg.sender != address(this) && msg.sender != concept) {
      throw;
    }
    _;
  }

  modifier onlyConcept() {
    if(msg.sender != concept) {
      throw;
    }
    _;
  }

  function Assessment(address _assessee, address _userRegistry, address _conceptRegistry, uint _size, uint _cost) {
    assessee = _assessee;
    concept = msg.sender;
    userRegistry = _userRegistry;
    conceptRegistry = _conceptRegistry;
    startTime = block.timestamp;
    size = _size;
    cost = _cost;
    UserRegistry(userRegistry).notification(assessee, 0); // assesse has started an assessment
    assessorPoolLength = 0;
  }


  function cancelAssessment() onlyConceptAssessment() {
    Concept(concept).addBalance(assessee, cost*size);
    UserRegistry(userRegistry).notification(assessee, 3); //Assessment Cancled and you have been refunded
    for(uint i = 0; i < assessors.length; i++) {
      Concept(concept).addBalance(assessors[i], cost);
      UserRegistry(userRegistry).notification(assessors[i], 3); //Assessment Cancled and you have been refunded
    }
    suicide(conceptRegistry);
  }

  //@purpose: adds a user to the pool eligible to accept an assessment
  function addAssessorToPool(address assessor) onlyConcept() returns(bool) {
    if(uint(assessorState[assessor]) == 0) {//Checks if the called assessor hasn't already been called //TODO can we use State.called here?
      UserRegistry(userRegistry).notification(assessor, 1); //Called As A Potential Assessor
      assessorState[assessor] = State.Called; //Sets the state of the assessor as called
      assessorPoolLength++;
      return true;
    }
    else {
      return false;
    }
  }


  /*
  @purpose: To recursively set the pool to draw assessors from in the assessment
  stops when the pool of potential assessors is 20 times the size of the assessment2
  @param: uint seed = the seed number for random number generation
  @param: address _concept = the concept being called from
  @param: uint num = the number of assessors to be called
  */
  function setAssessorPool(uint seed, address _concept, uint num) onlyConceptAssessment() {
    uint numCalled = 0;
    for (uint k=0; k < num; k++) {
      if (assessorPoolLength == size*20) { return; } //
      address randomUser = Concept(_concept).getRandomMember(seed + k);
      if (addAssessorToPool(randomUser)) {
        numCalled++;
      }
    }
    uint remaining = num - numCalled;
    if (remaining > 0) {
      for (uint i = 0; i < Concept(_concept).getParentsLength(); i++) {
        setAssessorPool(seed + assessorPoolLength, Concept(_concept).parents(i), remaining/Concept(_concept).getParentsLength() + 1); //Calls the remaining users from the parent concepts proportional to their size
      }
    }
  }

  /*
    @purpose: To set the pool of assessors when there are so few users in the system that
    assembling them at random is not meaningful. This will use all members of mew instead
  */
  function setAssessorPoolFromMew() onlyConcept() {
    Concept mew = Concept(ConceptRegistry(conceptRegistry).mewAddress()); //TODO: can this be more elegant and/or in one line?
      for (uint i=0; i<mew.getMemberLength(); i++) {
        addAssessorToPool(mew.members(i));
      }
      size = mew.getMemberLength(); 
  }

  //@purpose: called by an assessor to confirm and stake
  function confirmAssessor() {
    //Check if the time to confirm has not passed, that the assessor was actually called, assessors are still needed, and that the assessor has enough of a balance to pay the stake
    if (block.number - startTime <= 15 &&
        assessorState[msg.sender] == State.Called &&
        assessors.length < size && Concept(concept).subtractBalance(msg.sender, cost)
        ){
      assessors.push(msg.sender); //Adds the user that called this function to the array of confirmed assessors
      assessorState[msg.sender] = State.Confirmed; //Sets the assessor's state to confirmed
      stake[msg.sender] = cost; //Sets the current stake value of the assessor to the cost of the assessment
      UserRegistry(userRegistry).notification(msg.sender, 2); //Confirmed for assessing, stake has been taken
    }
  if (assessors.length == size) { //If enough assessors have been called
    this.notifyStart(); //Assessors and the assessee are notified that the assessmentn has begun
  } else if (block.number - startTime > 15 && assessors.length < size){
      cancelAssessment(); //Cancels the assessment if not enough assessors confirm within 15 blocks
  }
  }

  function notifyStart() onlyThis() { //Sends a notification to the assessors and the assessee informing them that the assessment has begun
    for(uint i = 0; i < assessors.length; i++) {
      UserRegistry(userRegistry).notification(assessors[i], 4); //Assessment Has Started
    }
    UserRegistry(userRegistry).notification(assessee, 4); //Assessment Has Started
  }
  function setData(string _data) onlyAssessorAssessee() {
    data[msg.sender].push(_data); //Adds the data to an array corresponding to the user that uploaded it
    DataSet(msg.sender, data[msg.sender].length - 1); // fire event
  }

  //@purpose: called by an assessor to commit a hash of their score
  function commit(bytes32 hash) {
    if(done > size/2) {//If more than half the assessors have committed their score hash
      for(uint i = 0; i < assessors.length; i++) {
        if(assessorState[assessors[i]] == State.Confirmed) { //if the assessor has not committed  a score
          uint r = 38; //Inverse burn rate
          stake[assessors[i]] = cost*2**(-(now-startTime)/r) - 1; //burns stake as a function of how much time has passed since half of the assessors commited
        }
        if(stake[assessors[i]] == 0) { //If an assessor's stake is entirely burned
          assessorState[assessors[i]] = State.Burned;
          done++; //Increases done by 1 to help progress to the next assessment stage
        }
      }
    }

    if(done == size) { //If all the assessors have either committed or had their entire stake burned
      for(uint j = 0; j < assessors.length; j++) { //Loops through all assessors
        if(assessorState[assessors[j]] == State.Committed) { //Sends a notification to all the assessors that have committed to reveal their score
          UserRegistry(userRegistry).notification(assessors[j], 5); //Send in Score
          //NOTE: The front end should receive this notification and then automatically call the reveal function
        }
      }
      startTime = block.number; //Resets the startTime
      done = 0; //Resets the done counter
    }

    if(assessorState[msg.sender] == State.Confirmed) //If the caller is confirmed as an assessor
    {
      commits[msg.sender] = hash; //Maps the score hash to the assessor
      assessorState[msg.sender] == State.Committed; //Sets the assessor's state to Committed
      done++; //Increases done by 1 to help progress to the next assessment stage.

      if(done <= size/2) //If less than or half the assessors have committed
      {
        startTime = block.number; //Sets the startTime to the current block
      }
    }
  }

  //@purpose: called by assessors to reveal their own commits or others
  function reveal(int8 score, bytes16 salt, address assessor) {
    if(block.number - startTime <= 10) { //If less than 10 blocks have passed since the socre commiting stage ended
      bytes32 hash = sha3(score,salt);
      if(commits[assessor] == hash) {
        if(msg.sender == assessor) {
          scores[msg.sender] = score;
          assessorState[assessor] = State.Done;
          done++; //done increases by 1 to help progress to the next assessment stage
        }
        else { //If it was submitted by another user than the given assessor
          Concept(concept).addBalance(msg.sender, stake[assessor]); // give the stake to the caller
          stake[assessor] = 0;
          assessorState[assessor] = State.Burned;
          done++; //done increases by 1 to help progress to the next assessment stage
        }
      }
      else if(msg.sender == assessor) { //If the stake was wrong and was provided by the assessor in the parameter
        stake[assessor] = 0; //The assessor's stake is completely burned
        assessorState[assessor] = State.Burned; //The assessor's state is set to Burned
        done++; //done increases by 1 to help progress to the next assessment stage
      }
    }
    else { //If more than 10 blocks have passed
      for(uint i = 0; i < assessors.length; i++) { //Loops through all the assessors
        if(assessorState[assessors[i]] == State.Committed) { //If the assessor has not revealed their score
          stake[assessors[i]] = 0; //The assessor's stake is completely burned
          assessorState[assessors[i]] = State.Burned;
          done++; //done increases by 1 to help progress to the next assessment stage
        }
      }
    }
    if(done == size) { //If all the assessors have revealed their scored or burned their stakes
      calculateResult(); //The final result is calculated
    }
  }

  function calculateResult() onlyThis() {
    for(uint j = 0; j < size; j++) { //Loops through the assessors
      if(assessorState[assessors[i]] == State.Done) {
        finalAssessors.push(assessors[i]); //Adds all the assessors that completed the assessment process to an array
      }
    }
    int[] memory score = new int[] (finalAssessors.length); //Initializes an array to store scores that is the same length as the number of finalAssessors
    uint largestClusterIndex = 0; //store the index of the largest cluster
    int averageScore;
    for(uint i = 0; i < finalAssessors.length; i++) {
      score[i] = scores[finalAssessors[i]]; //Puts all the scores in the score array
    }
    int meanAbsoluteDeviation = Math.calculateMAD(score,int(finalAssessors.length));
    for(uint l = 0; l < score.length; l++) { //Find the largest cluster of scores
      for(uint m = 0; m < score.length; m++)
      {
        if(score[l] - score[m] <= meanAbsoluteDeviation) {
          clusters[l].push(score[m]);
        }
      }
      if(clusters[l].length > clusters[largestClusterIndex].length) {
        largestClusterIndex = l;
      }
    }
    for(uint o = 0; o < clusters[largestClusterIndex].length; o++) { //Records which assessors submitted a score that was in the largest cluster
      averageScore += clusters[largestClusterIndex][o];
      inRewardCluster[clusters[largestClusterIndex][o]] = true;
    }
    averageScore /= int(clusters[largestClusterIndex].length); //Calculates the average score from the largest cluster
    finalScore = averageScore; //Sets the final score to the average score
    payout(); //Initializes the payout sequence
  }

  function payout() onlyThis() {
    for(uint i = 0; i < size; i++) { //Loops through all the confirmed assessors
      int score = scores[assessors[i]]; //Gets the score of an assessor
      int scoreDistance = ((score - finalScore)*100)/finalScore; //Calculates the percent difference between the final score the assessors score
      if(scoreDistance < 0) { //Makes negative scoreDistances positive
        scoreDistance *= -1;
      }
      uint payoutValue = 1; //Initializes the payoutValue for the assessor
      if(inRewardCluster[score] == true) { //If the assessor's score was in the largest cluster
        uint q = 1; //Inflation rate factor, WE NEED TO FIGURE THIS OUT AT SOME POINT
        payoutValue = q*cost*((100 - uint(scoreDistance))/100); //The assessor's payout will be some constant times a propotion of their original stake determined by how close to the final score they were
        Concept(concept).addBalance(assessors[i], payoutValue); //Pays the user
      }
      if(inRewardCluster[score] == false) { //If the assessor's score wasn't in the largest cluster
        payoutValue = stake[assessors[i]]*((200 - uint(scoreDistance))/200); //The assessor's payout will be a propotion of their remaining stake determined by their distance from the final score
        Concept(concept).addBalance(assessors[i], payoutValue); //Pays the user
      }
    Concept(concept).finishAssessment(finalScore, assessee, address(this)); //Sends assessment info to the concept so that it can update its records
    UserRegistry(userRegistry).notification(assessors[i], 6); //You Have Received Payment For Your Assessment
    }
  }
}
