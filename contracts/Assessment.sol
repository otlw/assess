pragma solidity ^0.4.0;

import "./Math.sol";
import "./Concept.sol";
import "./ConceptRegistry.sol";
import "./User.sol";
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
  address[] assessorPool; //The addresses of the user's that the assessors are randomly selected from
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

  /*
  @type: modifier
  @name: onlyThis
  @purpose: to only allow the this contract to call a function to which this modifier is applied
  */
  modifier onlyThis() {
    if(msg.sender != address(this)){//Checks if msg.sender is this contract
      throw; //Throws out the function call if it isn't
    }
    _;
  }

  /*
  @type: modifier
  @name: onlyAssessorAssessee
  @purpose: to only allow the assessors and assessee to call a function to which this modifier is applied
  */
  modifier onlyAssessorAssessee() {
    if(msg.sender != assessee && uint(assessorState[msg.sender]) == 0) {
      throw;
    }
    _;
  }

  // only allow the this contract or the Concept contract that spawned it
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
    User(assessee).notification(concept, 0); //Assessment made
  }


  function cancelAssessment() onlyConceptAssessment() {
    Concept(concept).setBalance(assessee, UserRegistry(userRegistry).balances(assessee) + cost*size);
    User(assessee).notification(concept, 3); //Assessment Cancled and you have been refunded
    for(uint i = 0; i < assessors.length; i++) {
      Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).balances(assessors[i]) + cost);
      User(assessors[i]).notification(concept, 3); //Assessment Cancled and you have been refunded
    }
    suicide(conceptRegistry);
  }

  function addAssessorToPool(address assessor) onlyConcept() returns(bool) {
    if(uint(assessorState[assessor]) == 0) {//Checks if the called assessor hasn't already been called
      User(assessor).notification(concept, 1); //Called As A Potential Assessor
      assessorState[assessor] = State.Called; //Sets the state of the assessor as called
      return true;
    }
    else {
      return false; //Returns false if the assessor has already been called
    }
  }


  /*
  @purpose: To recursively set the pool to draw assessors from in the assessment
  @param: uint seed = the seed number for random number generation
  */
  function setAssessorPool(uint seed, address _concept, uint num) onlyConceptAssessment() {
    uint numCalled = 0;
    for(uint k=0; k < num; k++) {
      if(assessorPool.length == size*20){ return; }
      address randomUser = Concept(_concept).getRandomMember(seed + k);
      if(addAssessorToPool(randomUser)){
        numCalled++;
      }
    }
    uint remaining = num - numCalled;
    if(remaining > 0) {
      for(uint i = 0; i < Concept(_concept).getParentsLength(); i++) {
          setAssessorPool(seed + assessorPool.length, Concept(_concept).parents(i), remaining/Concept(_concept).getParentsLength() + 1);
      }
    }
  }

  function confirmAssessor() {
    if(block.number - startTime <= 15 && assessorState[msg.sender] == State.Called && assessors.length < size && UserRegistry(userRegistry).balances(msg.sender) >= cost) { //Check if the time to confirm has not passed, that the assessor was actually called, assessors are still needed, and that the assessor has enough of a balance to pay the stake
      assessors.push(msg.sender); //Adds the user that called this function to the array of confirmed assessors
      assessorState[msg.sender] = State.Confirmed; //Sets the assessor's state to confirmed
      stake[msg.sender] = cost; //Sets the current stake value of the assessor to the cost of the assessment
      Concept(concept).setBalance(msg.sender,UserRegistry(userRegistry).balances(msg.sender) - cost); //Takes the stake from the assessor
      User(msg.sender).notification(concept, 2); //Confirmed for assessing, stake has been taken
    }
    if(assessors.length == size) { //If enough assessors have been called
      notifyStart(); //Assessors and the assessee are notified that the assessmentn has begun
    }
    else if(block.number - startTime > 15 && assessors.length < size){
      cancelAssessment(); //Cancels the assessment if not enough assessors confirm within 15 blocks
    }
  }

  function notifyStart() onlyThis() { //Sends a notification to the assessors and the assessee informing them that the assessment has begun
    for(uint i = 0; i < assessors.length; i++) {
      User(assessors[i]).notification(concept, 4); //Assessment Has Started
    }
    User(assessee).notification(concept, 4); //Assessment Has Started
  }

  function setData(string _data) onlyAssessorAssessee() { //Allows the assessors and the assessee to publically add data for the purposes of the assessment
    data[msg.sender].push(_data); //Adds the data to an array corresponding to the user that uploaded it
    DataSet(msg.sender, data[msg.sender].length - 1); //Spawns an event that contains the address of the user who just uploaded data and the index number of this piece of data in their corresponding array
  }

  function commit(bytes32 hash) { //Assessors should call this to commit a sha3 hash of their final score and a bytes16
    if(done > size/2) {//If more than half the assessors have committed their score hash
      for(uint i = 0; i < assessors.length; i++) {//Loops through all the assessors
        if(assessorState[assessors[i]] == State.Confirmed) {//Checks if the assessor has not committed  a score yet
          uint r = 38; //Inverse burn rate
          stake[assessors[i]] = cost*2**(-(now-startTime)/r) - 1; //Sets their stake to a lower value based off of how long its been since the first half of the assessors committed
        }
        if(stake[assessors[i]] == 0) {//If an assessor's stake is entirely burned
          assessorState[assessors[i]] = State.Burned; //Sets the assessor's state to Burned
          done++; //Increases done by 1 to help progress to the next assessment stage
        }
      }
    }
    if(done == size) {//If all the assessors have either committed or had their entire stake burned
      for(uint j = 0; j < assessors.length; j++) { //Loops through all assessors
        if(assessorState[assessors[j]] == State.Committed) { //Sends a notification to all the assessors that have committed to reveal their score
          User(assessors[j]).notification(concept, 5); //Send in Score
          //NOTE: The front end should receive this notification and then automatically call the reveal function
        }
      }
      startTime = block.number; //Resets the startTime
      done = 0; //Resets the done counter
    }
    if(assessorState[msg.sender] == State.Confirmed) //If the user calling this function is confirmed as an assessor
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

  function reveal(int8 score, bytes16 salt, address assessor) { //Assessors reveal the components of their hash (which are checked), assessors can reveal other assessors hash components to report them for cheating
    if(block.number - startTime <= 10) { //If less than 10 blocks have passed since the socre commiting stage ended
      bytes32 hash = sha3(score,salt); 
      if(commits[assessor] == hash) { 
        if(msg.sender == assessor) {
          scores[msg.sender] = score; //That score is mapped to the assessor
          assessorState[assessor] = State.Done; 
          done++; //done increases by 1 to help progress to the next assessment stage
        }
        else { //If it was correct and submitted by a user other than the assessor in the parameter
          Concept(concept).setBalance(msg.sender,UserRegistry(userRegistry).balances(msg.sender) + stake[assessor]); //The user that called this function gets the assessor's stake
          stake[assessor] = 0;
          assessorState[assessor] = State.Burned; //The assessor's state is set to Burned
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
          assessorState[assessors[i]] = State.Burned; //The assessor's state is set to Burned
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
    uint largestClusterIndex = 0; //Initializes a uint to store the index of the largest cluster in the clusters mapping
    int averageScore; //Initializes an int to store the average score
    for(uint i = 0; i < finalAssessors.length; i++) {
      score[i] = scores[finalAssessors[i]]; //Puts all the scores in the score array
    }
    int meanAbsoluteDeviation = Math.calculateMAD(score,int(finalAssessors.length)); //Caclulates the MAD of the scores
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
    for(uint i = 0; i < size; i++) //Loops through all the confirmed assessors {
      int score = scores[assessors[i]]; //Gets the score of an assessor
      int scoreDistance = ((score - finalScore)*100)/finalScore; //Calculates the percent difference between the final score the assessors score
      if(scoreDistance < 0) { //Makes negative scoreDistances positive
        scoreDistance *= -1;
      }
      uint payoutValue = 1; //Initializes the payoutValue for the assessor
      if(inRewardCluster[score] == true) { //If the assessor's score was in the largest cluster
        uint q = 1; //Inflation rate factor, WE NEED TO FIGURE THIS OUT AT SOME POINT
        payoutValue = q*cost*((100 - uint(scoreDistance))/100); //The assessor's payout will be some constant times a propotion of their original stake determined by how close to the final score they were
        Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).balances(assessors[i]) + payoutValue); //Pays the user
        User(assessors[i]).notification(concept, 15); //You Have Received Payment For Your Assessment
      }
      if(inRewardCluster[score] == false) { //If the assessor's score wasn't in the largest cluster
        payoutValue = stake[assessors[i]]*((200 - uint(scoreDistance))/200); //The assessor's payout will be a propotion of their remaining stake determined by their distance from the final score
        Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).balances(assessors[i]) + payoutValue); //Pays the user
        User(assessors[i]).notification(concept, 16); //You Have Received Some of Your Stake Back For Your Assessment
      }
    Concept(concept).finishAssessment(finalScore, assessee, address(this)); //Sends assessment info to the concept so that it can update its records
  }
}
