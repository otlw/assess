import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "user.sol";
import "tagMaster.sol";

/*
@type: contract
@name: Assessment
@purpose: To facilitate the assessment process
*/
contract Assessment
{
  address assessee; //The address of the user being assessed
  address[] assessorPool; //The addresses of the user's that the assessors are randomly selected from
  mapping (address => uint) assessors; //A mapping of the assessors to their current status
  uint calledAssessors = 0; //The number of assessors that have been called to assess
  address[] finalAssessors; //The addresses of the final set of assessors who have completed the assessment process
  address tag; //The address of the tag that is being assessed
  address userMaster; //The address of the UserMaster
  address tagMaster; //The address of the TagMaster
  address random; //The address of the Random contract
  uint poolSizeRemaining; //The remaining number of users to be added to the assessor pool
  uint numberOfAssessors; //The number of assessors requested for this assessment
  mapping(address => int) assessmentResults; //Pass/Fail and Score given by assessors
  mapping(int => bool) inRewardCluster; //A bool that reflects whether or not a score is within the largest cluster of scores
  mapping(address => string[]) data; //IFFS hashes of data that can be passed between the assessors and the assessee for the assessment to occur
  address[] potentialAssessors; //The addresses of those randomly selected to be assessors (but may not have confirmed yes)
  int finalScore; //The final score of the assessee
  bool finalResult; //The final pass/fail result of the assessee
  uint referenceTime; //Time used as reference to determine how much time has passed for a certain portion of the assessment
  uint referenceBlock; //Block used as reference to determine how many blocks have passed for a certain portion of the assessment
  uint numberCancelled = 0; //The number of assessors who have refused to join the assessment
  uint doneAssessors = 0; //The number of assessors that are done assessing
  uint resultsSet = 0; //The number of assessors who have set their score for the assessee
  uint assessmentTime; //The amount of time allotted for the assessors to judge the assessee and determine their score

  /*
  @type: modifier
  @name: onlyTag
  @purpose: to only allow the Tag contract that spawned this assessment to call a function to which this modifier is applied
  */
  modifier onlyTag
  {
    if(msg.sender != tag) //checks if msg.sender is the tag that spawned this assessment
    {
      throw; //throws the function call if not
    }
  }

  /*
  @type: modifier
  @name: onlyThis
  @purpose: to only allow the this contract to call a function to which this modifier is applied
  */
  modifier onlyThis
  {
    if(msg.sender != address(this)) //Checks if msg.sender is this contract
    {
      throw; //Throws out the function call if it isn't
    }
  }

  /*
  @type: modifier
  @name: onlyAssessorAssessee
  @purpose: to only allow the assessors and assessee to call a function to which this modifier is applied
  */
  modifier onlyAssessorAssessee
  {
    if(msg.sender != assessee && assessors[msg.sender] == 0) //Checks if msg.sender has the same address as either the assessee or an assessor
    {
      throw; //Throws the function call if not
    }
  }

  /*
  @type: modifier
  @name: onlyTagAssessment
  @purpose: to only allow the this contract or the Tag contract that spawned it to call a function to which this modifier is applied
  */`
  modifier onlyTagAssessment
  {
    if(msg.sender != address(this) && msg.sender != tag) //Checks if msg.sender has the same address as this contract or the Tag that spawned it
    {
      throw; //Throws the function call if not
    }
  }

  function Assessment(address assesseeAddress, address tagAddress, address userMasterAddress, address tagMasterAddress, address randomAddress, uint time)
  {
    assessee = assesseeAddress;
    tag = tagAddress;
    userMaster = userMasterAddress;
    tagMaster = tagMasterAddress;
    random = randomAddress;
    referenceTime = block.timestamp;
    referenceBlock = block.number;
    assessmentTime = time;
    User(assessee).notification("Assessment made", tag, 0);
  }

  event PotentialAssessorSet(address _potentialAssessor);
  event DataSet(address _dataSetter, uint _index);

  function getReferenceBlock() onlyTag returns(uint)
  {
    return referenceBlock;
  }
  function setNumberOfAssessors(uint number) onlyTag
  {
    numberOfAssessors = number;
  }

  function getNumberOfAssessors() onlyTag constant returns(uint)
  {
    return numberOfAssessors;
  }

  function setAssessmentPoolSize(uint sizeRemaining) onlyTag
  {
    if(poolSizeRemaining > 0)
    {
      poolSizeRemaining = sizeRemaining;
    }
  }

  function getAssessmentPoolSize() onlyTag constant returns(uint)
  {
    return poolSizeRemaining;
  }

  function addToAssessorPool(address potentialAddress) onlyTag
  {
    assessorPool.push(potentialAddress);
  }

  function setPotentialAssessor(uint needed)
  {
    if(assessorPool.length - calledAssessors < needed)
    {
      cancelAssessment();
    }
    else if(msg.sender == address(this) || msg.sender == tag)
    {
      bool potentialAssessorSet = false;
      numberCancelled = 0;
      uint randomNumber = Random(random).getRandom(assessorPool.length, assessorPool.length);
      for(uint i = 0; i < needed; i++)
      {
        while(potentialAssessorSet == false)
        {
          address randomAssessor = assessorPool[randomNumber];
          if(assessors[randomAssessor] == 0)
          {
            assessors[randomAssessor] = 3;
            potentialAssessors.push(randomAssessor);
            calledAssessors++;
            User(randomAssessor).notification("Called As A Potential Assessor",tag, 1);
            randomNumber = Random(random).getRandom(assessorPool.length, randomNumber);
            PotentialAssessorSet(randomAssessor);
            potentialAssessorSet = true;
          }
        }
        potentialAssessorSet = false;
      }
      referenceTime = now;
    }
  }

  function getAssessorPoolLength() onlyTag constant returns(uint)
  {
    return assessorPool.length;
  }

  function confirmAssessor(uint confirm)
  {
    if(assessors[msg.sender] != 0 && now - referenceTime <= 300)
    {
      assessors[msg.sender] = confirm;
      if(confirm == 1)
      {
        User(msg.sender).notification("Confirmed As Assessing", tag, 2);
        finalAssessors.push(msg.sender);
        referenceTime = now;
      }
      if(confirm == 2)
      {
        User(msg.sender).notification("Confirmed As Not Assessing", tag, 3);
        numberCancelled ++;
      }
    }
    if(now - referenceTime > 300)
    {
      for(uint i = 0; i < potentialAssessors.length; i++)
      {
        if(assessors[potentialAssessors[i]] == 3)
        {
          User(potentialAssessors[i]).notification("Did Not Respond In Time To Be Assessor", tag, 4);
          assessors[potentialAssessors[i]] = 4;
          numberCancelled++;
        }
      }
      setPotentialAssessor(numberCancelled);
    }
    if(numberCancelled == 0)
    {
      notifyStart();
    }
  }

  function notifyStart() onlyThis
  {
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      User(finalAssessors[i]).notification("Assessment Has Started", tag, 17);
    }
    User(assessee).notification("Assessment Has Started", tag, 17);
    referenceTime = now;
  }

  function setData(string newData) onlyAssessorAssessee
  {
    data[msg.sender].push(newData);
    DataSet(msg.sender, data[msg.sender].length - 1);
  }

  function getData(address dataSetter, uint index) constant returns(string)
  {
    return data[dataSetter][index];
  }

  function cancelAssessment() onlyTagAssessment
  {
    User(assessee).notification("Assessment Cancled", tag, 8);
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      User(finalAssessors[i]).notification("Assessment Cancled", tag, 8);
    }
    suicide(tagMaster);
  }

  function doneAssessing()
  {
    if(assessors[msg.sender] == 1)
    {
      assessors[msg.sender] = 5;
      doneAssessors++;
    }
    if(referenceTime - now > assessmentTime && doneAssessors != finalAssessors.length)
    {
      for(uint i = 0; i < finalAssessors.length; i++)
      {
        if(assessors[finalAssessors[i]] == 1)
        {
          assessors[finalAssessors[i]] = 5;
          doneAssessors++;
        }
      }
    }
    if(doneAssessors == finalAssessors.length)
    {
      for(uint n = 0; n < finalAssessors.length; n++)
      {
        User(finalAssessors[n]).notification("Send in Score", tag, 18);
      }
      referenceTime = block.number; //use referenceTime to refer to the block number instead of timestamp
    }
  }

  function setResult(int score)
  {
    if(doneAssessors == finalAssessors.length && assessors[msg.sender] == 5 && block.number - referenceTime == 5)
    {
      assessmentResults[msg.sender] = score;
      assessors[msg.sender] = 6;
      resultsSet++;
    }
    if(resultsSet < finalAssessors.length && block.number - referenceTime > 5)
    {
      for(uint i = 0; i < finalAssessors.length; i++)
      {
        if(assessors[finalAssessors[i]] == 5)
        {
          assessmentResults[finalAssessors[i]] = 0;
          assessors[finalAssessors[i]] = 6;
          resultsSet++;
        }
      }
    }
    if(resultsSet == finalAssessors.length)
    {
      calculateResult();
    }
  }

  function calculateMAD(int[] scores, int n) onlyThis constant returns(int)
  {
    int meanScore;
    int totalRelativeDistance;
    int meanAbsoluteDeviation;
    for(uint j = 0; j < scores.length; j++)
    {
      meanScore += scores[j];
      inRewardCluster[scores[j]] = false;
    }
    meanScore /= n;
    for(uint k = 0; k < scores.length; k++)
    {
      int distanceFromMean = scores[k] - meanScore;
      if(distanceFromMean < 0)
      {
        distanceFromMean *= -1;
      }
      totalRelativeDistance += distanceFromMean;
    }
    meanAbsoluteDeviation = totalRelativeDistance/n;
    return meanAbsoluteDeviation;
  }

  function calculateResult() onlyThis
  {
    mapping(uint => int[]) clusters;
    int[] memory scores = new int[] (finalAssessors.length);
    uint largestClusterIndex = 0;
    int averageScore;
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      scores[i] = assessmentResults[finalAssessors[i]];
    }
    int meanAbsoluteDeviation = calculateMAD(scores,int(numberOfAssessors));
    for(uint l = 0; l < scores.length; l++)
    {
      for(uint m = 0; m < scores.length; m++)
      {
        if(scores[l] - scores[m] <= meanAbsoluteDeviation)
        {
          clusters[l].push(scores[m]);
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
    if(averageScore > 0)
    {
      finalResult = true;
    }
    if(averageScore <= 0)
    {
      finalResult = false;
    }
    payout(clusters[largestClusterIndex].length);
  }

  function payout(uint largestSize) onlyThis
  {
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      int score = assessmentResults[finalAssessors[i]];
      int scoreDistance = ((score - finalScore)*100)/finalScore;
      if(scoreDistance < 0)
      {
        scoreDistance *= -1;
      }
      int payoutValue = (int(assessmentTime*finalAssessors.length)/(100 - scoreDistance)) * int(finalAssessors.length/largestSize);
      if(inRewardCluster[score] == true)
      {
        Tag(tag).pay(finalAssessors[i], UserMaster(userMaster).getTokenBalance(finalAssessors[i]) + payoutValue);
        User(finalAssessors[i]).notification("You Have Received Payment For Your Assessment", tag, 15);
      }
      if(inRewardCluster[score] == false)
      {
        Tag(tag).pay(finalAssessors[i], UserMaster(userMaster).getTokenBalance(finalAssessors[i]) - payoutValue);
        User(finalAssessors[i]).notification("You Have Received A Fine For Your Assessment", tag, 16);
      }
      if(TagMaster(tagMaster).getTagAddressFromName("account") != tag)
      {
        Tag(tag).pay(assessee, UserMaster(userMaster).getTokenBalance(assessee) - int(assessmentTime*finalAssessors.length));
        User(assessee).notification("You have been charged for your assessment", tag, 19);
      }
    }
    returnResults();
  }

  function returnResults() onlyThis
  {
    Tag(tag).finishAssessment(finalResult, finalScore, assessee, address(this));
  }
}
