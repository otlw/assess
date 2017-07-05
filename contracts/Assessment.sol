pragma solidity ^0.4.0;

import "./Math.sol";
import "./Concept.sol";
import "./ConceptRegistry.sol";
import "./UserRegistry.sol";

contract Assessment {
  address assessee;
  address[] assessors;
  address[] finalAssessors;
  mapping (address => State) assessorState;
  mapping(uint => int[]) clusters;
  State public assessmentStage;
  enum State {
    None,
    Called,
    Confirmed,
    Committed,
    Done,
    Burned
  }

  uint public assessorPoolLength;
  address concept;
  address userRegistry;
  address conceptRegistry;
  uint public checkpoint; //marks creation of assessment / start of commit phase / start of reveal phase (time in seconds)
  uint burnRate;
  uint public size;
  uint cost;
  mapping(address => string[]) public data;
  mapping(address => bytes32) commits;
  mapping(address => uint) stake;
  uint public done; //counter how many assessors have committed/revealed their score
  mapping(address => int8) scores;
  mapping(int => bool) inRewardCluster;
  int public finalScore;
  event DataSet(address _dataSetter, uint _index);

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

  modifier onlyInStage(State _stage) {
      if(assessmentStage != _stage){
          throw;
      }
      _;
  }

  function Assessment(address _assessee, address _userRegistry, address _conceptRegistry, uint _size, uint _cost) {
    assessee = _assessee;
    concept = msg.sender;
    userRegistry = _userRegistry;
    conceptRegistry = _conceptRegistry;
    checkpoint = now;
    size = _size;
    cost = _cost;
    UserRegistry(userRegistry).notification(assessee, 0); // assesse has started an assessment
    assessorPoolLength = 0;
    done = 0;
  }


  function cancelAssessment() onlyConceptAssessment() {
    Concept(concept).addBalance(assessee, cost*assessors.length);
    UserRegistry(userRegistry).notification(assessee, 3); //Assessment Cancled and you have been refunded
    for(uint i = 0; i < assessors.length; i++) {
      Concept(concept).addBalance(assessors[i], cost);
      UserRegistry(userRegistry).notification(assessors[i], 3); //Assessment Cancled and you have been refunded
    }
    suicide(conceptRegistry);
  }

  //@purpose: adds a user to the pool eligible to accept an assessment
  function addAssessorToPool(address assessor) onlyConcept() returns(bool) {
    if(assessorState[assessor] == State.None) {
      UserRegistry(userRegistry).notification(assessor, 1); //Called As A Potential Assessor
      assessorState[assessor] = State.Called;
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
    assessmentStage = State.Called;
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
      assessmentStage = State.Called;
  }

  //@purpose: called by an assessor to confirm and stake
  function confirmAssessor() onlyInStage(State.Called){
      // cancel if the assessment is older than 12 hours
      if (now - checkpoint > 12 hours) {
          cancelAssessment(); 
          return;
      }
      if (assessorState[msg.sender] == State.Called &&
          assessors.length < size &&
          Concept(concept).subtractBalance(msg.sender, cost)
          ) {
          assessors.push(msg.sender);
          assessorState[msg.sender] = State.Confirmed;
          stake[msg.sender] = cost;
          UserRegistry(userRegistry).notification(msg.sender, 2); //Confirmed for assessing, stake has been taken
      }
      if (assessors.length == size) {
          notifyAssessors(uint(State.Confirmed), 4);
          checkpoint = now; // reset checkpoint to mark start of actual assessment phase
          UserRegistry(userRegistry).notification(assessee, 4);
          assessmentStage = State.Confirmed;
      }
  }

  function setData(string _data) onlyAssessorAssessee() {
    data[msg.sender].push(_data);
    DataSet(msg.sender, data[msg.sender].length - 1);
  }
  event fb(uint x);
  //@purpose: called by an assessor to commit a hash of their score //TODO explain in more detail what's happening
  function commit(bytes32 _hash) onlyInStage(State.Confirmed){
    if(done > size/2) {
        burnStakes();
    }

    if(assessorState[msg.sender] == State.Confirmed)
    {
        commits[msg.sender] = _hash;
        assessorState[msg.sender] = State.Committed;
        done++; //Increases done by 1 to help progress to the next assessment stage.

        // if the boundary assessor
        if( done*10 >= 10*size/2 &&
            (done - 1)*10 < 10*size/2) {
            burnRate = cost / (now - checkpoint);
            checkpoint = now + (now - checkpoint);
        }
    }
    if(done == size) {
        notifyAssessors(uint(State.Committed), 5);
        checkpoint = now; //reset checkpoint to mark start of reveal phase
        done = 0; //Resets the done counter
        assessmentStage = State.Committed;
    }


  }

  //@purpose: called by assessors to reveal their own commits or others
  function reveal(int8 score, string salt, address assessor) onlyInStage(State.Committed) {
      if(now - checkpoint > 12 hours) {
          for(uint i = 0; i < assessors.length; i++) {
              if(assessorState[assessors[i]] == State.Committed) { //If the assessor has not revealed their score
                  stake[assessors[i]] = 0;
                  assessorState[assessors[i]] = State.Burned;
                  size--;
              }
          }
          return;
      }

      bytes32 hash = sha3(score,salt);
      if (assessorState[assessor] == State.Committed) {
              if(commits[assessor] == hash){
          // log in score and increase done
          if(msg.sender == assessor) {
              scores[msg.sender] = score;
              assessorState[assessor] = State.Done;
              done++;
          }
          else {
            // give the stake to the caller and burn assessor
            Concept(concept).addBalance(msg.sender, stake[assessor]);
            stake[assessor] = 0;
            assessorState[assessor] = State.Burned;
            size--;
          }
      }
      }
      //If all the assessors have revealed their scored or burned their stakes
      if(done == size) {
          assessmentStage = State.Done;
          calculateResult(); //The final result is calculated
      }
  }
  event fb(uint x);
  event b(string s);
  //@purpose: burns stakes as a function of how much time has passed since half of the assessors commited
  function burnStakes() internal {
      if(now-checkpoint > now) { //-> underflows if now before the end of the grace period
          return;
      }
      for(uint i = 0; i < assessors.length; i++) {
          if(assessorState[assessors[i]] == State.Confirmed) {
              stake[assessors[i]] = cost - (burnRate * (now - checkpoint));
              if (stake[assessors[i]] == 0 ||
                  stake[assessors[i]] > cost){
                    assessorState[assessors[i]] = State.Burned;
                    stake[assessors[i]] = 0;
                    size--; //decrease size to help progress to the next assessment stage
            }
              }
          }
      }

   function notifyAssessors(uint _state, uint _topic) private {
      for(uint i=0; i < assessors.length; i++) {
          if(uint(assessorState[assessors[i]]) == _state) {
              UserRegistry(userRegistry).notification(assessors[i], _topic);
          }
      }
  }

   function calculateResult() onlyInStage(State.Done) private {
       for(uint j = 0; j < assessors.length; j++) {
           if(assessorState[assessors[i]] == State.Done) {
               finalAssessors.push(assessors[i]); //Adds all the assessors that completed the assessment process to an array}
           }
       }
       int[] memory score = new int[] (finalAssessors.length); //Initializes an array to store scores that is the same length as the number of finalAssessors
       uint largestClusterIndex = 0; //store the index of the largest cluster
       int averageScore;
       for(uint i = 0; i < finalAssessors.length; i++) {
           score[i] = scores[finalAssessors[i]];
       }
       /* int meanAbsoluteDeviation = Math.calculateMAD(score,int(finalAssessors.length)); */
       /* for(uint l = 0; l < score.length; l++) { */
       /*     for(uint m = 0; m < score.length; m++) { */
       /*         if(score[l] - score[m] <= meanAbsoluteDeviation) { */
       /*             clusters[l].push(score[m]); */
       /*         } */
       /*     } */
       /*     if(clusters[l].length > clusters[largestClusterIndex].length) { */
       /*         largestClusterIndex = l; */
       /*     } */
       /* } */
       /* for (uint o = 0; o < clusters[largestClusterIndex].length; o++) { */
       /*     averageScore += clusters[largestClusterIndex][o]; */
       /*     inRewardCluster[clusters[largestClusterIndex][o]] = true; */
       /* } */
       /* averageScore /= int(clusters[largestClusterIndex].length); */
       /* finalScore = averageScore; //Sets the final score to the average score */
       /* payout(); */
   }

   function payout() onlyInStage(State.Done) private { //TODO order functions according to styleguide
       for(uint i = 0; i < assessors.length; i++) {
           if (assessorState[assessors[i]] == State.Done){
               int score = scores[assessors[i]];
               int scoreDistance = ((score - finalScore)*100)/finalScore;
               if(scoreDistance < 0) {
                   scoreDistance *= -1;
               }
               uint payoutValue = 1; //Initializes the payoutValue for the assessor
               if(inRewardCluster[score] == true) {
                   uint q = 1; //Inflation rate factor, WE NEED TO FIGURE THIS OUT AT SOME POINT
                   //The assessor's payout will be some constant times a propotion of their original stake determined by how close to the final score they were
                   payoutValue = (q*cost*((100 - uint(scoreDistance))/100)) + stake[assessors[i]];
                   Concept(concept).addBalance(assessors[i], payoutValue);
               }
               if(inRewardCluster[score] == false) {
                   //The assessor's payout will be a propotion of their remaining stake determined by their distance from the final score
                   payoutValue = stake[assessors[i]]*((200 - uint(scoreDistance))/200);
                   Concept(concept).addBalance(assessors[i], payoutValue);
               }
               //Sends assessment info to the concept so that it can update its records
               Concept(concept).finishAssessment(finalScore, assessee, address(this));
               UserRegistry(userRegistry).notification(assessors[i], 6); //You  got paid!
           }
       }
   }
}
