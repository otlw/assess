import "lib/math.sol";
import "userMaster.sol";
import "concept.sol";
import "user.sol";
import "conceptMaster.sol";

contract Assessment
{
  address assessee; //The address of the user being assessed
  address[] assessors;
  mapping (address => uint) assessorState;
  address[] assessorPool; //The addresses of the user's that the assessors are randomly selected from
  address concept;
  address userMaster;
  address conceptMaster;
  address math;
  uint public startTime;
  uint public size;
  uint cost;
  uint poolSizeRemaining;
  mapping(address => string[]) public data; //IFFS hashes of data that can be passed between the assessors and the assessee for the assessment to occur
  mapping(address => bytes32) commits;
  mapping(address => uint) stake;
  uint done = 0;
  mapping(address => int) scores;
  mapping(int => bool) inRewardCluster;
  int finalScore;
  event DataSet(address _dataSetter, uint _index);

  /*
  @type: modifier
  @name: onlyConcept
  @purpose: to only allow the Concept contract that spawned this assessment to call a function to which this modifier is applied
  */
  modifier onlyConcept()
  {
    if(msg.sender != concept) //checks if msg.sender is the concept that spawned this assessment
    {
      throw; //throws the function call if not
    }
    _;
  }

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

  function Assessment(address assesseeAddress, address userMasterAddress, address conceptMasterAddress, address mathAddress, uint assessmentSize, uint assessmentCost)
  {
    assessee = assesseeAddress;
    concept = msg.sender;
    userMaster = userMasterAddress;
    conceptMaster = conceptMasterAddress;
    math = mathAddress;
    startTime = block.timestamp;
    size = assessmentSize;
    cost = assessmentCost;
    poolSizeRemaining = size*20;
    User(assessee).notification(concept, 0); //Assessment made
  }


  function cancelAssessment() onlyConceptAssessment()
  {
    Concept(concept).setBalance(assessee, UserMaster(userMaster).getBalance(assessee) + cost*size);
    User(assessee).notification(concept, 3); //Assessment Cancled and you have been refunded
    for(uint i = 0; i < assessors.length; i++)
    {
      Concept(concept).setBalance(assessors[i], UserMaster(userMaster).getBalance(assessors[i]) + cost);
      User(assessors[i]).notification(concept, 3); //Assessment Cancled and you have been refunded
    }
    suicide(conceptMaster);
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
    if(Concept(ConceptMaster(conceptMaster).mewAddress()).getOwnerLength() < poolSizeRemaining) //Checks if the requested pool size is greater than the number of users in the system
    {
      for(uint i = 0; i < Concept(ConceptMaster(conceptMaster).mewAddress()).getOwnerLength(); i++) //If so, all users in the system are added to the pool
      {
        assessorPool.push(Concept(ConceptMaster(conceptMaster).mewAddress()).owners(i));
        User(Concept(ConceptMaster(conceptMaster).mewAddress()).owners(i)).notification(concept, 1); //Called As A Potential Assessor
        assessorState[Concept(ConceptMaster(conceptMaster).mewAddress()).owners(i)] = 1;
      }
      poolSizeRemaining = 0;
    }
    for(uint j = 0; j < Concept(conceptAddress).getOwnerLength() && poolSizeRemaining > 0; j++) //Iterates through all the owners of the concept corresponding to concept address while the remaining amount of user's desired in the pool is greater than 0
    {
      uint numberSet = 0; //initializes a variable to keep track of how many assessors this concept has added to the pool
      if(numberSet < Concept(conceptAddress).getOwnerLength()/10) //Checks if the number of assessors provided by this concept is less than 10% of the owners of the concept
      {
        address randomUser = Concept(conceptAddress).owners(Math(math).getRandom(seed + j, Concept(conceptAddress).getOwnerLength()-1)); //gets a random owner of the concept
        if(UserMaster(userMaster).getAvailability(randomUser) == true && (uint(Concept(conceptAddress).currentScores(randomUser))*Concept(conceptAddress).assessmentSizes(randomUser)) > (now%(uint(Concept(conceptAddress).maxScore())*Concept(conceptAddress).maxSize()))) //Checks if the randomly drawn is available and then puts it through a random check that it has a higher chance of passing if it has had a higher score and a larger assessment
        {
          assessorPool.push(randomUser); //adds the randomly selected user to the assessor pool
          User(randomUser).notification(concept, 1); //Called As A Potential Assessor
          assessorState[randomUser] = 1;
          poolSizeRemaining--; //reduces desired amount of users to be added to the assessor pool by 1
          numberSet++; //increases numberSet by 1
        }
      }
      else
      {
        break; //exits this for loop if 10% or more of the concept owners are in the assessment pool
      }
    }
    for(uint l = 0; l < Concept(conceptAddress).getParentsLength() || l < Concept(conceptAddress).getChildrenLength(); l++) //Recursively calls this function in such a way that the parent and child concepts' owners will be used to potentially populate the assessment pool
    {
      if(l < Concept(conceptAddress).getParentsLength()) //Makes sure there are still parent concepts left to call
      {
        setAssessorPool(Concept(conceptAddress).parentConcepts(l), Math(math).getRandom(seed + l, Concept(conceptAddress).getOwnerLength()-1));
      }
      if(l < Concept(conceptAddress).getChildrenLength()) //Makes sure there are still child concepts left to call
      {
        setAssessorPool(Concept(conceptAddress).childConcepts(l), Math(math).getRandom(seed + l, Concept(conceptAddress).getOwnerLength()-1));
      }
    }
  }

  function confirmAssessor()
  {
    if(block.number - startTime <= 15 && assessorState[msg.sender] == 1 && assessors.length < size && UserMaster(userMaster).getBalance(msg.sender) >= cost)
    {
      assessors.push(msg.sender);
      assessorState[msg.sender] = 2;
      stake[msg.sender] = cost;
      Concept(concept).setBalance(msg.sender,UserMaster(userMaster).getBalance(msg.sender) - cost);
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

  function reveal(int score, bytes16 salt, address assessor)
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
          Concept(concept).setBalance(msg.sender,UserMaster(userMaster).getBalance(msg.sender) + stake[assessor]);
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
    address[] finalAssessors;
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
        Concept(concept).setBalance(assessors[i], UserMaster(userMaster).getBalance(assessors[i]) + payoutValue);
        User(assessors[i]).notification(concept, 15); //You Have Received Payment For Your Assessment
      }
      if(inRewardCluster[score] == false)
      {
        Concept(concept).setBalance(assessors[i], UserMaster(userMaster).getBalance(assessors[i]) - payoutValue);
        User(assessors[i]).notification(concept, 16); //You Have Received A Fine For Your Assessment
      }
    }
    returnResults();
  }

  function returnResults() onlyThis()
  {
    Concept(concept).finishAssessment(finalScore, assessee, address(this));
  }
}
