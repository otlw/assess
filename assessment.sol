import "lib/random.sol";
import "master.sol";
import "tag.sol";
import "creator.sol";
import "user.sol";
import "tagMaker.sol";

//Defines the meta-contract for an assessment
contract Assessment
{
  address assessee; //We need a better word for this
  address[] assessorPool;
  mapping (address => uint) assessors;
  address[] finalAssessors;
  address tag;
  address master;
  uint poolSizeRemaining;
  uint numberOfAssessors;
  mapping(address => string) assessmentTasks; //Given by the assessors as IPFS hashes
  mapping(address => string) assessmentResponses; //Given by the assessee as IPFS hashes
  mapping(address => int) assessmentResults; //Pass/Fail and Score given by assessors
  mapping(int => address) addressFromScore;
  mapping(int => bool) inRewardCluster;
  mapping(address => string[]) data;
  address[] potentialAssessors;
  int finalScore;
  bool finalResult;
  uint referenceTime;
  uint numberCancelled;
  uint doneAssessors;
  uint resultsSet;

  function Assessment(address assesseeAddress, address tagAddress, address masterAddress)
  {
    assessee = assesseeAddress;
    tag = tagAddress;
    master = masterAddress;
    referenceTime = block.timestamp;
  }

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
    bool potentialAssessorSet = false;
    numberCancelled = 0;
    for(uint i = 0; i < needed; i++)
    {
      while(potentialAssessorSet == false)
      {
        address randomAssessor = assessorPool[getRandom(assessorPool.length)];
        if(assessors[randomAssessor] == 0)
        {
          assessors[randomAssessor] = 3;
          potentialAssessors.push(randomAssessor);
          User(randomAssessor).notification("Called As A Potential Assessor",tag, 1);
          potentialAssessorSet = true;
        }
      }
      potentialAssessorSet = false;
    }
    referenceTime = now;
  }

  function getAssessorPoolLength() constant returns(uint)
  {
      return assessorPool.length;
  }

  function getRandom(uint i) constant returns(uint)
  {
    return 12;
  }

  function confirmAssessor(uint confirm)
  {
  if(assessors[msg.sender] != 0 && now - referenceTime <= 180)
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
    if(now - referenceTime > 180)
    {
      for(uint i = 0; i < potentialAssessors.length; i++)
      {
        address currentAssessor = potentialAssessors[i];
        if(assessors[currentAssessor] == 3)
        {
          User(currentAssessor).notification("Did Not Respond In Time To Be Assessor", tag, 4);
          assessors[currentAssessor] = 4;
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
  }

  function cancelAssessment()
  {
    User(assessee).notification("Assessment Cancled", tag, 8);
    for(uint i = 0; i < finalAssessors.length; i++)
    {
      User(finalAssessors[i]).notification("Assessment Cancled", tag, 8);
    }
    suicide(master);
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
    if(doneAssessors == finalAssessors.length)
    {
      assessmentResults[msg.sender] = score;
      addressFromScore[score] = msg.sender;
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
  }

  function calculateResult()
  {
    int[][] memory clusters;
    int[] memory scores;
    uint n = 0;
    uint largestClusterIndex = 0;
    int averageScore;
    for(uint i = 0; i < numberOfAssessors; i++)
    {
      scores[i] = assessmentResults[finalAssessors[i]];
    }
    int meanAbsoluteDeviation = calculateMAD(scores,int(numberOfAssessors));
    for(uint l = 0; l < scores.length; l++)
    {
      for(uint m = 0; m < scores.length; m++)
      {
        n = 0;
        if(scores[l] - scores[m] <= meanAbsoluteDeviation)
        {
          clusters[l][n] = (scores[m]);
          n++;
        }
      }
      if(clusters[l].length > clusters[largestClusterIndex].length)
      {
        largestClusterIndex = l;
      }
    }
    for(uint o = 0; o < clusters[largestClusterIndex].length; n++)
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

  function returnResults()
  {
    Tag(tag).finishAssessment(finalResult, finalScore, assessee, address(this));
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
        Master(master).mapTokenBalance(finalAssessors[i], Master(master).getTokenBalance(finalAssessors[i]) + payoutValue);
        User(finalAssessors[i]).notification("You Have Received Payment For Your Assessment", tag, 15);
      }
      if(inRewardCluster[score] == true)
      {
        Master(master).mapTokenBalance(finalAssessors[i], Master(master).getTokenBalance(finalAssessors[i]) - payoutValue);
        User(finalAssessors[i]).notification("You Have Received A Fine For Your Assessment", tag, 16);
      }
    }
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
