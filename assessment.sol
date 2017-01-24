pragma solidity ^0.4.0;

import "math.sol";
import "userRegistry.sol";
import "concept.sol";
import "user.sol";
import "conceptRegistry.sol";

contract Assessment
{
  address assessee; //The address of the user being assessed
  address[] assessors;
  address[] finalAssessors; //The assessors who actually give an assessment
  mapping (address => State) assessorState;
  enum State
  {
    Called,
    Confirmed,
    Committed,
    Submitted,
    Done,
    Burned
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
  modifier onlyThis()
  {
    if(msg.sender != address(this)) //Checks if msg.sender is this contract
    {
      throw; //Throws out the function call if it isn't
    }
    _;
  }

  /*
  @type: modifier
  @name: onlyAssessorAssessee
  @purpose: to only allow the assessors and assessee to call a function to which this modifier is applied
  */
  modifier onlyAssessorAssessee()
  {
    if(msg.sender != assessee && uint(assessorState[msg.sender]) == 0) //Checks if msg.sender has the same address as either the assessee or an assessor
    {
      throw; //Throws the function call if not
    }
    _;
  }

  /*
  @type: modifier
  @name: onlyConceptAssessment
  @purpose: to only allow the this contract or the Concept contract that spawned it to call a function to which this modifier is applied
  */
  modifier onlyConceptAssessment()
  {
    if(msg.sender != address(this) && msg.sender != concept) //Checks if msg.sender has the same address as this contract or the Concept that spawned it
    {
      throw; //Throws the function call if not
    }
    _;
  }

  modifier onlyConcept()
  {
    if(msg.sender != concept)
    {
      throw;
    }
    _;
  }

  function Assessment(address _assessee, address _userRegistry, address _conceptRegistry, uint _size, uint _cost)
  {
    assessee = _assessee;
    concept = msg.sender;
    userRegistry = _userRegistry;
    conceptRegistry = _conceptRegistry;
    startTime = block.timestamp;
    size = _size;
    cost = _cost;
    User(assessee).notification(concept, 0); //Assessment made
  }


  function cancelAssessment() onlyConceptAssessment()
  {
    Concept(concept).setBalance(assessee, UserRegistry(userRegistry).getBalance(assessee) + cost*size);
    User(assessee).notification(concept, 3); //Assessment Cancled and you have been refunded
    for(uint i = 0; i < assessors.length; i++)
    {
      Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).getBalance(assessors[i]) + cost);
      User(assessors[i]).notification(concept, 3); //Assessment Cancled and you have been refunded
    }
    suicide(conceptRegistry);
  }

  function addAssessorToPool(address assessor) onlyConcept() returns(bool)
  {
    if(uint(assessorState[assessor]) == 0)
    {
      User(assessor).notification(concept, 1); //Called As A Potential Assessor
      assessorState[assessor] = State.Called;
      return true;
    }
    else
    {
      return false;
    }
  }


  /*
  @type: function
  @purpose: To recursively set the pool to draw assessors from in the assessment
  @param: uint seed = the seed number for random number generation
  @returns: nothing
  */
  function setAssessorPool(uint seed) onlyConceptAssessment()
  {
    if(Concept(ConceptRegistry(conceptRegistry).mewAddress()).getOwnerLength() < size*20) //Checks if the requested pool size is greater than the number of users in the system
    {
      for(uint i = 0; i < Concept(ConceptRegistry(conceptRegistry).mewAddress()).getOwnerLength(); i++) //If so, all users in the system are added to the pool
      {
        address assessor = Concept(ConceptRegistry(conceptRegistry).mewAddress()).owners(i);
        assessorPool.push(assessor);
        User(assessor).notification(concept, 1); //Called As A Potential Assessor
        assessorState[assessor] = State.Called;
      }
    }
    else
    {
      Concept(concept).getAssessors(size*20, seed, address(this));
    }
  }

  function confirmAssessor()
  {
    if(block.number - startTime <= 15 && assessorState[msg.sender] == State.Called && assessors.length < size && UserRegistry(userRegistry).getBalance(msg.sender) >= cost)
    {
      assessors.push(msg.sender);
      assessorState[msg.sender] = State.Confirmed;
      stake[msg.sender] = cost;
      Concept(concept).setBalance(msg.sender,UserRegistry(userRegistry).getBalance(msg.sender) - cost);
      User(msg.sender).notification(concept, 2); //Confirmed for assessing, stake has been taken
    }
    if(assessors.length == size)
    {
      notifyStart();
    }
    else if(block.number - startTime > 15 && assessors.length < size)
    {
      cancelAssessment();
    }
  }

  function notifyStart() onlyThis()
  {
    for(uint i = 0; i < assessors.length; i++)
    {
      User(assessors[i]).notification(concept, 4); //Assessment Has Started
    }
    User(assessee).notification(concept, 4); //Assessment Has Started
  }

  function setData(string _data) onlyAssessorAssessee()
  {
    data[msg.sender].push(_data);
    DataSet(msg.sender, data[msg.sender].length - 1);
  }

  function commit(bytes32 hash)
  {
    if(done > size/2)
    {
      for(uint i = 0; i < assessors.length; i++)
      {
        if(assessorState[assessors[i]] == State.Confirmed)
        {
          uint r = 38; //Inverse burn rate
          stake[assessors[i]] = cost*2**(-(now-startTime)/r) - 1;
        }
        if(stake[assessors[i]] == 0)
        {
          assessorState[assessors[i]] = State.Burned;
          done++;
        }
      }
    }
    if(done == size)
    {
      for(uint j = 0; j < assessors.length; j++)
      {
        if(assessorState[assessors[j]] == State.Committed)
        {
          User(assessors[j]).notification(concept, 5); //Send in Score
        }
      }
      startTime = block.number;
      done = 0;
    }
    if(assessorState[msg.sender] == State.Confirmed)
    {
      commits[msg.sender] = hash;
      assessorState[msg.sender] == State.Committed;
      done++;
      if(done <= size/2)
      {
        startTime = block.number;
      }
    }
  }

  function reveal(int8 score, bytes16 salt, address assessor)
  {
    if(block.number - startTime <= 10)
    {
      bytes32 hash = sha3(score,salt);
      if(commits[assessor] == hash)
      {
        if(msg.sender == assessor)
        {
          scores[msg.sender] = score;
          assessorState[assessor] = State.Done;
          done++;
        }
        else
        {
          Concept(concept).setBalance(msg.sender,UserRegistry(userRegistry).getBalance(msg.sender) + stake[assessor]);
          stake[assessor] = 0;
          assessorState[assessor] = State.Burned;
        }
      }
      else if(msg.sender == assessor)
      {
        stake[assessor] = 0;
        assessorState[assessor] = State.Burned;
        done++;
      }
    }
    else
    {
      for(uint i = 0; i < assessors.length; i++)
      {
        if(assessorState[assessors[i]] == State.Committed)
        {
          stake[assessors[i]] = 0;
          assessorState[assessors[i]] = State.Burned;
          done++;
        }
      }
    }
    if(done == size)
    {
      calculateResult();
    }
  }

  function calculateResult() onlyThis()
  {
    mapping(uint => int[]) clusters;
    for(uint j = 0; j < size; j++)
    {
      if(assessorState[assessors[i]] == State.Done)
      {
        finalAssessors.push(assessors[i]);
      }
    }
    int[] memory score = new int[] (finalAssessors.length);
    uint largestClusterIndex = 0;
    int averageScore;
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      score[i] = scores[finalAssessors[i]];
    }
    int meanAbsoluteDeviation = Math(math).calculateMAD(score,int(finalAssessors.length));
    for(uint l = 0; l < score.length; l++)
    {
      for(uint m = 0; m < score.length; m++)
      {
        if(score[l] - score[m] <= meanAbsoluteDeviation)
        {
          clusters[l].push(score[m]);
        }
      }
      if(clusters[l].length > clusters[largestClusterIndex].length)
      {
        largestClusterIndex = l;
      }
    }
    for(uint o = 0; o < clusters[largestClusterIndex].length; o++)
    {
      averageScore += clusters[largestClusterIndex][o];
      inRewardCluster[clusters[largestClusterIndex][o]] = true;
    }
    averageScore /= int(clusters[largestClusterIndex].length);
    finalScore = averageScore;
    payout(clusters[largestClusterIndex].length);
  }

  function payout(uint largestSize) onlyThis()
  {
    for(uint i = 0; i < size; i++)
    {
      int score = scores[assessors[i]];
      int scoreDistance = ((score - finalScore)*100)/finalScore;
      if(scoreDistance < 0)
      {
        scoreDistance *= -1;
      }
      uint payoutValue = 1; // TODO Figure out new payout algorithm
      if(inRewardCluster[score] == true)
      {
        uint q = 1; //Inflation rate factor, WE NEED TO FIGURE THIS OUT AT SOME POINT
        payoutValue = q*cost*((100 - uint(scoreDistance))/100);
        Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).getBalance(assessors[i]) + payoutValue);
        User(assessors[i]).notification(concept, 15); //You Have Received Payment For Your Assessment
      }
      if(inRewardCluster[score] == false)
      {
        payoutValue = stake[assessors[i]]*((200 - uint(scoreDistance))/200);
        Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).getBalance(assessors[i]) + payoutValue);
        User(assessors[i]).notification(concept, 16); //You Have Received A Fine For Your Assessment
      }
    }
    Concept(concept).finishAssessment(finalScore, assessee, address(this));();
  }

}
