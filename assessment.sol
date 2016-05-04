import "lib/random.sol";
import "master.sol";
import "tag.sol";
import "creator.sol";
import "user.sol";

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
  address currentAssessor;
  int finalScore;
  bool finalResult;
  uint taskCreationTime;
  uint taskCompletionTime;
  uint taskGradingTime;
  uint referenceTime;
  uint numberCancelled;

  function Assessment(address assesseeAddress, address tagAddress, address masterAddress, uint timeForTaskCreation)
  {
    assessee = assesseeAddress;
    tag = tagAddress;
    master = masterAddress;
    referenceTime = block.timestamp;
    taskCreationTime = timeForTaskCreation;
  }

  function getTaskCreationTime() constant returns(uint)
  {
      return taskCreationTime;
  }

  function getTaskCompletionTime() constant returns(uint)
  {
      return taskCompletionTime;
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

  function setPotentialAssessor()
  {
    bool potentialAssessorSet = false;
    while(potentialAssessorSet == false)
    {
      address randomAssessor = assessorPool[getRandom(assessorPool.length)];
      if(assessors[randomAssessor] == 0)
      {
        assessors[randomAssessor] = 3;
        currentAssessor = randomAssessor;
        potentialAssessorSet = true;
        User(randomAssessor).notification("Called As A Potential Assessor",tag, 1);
      }
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

  function setTask(string data, uint timeLimit)
  {
    if(numberCancelled >= numberOfAssessors)
    {
      cancelAssessment();
    }
    if(assessors[currentAssessor] == 5 && now - referenceTime <= taskCreationTime)
    {
      assessmentTasks[currentAssessor] = data;
      taskCompletionTime = timeLimit;
      assessors[currentAssessor] = 6;
      User(currentAssessor).notification("Task Data Inputted", tag, 5);
      User(assessee).notification("New Task Available", tag, 7);
      referenceTime = now;
    }
    if(now - referenceTime > taskCreationTime && assessors[currentAssessor]!=5)
    {
      User(currentAssessor).notification("Did Not Submit Task On Time", tag, 6);
      Master(master).mapTokenBalance(currentAssessor, Master(master).getTokenBalance(currentAssessor) - 1);
      User(currentAssessor).setReputation(User(currentAssessor).getReputation() + 1);
      numberCancelled++;
      setPotentialAssessor();
    }
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

  function getTask(address assessorAddress) constant returns(string)
  {
    return assessmentTasks[assessorAddress];
  }

  function setResponse(string data)
  {
    if(assessors[currentAssessor] == 6 && now - referenceTime <= taskCompletionTime)
    {
      assessmentResponses[currentAssessor] = data;
      assessors[currentAssessor] = 7;
      User(currentAssessor).notification("Task Response Inputted", tag, 10);
      taskGradingTime = (3*(now - referenceTime))/2;
      referenceTime = now;
    }
    if(now - referenceTime > taskCompletionTime && assessors[currentAssessor]!=6)
    {
      User(assessee).notification("Did Not Submit Task Response On Time", tag, 11);
      Master(master).mapTokenBalance(currentAssessor, Master(master).getTokenBalance(assessee) - 1);
      cancelAssessment();
    }
  }

  function getResponse(address assesseeAddress) constant returns(string)
  {
    return assessmentResponses[assesseeAddress];
  }

  function setResult(int score)
  {
    if(numberCancelled >= numberOfAssessors)
    {
      cancelAssessment();
    }
    if(assessors[currentAssessor] == 7 && now - referenceTime <= taskGradingTime)
    {
      assessmentResults[currentAssessor] = score;
      addressFromScore[score] = currentAssessor;
      User(assessee).notification("Task Result Inputted", tag, 12);
      finalAssessors.push(currentAssessor);
    }
    if(now - referenceTime <= taskGradingTime && assessors[currentAssessor] != 7)
    {
      User(currentAssessor).notification("Did Not Submit Task Results On Time", tag, 13);
      User(assessee).notification("Assessor Has Not Graded In Time", tag, 14);
      Master(master).mapTokenBalance(currentAssessor, Master(master).getTokenBalance(assessee) - 1);
      User(currentAssessor).setReputation(User(currentAssessor).getReputation() + 1);
      numberCancelled++;
      setPotentialAssessor();
    }
    if(finalAssessors.length == numberOfAssessors)
    {
      calculateResult();
    }
    if(finalAssessors.length < numberOfAssessors)
    {
      setPotentialAssessor();
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

  function confirmAssessor(uint confirm, bool timeKnow)
  {
    if(numberCancelled >= numberOfAssessors)
    {
      cancelAssessment();
    }
    if(assessors[currentAssessor] != 0 && now - referenceTime <= 180)
    {
      assessors[currentAssessor] = confirm;
      if(confirm == 1)
      {
        User(currentAssessor).notification("Confirmed As Potential Assessor", tag, 2);
        referenceTime = now;
      }
      if(confirm == 2 || confirm == 4)
      {
        User(currentAssessor).notification("Confirmed As Not Assessing", tag, 3);
        numberCancelled ++;
        setPotentialAssessor();
      }
      if(confirm == 5)
      {
        User(currentAssessor).notification("Confirmed As Assessing", tag, 9);
        referenceTime = now;
      }
    }
    if(now - referenceTime > 180)
    {
      if(timeKnow == false && assessors[currentAssessor]==3)
      {
      User(currentAssessor).notification("Did Not Respond In Time To Be Assessor", tag, 4);
      Master(master).mapTokenBalance(currentAssessor, Master(master).getTokenBalance(currentAssessor) - 1);
      setPotentialAssessor();
      }
      if(timeKnow == true && assessors[currentAssessor]==1)
      {
        User(currentAssessor).notification("Did Not Respond In Time To Be Assessor", tag, 4);
        setPotentialAssessor();
      }
    }
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
