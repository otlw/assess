contract Master
{
  //Initialize master data store
  mapping (address => uint) tokenBalance;
  mapping (address => string) tagName;
  mapping (string => address) tagAddressFromName;
  mapping (address => address[]) achievements;
  mapping (address => bool) availability;
  mapping (address => address) users;

  event TagCreation
  ( string _tagName,
    address _tagAddress,
    address[] _parents);

  function Master()
  {
    tokenBalance[address(this)] = 1;
    address[] memory a;
    uint useless = addTag("account", a, "Initial Account Tag");
  }

  function mapTokenBalance(address user, uint balance)
  {
    if(tagAddressFromName[tagName[msg.sender]] == 0)
    {
      tokenBalance[user] = balance;
    }
  }
  function mapTagName(address tagAddress, string name)
  {
    tagName[tagAddress] = name;
  }
  function mapTagAddressFromName(string name, address tagAddress)
  {
    tagAddressFromName[name] = tagAddress;
  }
  function mapAchievement(address user, address achievment)
  {
    achievements[user].push(achievment);
  }
  function mapAvailability(address user, bool available)
  {
    availability[user] = available;
  }

  function getTokenBalance(address user) returns(uint)
  {
    return tokenBalance[user];
  }
  function getTagName(address tagAddress) returns(string)
  {
    return tagName[tagAddress];
  }
  function getTagAddressFromName(string name) returns(address)
  {
    return tagAddressFromName[name];
  }
  function getAchievement(address user) returns(address[])
  {
    return achievements[user];
  }
  function getNumberOfachievments(address user) returns(uint)
  {
    return achievements[user].length;
  }
  function getAvailability(address user) returns(bool)
  {
    return availability[user];
  }
 function getTagDescription(address tagAddress) returns(string)
  {
    return Tag(tagAddress).getDescription();
  }

  function addUser()
  {
    User newUser = new User(msg.sender, address(this));
    Tag(tagAddressFromName["account"]).startAssessment(address(newUser),5, 600);
  }

  function addTag(string name, address[] parentList, string description) returns(uint) //Creates a new tag contract
  {
    uint response = 0;
    address[] parents;
    if(tokenBalance[msg.sender] < 1)
    {
      response += 1;
    }
    if(tagAddressFromName[name] == 0)
    {
      response += 10;
    }
    if(response==0)
    {
      for(uint i=0; i<= parentList.length; i++) //adds all the given parents
      {
        if(parentList[i]==0)
        {
          response += 100*(10**i);
        }
        else
        {
          parents.push(parentList[i]);
        }
      }
      Tag newTag = new Tag(name, parents, address(this), description);
      address newTagAddress = address(newTag);
      tagName[newTagAddress] = name;
      tagAddressFromName[name] = newTagAddress;
      tokenBalance[msg.sender] -= 1;
      TagCreation(name, newTagAddress, parents);
    }
    return response;
  }
}

