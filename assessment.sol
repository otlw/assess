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
  mapping (address => uint) assessorState;
  address[] assessorPool; //The addresses of the user's that the assessors are randomly selected from
  address concept;
  address userRegistry;
  address conceptRegistry;
  address math = 0x90B66E80448eb60938FAed4A738dE0D5b630B2Fd;
  uint public startTime;
  uint public size;
  uint cost;
  uint poolSizeRemaining;
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
    if(msg.sender != assessee && assessorState[msg.sender] == 0) //Checks if msg.sender has the same address as either the assessee or an assessor
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

  function Assessment(address assesseeAddress, address userRegistryAddress, address conceptRegistryAddress, uint assessmentSize, uint assessmentCost)
  {
    assessee = assesseeAddress;
    concept = msg.sender;
    userRegistry = userRegistryAddress;
    conceptRegistry = conceptRegistryAddress;
    startTime = block.timestamp;
    size = assessmentSize;
    cost = assessmentCost;
    poolSizeRemaining = size*20;
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

  function addAssessorToPool(address assessor) onlyConcept()
  {
    User(assessor).notification(concept, 1); //Called As A Potential Assessor
    assessorState[assessor] = 1;
  }


  /*
  @type: function
  @purpose: To recursively set the pool to draw assessors from in the assessment
  @param: address conceptAddress = the concept that assessors are currently being drawn from
  @param: address assessment = the address of the assessment that assessors are being drawn for
  @param: uint seed = the seed number for random number generation
  @param: uint size = the desired size of the assessment
  @returns: nothing
  */
  function setAssessorPool(address conceptAddress, uint seed) onlyConceptAssessment()
  {
    if(Concept(ConceptRegistry(conceptRegistry).mewAddress()).getOwnerLength() < poolSizeRemaining) //Checks if the requested pool size is greater than the number of users in the system
    {
      for(uint i = 0; i < Concept(ConceptRegistry(conceptRegistry).mewAddress()).getOwnerLength(); i++) //If so, all users in the system are added to the pool
      {
        assessorPool.push(Concept(ConceptRegistry(conceptRegistry).mewAddress()).owners(i));
        User(Concept(ConceptRegistry(conceptRegistry).mewAddress()).owners(i)).notification(concept, 1); //Called As A Potential Assessor
        assessorState[Concept(ConceptRegistry(conceptRegistry).mewAddress()).owners(i)] = 1;
      }
    }
    else
    {
    Concept(concept).getAssessors(poolSizeRemaining, seed, address(this));
  }
  }

  function confirmAssessor()
  {
    if(block.number - startTime <= 15 && assessorState[msg.sender] == 1 && assessors.length < size && UserRegistry(userRegistry).getBalance(msg.sender) >= cost)
    {
      assessors.push(msg.sender);
      assessorState[msg.sender] = 2;
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

  function setData(string newData) onlyAssessorAssessee()
  {
    data[msg.sender].push(newData);
    DataSet(msg.sender, data[msg.sender].length - 1);
  }

  function commit(bytes32 hash)
  {
    if(assessorState[msg.sender] == 2)
    {
      commits[msg.sender] = hash;
      assessorState[msg.sender] == 3;
      done++;
      if(done <= size/2)
      {
        startTime = block.number;
      }
    }
    if(done > size/2)
    {
      for(uint i = 0; i < assessors.length; i++)
      {
        if(assessorState[assessors[i]] == 2)
        {
          //burn da stakes
        }
        if(stake[assessors[i]] == 0)
        {
          assessorState[assessors[i]] = 4;
          done++;
        }
      }
    }
    if(done == size)
    {
      for(uint j = 0; j < assessors.length; j++)
      {
        if(assessorState[assessors[j]] == 3)
        {
          User(assessors[j]).notification(concept, 5); //Send in Score
        }
      }
      startTime = block.number;
      done = 0;
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
          assessorState[assessor] = 5;
          done++;
        }
        else
        {
          Concept(concept).setBalance(msg.sender,UserRegistry(userRegistry).getBalance(msg.sender) + stake[assessor]);
          stake[assessor] = 0;
          assessorState[assessor] = 4;
        }
      }
      else if(msg.sender == assessor)
      {
        stake[assessor] = 0;
        assessorState[assessor] = 4;
        done++;
      }
    }
    else
    {
      for(uint i = 0; i < assessors.length; i++)
      {
        if(assessorState[assessors[i]] == 3)
        {
          stake[assessors[i]] = 0;
          assessorState[assessors[i]] = 4;
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
      if(assessorState[assessors[i]] == 5)
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
      uint payoutValue = 1; //Figure out new payout algorithm
      if(inRewardCluster[score] == true)
      {
        Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).getBalance(assessors[i]) + payoutValue);
        User(assessors[i]).notification(concept, 15); //You Have Received Payment For Your Assessment
      }
      if(inRewardCluster[score] == false)
      {
        Concept(concept).setBalance(assessors[i], UserRegistry(userRegistry).getBalance(assessors[i]) - payoutValue);
        User(assessors[i]).notification(concept, 16); //You Have Received A Fine For Your Assessment
      }
    }
    Concept(concept).finishAssessment(finalScore, assessee, address(this));();
  }

}
