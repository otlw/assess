import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "user.sol";
import "tagMaster.sol";

//Defines the meta-contract for an assessment
contract Assessment
{
  address assessee; //We need a better word for this
  address[] assessorPool;
  mapping (address => uint) assessors;
  uint calledAssessors = 0;
  address[] finalAssessors;
  address tag;
  address userMaster;
  address tagMaster;
  address random;
  uint poolSizeRemaining;
  uint numberOfAssessors;
  mapping(address => string) assessmentTasks; //Given by the assessors as IPFS hashes
  mapping(address => string) assessmentResponses; //Given by the assessee as IPFS hashes
  mapping(address => int) assessmentResults; //Pass/Fail and Score given by assessors
  mapping(int => bool) inRewardCluster;
  mapping(address => string[]) data;
  address[] potentialAssessors;
  int finalScore;
  bool finalResult;
  uint referenceTime;
  uint numberCancelled = 0;
  uint doneAssessors = 0;
  uint resultsSet = 0;

  function Assessment(address assesseeAddress, address tagAddress, address userMasterAddress, address tagMasterAddress, address randomAddress)
  {
    assessee = assesseeAddress;
    tag = tagAddress;
    userMaster = userMasterAddress;
    tagMaster = tagMasterAddress;
    random = randomAddress;
    referenceTime = block.timestamp;
  }

  event PotentialAssessorSet(address _potentialAssessor);
  event DataSet(address _dataSetter, uint _index);

  function setNumberOfAssessors(uint number)
  {
    numberOfAssessors = number;
  }

  function getNumberOfAssessors() constant returns(uint)
  {
    return numberOfAssessors;
  }

  function setAssessmentPoolSize(uint sizeRemaining)
  {
    poolSizeRemaining = sizeRemaining;
  }

  function getAssessmentPoolSize() constant returns(uint)
  {
    return poolSizeRemaining;
  }

  function addToAssessorPool(address potentialAddress)
  {
    assessorPool.push(potentialAddress);
  }

  function setPotentialAssessor(uint needed)
  {
    if(assessorPool.length - calledAssessors < needed)
    {
      cancelAssessment();
    }
    else
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

  function getAssessorPoolLength() constant returns(uint)
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

  function notifyStart()
  {
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      User(finalAssessors[i]).notification("Assessment Has Started", tag, 17);
    }
    User(assessee).notification("Assessment Has Started", tag, 17);
  }

  function setData(string newData)
  {
    data[msg.sender].push(newData);
    DataSet(msg.sender, data[msg.sender].length - 1);
  }

  function getData(address dataSetter, uint index) constant returns(string)
  {
    return data[dataSetter][index];
  }

  function cancelAssessment()
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
    if(doneAssessors == finalAssessors.length)
    {
      for(uint i = 0; i < finalAssessors.length; i++)
      {
        User(finalAssessors[i]).notification("Send in Score", tag, 18);
      }
    }
  }

  function setResult(int score)
  {
    if(doneAssessors == finalAssessors.length && assessors[msg.sender] == 5)
    {
      assessmentResults[msg.sender] = score;
      assessors[msg.sender] = 6;
      resultsSet++;
    }
    if(resultsSet == finalAssessors.length)
    {
      calculateResult();
    }
  }

  function calculateMAD(int[] scores, int n) constant returns(int)
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

  function calculateResult()
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

  function payout(uint largestSize)
  {
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      int score = assessmentResults[finalAssessors[i]];
      int scoreDistance = ((score - finalScore)*100)/finalScore;
      if(scoreDistance < 0)
      {
        scoreDistance *= -1;
      }
      uint distance = uint(scoreDistance);
      uint payoutValue = uint((500/(100 - scoreDistance))) * (finalAssessors.length/largestSize);
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
    }
  }

  function returnResults()
  {
    Tag(tag).finishAssessment(finalResult, finalScore, assessee, address(this));
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