//Defines the meta-contract for a Tag
contract Tag
{
  address[] parentTags;
  address master;
  string name;
  string description;
  address[] owners; //Those who have earned the tag
  mapping(address => address[]) assessmentHistory; //All assessments completed
  mapping(address => int) scores; //All assessements scores
  event CompletedAssessment
  ( address _assessee,
    bool _pass,
    int _score,
    address _assessment);

  function Tag(string tagName, address[] parents, address masterAddress, string tagDescription)
  {
    name = tagName;
    parentTags = parents;
    master = masterAddress;
    description = tagDescription;
  }

  function getDescription() returns(string)
  {
    return description;
  }

  function getOwners() returns(address[])
  {
    return owners;
  }

  function getOwnerLength() returns(uint)
  {
    return owners.length;
  }

  function getOwner(uint index) returns(address)
  {
    return owners[index];
  }

  function getParents() returns(address[])
  {
    return parentTags;
  }

  function getParentsLength() returns(uint)
  {
    return parentTags.length;
  }

  function getParent(uint index) returns(address)
  {
      return parentTags[index];
  }

  function setAssessorPool(address tagAddress, address assessment)
  {
    for(uint i = 0; i < Tag(tagAddress).getOwnerLength() && Assessment(assessment).getAssessmentPoolSize() != 0; i++)
    {
      if(Assessment(assessment).getAssessorPoolLength() < Tag(tagAddress).getOwnerLength()/10)
      {
        address random = Tag(tagAddress).getOwner(getRandom(Tag(tagAddress).getOwnerLength()-1));
        if(Master(master).getAvailability(random) == true)
        {
          Assessment(assessment).addToAssessorPool(random);
          Assessment(assessment).setAssessmentPoolSize(Assessment(assessment).getAssessmentPoolSize() -1);
        }
      }
      else
      {
        for(uint j = 0; j < Tag(tagAddress).getParentsLength(); j++)
        {
          setAssessorPool(Tag(tagAddress).getParent(j), assessment);
        }
      }
      if(Assessment(assessment).getAssessmentPoolSize() <= 0)
      {
        Assessment(assessment).setPotentialAssessor();
      }
    }
  }

  function startAssessment(address assessee, uint size, uint timeForSettingTask)
  {
    Assessment newAssessment = new Assessment(assessee, address(this), master, timeForSettingTask);
    newAssessment.setNumberOfAssessors(size);
    newAssessment.setAssessmentPoolSize(size*20);
    setAssessorPool(address(this), address(newAssessment));
  }

  function finishAssessment(bool pass, int score, address assessee, address assessment)
  {
    if(pass == true)
    {
      owners.push(assessee);
      scores[assessee] = score;
      Master(master).mapAchievement(assessee,address(this));
    }
    if(pass == false && address(this) == Master(master).getTagAddressFromName("account"))
    {
      User(assessee).remove();
    }
    assessmentHistory[assessee].push(assessment);
    CompletedAssessment(assessee, pass, score, assessment);
  }
  function getRandom(uint i) returns(uint)
  {
    return 12;
  }
}

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

  function getTaskCreationTime() returns(uint)
  {
      return taskCreationTime;
  }

  function getTaskCompletionTime() returns(uint)
  {
      return taskCompletionTime;
  }

  function setNumberOfAssessors(uint number)
  {
    numberOfAssessors = number;
  }

  function getNumberOfAssessors() returns(uint)
  {
    return numberOfAssessors;
  }

  function setAssessmentPoolSize(uint sizeRemaining)
  {
    poolSizeRemaining = sizeRemaining;
  }

  function getAssessmentPoolSize() returns(uint)
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

  function getAssessorPoolLength() returns(uint)
  {
      return assessorPool.length;
  }

  function getRandom(uint i) returns(uint)
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

  function getTask(address assessorAddress) returns(string)
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

  function getResponse(address assesseeAddress) returns(string)
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
      setPotentialAssessor;
    }
  }

  function calculateResult()
  {
    int[][] clusters;
    int[] scores;
    int n = 0;
    int meanScore;
    int totalRelativeDistance;
    int meanAbsoluteDeviation;
    uint largestClusterIndex = 0;
    int averageScore;
    for(uint i = 0; i < numberOfAssessors; i++)
    {
      scores.push(assessmentResults[finalAssessors[i]]);
      n++;
    }
    for(uint j = 0; j < scores.length; j++)
    {
      meanScore += scores[j];
      inRewardCluster[score] = false;
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
    payout();
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

  function payout()
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
      if(inRewardCluster(score) = true)
      {
        Master(master).setTokenBalance(Master(master).getTokenBalance(finalAssessors[i]) + (500/(100 - scoreDistance)));
        User(finalAssessors[i]).notification("You Have Received Payment For Your Assessment", tag, 15);
      }
      if(inRewardCluster(score) = true)
      {
        Master(master).setTokenBalance(Master(master).getTokenBalance(finalAssessors[i]) - (500/(100 - scoreDistance)));
        User(finalAssessors[i]).notification("You Have Received A Fine For Your Assessment", tag, 16);
      }
    }
  }
}

contract User
{
  address user;
  address master;
  address[] acheivements;
  string userData;
  uint reputation;

  event Notification
  ( string _description,
    address _sender,
    address _user,
    address _tag,
    uint _code);

  function User(address userAddress, address masterAddress)
  {
    user = userAddress;
    master = masterAddress;
    reputation = 1;
  }

  function getReputation() returns(uint)
  {
    return reputation;
  }

  function setReputation(uint newReputation)
  {
    reputation = newReputation;
  }

  function notification(string description, address tag, uint code)
  {
    Notification(description, msg.sender, address(this), tag, code);
  }

  function setUserData(string hash)
  {
    userData = hash;
  }

  function getUserData() returns(string)
  {
    return userData;
  }

  function remove()
  {
    suicide(master);
  }
}
