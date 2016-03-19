contract Creator
{
  address masterAddress;

  /*
  @type: event
  @name: TagCreation
  @occasion: When a tag is created
  @purpose: To help build a data store of tags
  @stores: string _tagName = the name of the tag that was created
  @stores: address _tagAddress = the address of the tag that was created
  @stores: address[] _parents = the addresses of the parents of the tag that as created
  */
  event TagCreation
  ( string _tagName,
    address _tagAddress,
    address[] _parents);

  function Creator()
  {
    Master master = new Master(address(this));
    masterAddress = address(master);
  }

  function addUser()
  {
    User newUser = new User(msg.sender, masterAddress);
    Tag(Master(masterAddress).getTagAddressFromName("account")).startAssessment(address(newUser),5, 600);
  }

  function addTag(string name, address[] parentList) returns(uint) //Creates a new tag contract
  {
    uint response = 0;
    address[] memory parents;
    if(Master(masterAddress).getTokenBalance(msg.sender) < 1)
    {
      response += 1;
    }
    if(Master(masterAddress).getTagAddressFromName(name) != 0)
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
          parents[i] = parentList[i];
        }
      }
      Tag newTag = new Tag(name, parents, masterAddress);
      address newTagAddress = address(newTag);
      Master(masterAddress).mapTagName(newTagAddress,name);
      Master(masterAddress).mapTagAddressFromName(name,newTagAddress);
      Master(masterAddress).mapTokenBalance(msg.sender,Master(masterAddress).getTokenBalance(msg.sender) - 1);
      TagCreation(name, newTagAddress, parents);
    }
    return response;
  }
}

/*
@type: contract
@name: Master
@purpose: To store data for easy and secure access
*/
contract Master
{
  address creatorAddress; //The address of the Creator contract
  mapping (address => uint) tokenBalance; //Maps the addresses of users to their token balances
  mapping (address => string) tagName; //Maps the address of tags to their names
  mapping (string => address) tagAddressFromName; //Maps the names of tags to their addresses
  mapping (address => address[]) achievements; //Maps the addresses of users to an array of addresses that contain the addresses of the tags that they have passed an assessment in
  mapping (address => bool) availability; //Maps the addresses of users to their availability status for whether or not they can currently assess someone
  mapping (address => address) users; //Maps the addresses of the users to their actual location of the blockchain

  /*
  @type: constructer function
  @purpose: To initialize the master contract and have it make the account tag
  @param: none
  @returns: nothing
  */
  function Master(address creator)
  {
    creatorAddress = creator; //Sets the address of the Creator contract
    tokenBalance[address(this)] = 1; //Gives the master contract a temporary tokenBalance so that it may make the tag
    address[] memory a; //Makes an empty array to serve as the parents of the tag
    uint useless = Creator(creatorAddress).addTag("account", a); //creates the account tag and gives the value of its error code to a relatively useless uint
  }

  /*
  @type: function
  @purpose: To set a new token balance for a user
  @param: address user = the address of the user whose token balance is to be mapped
  @param: uint balance = the new token balance for the user
  @returns: nothing
  */
  function mapTokenBalance(address user, uint balance)
  {
    if(tagAddressFromName[tagName[msg.sender]] == 0) //makes sure this function is not called by a tag
    {
      tokenBalance[user] = balance; //sets the token balance of the user
    }
  }

  /*
  @type: function
  @purpose: To map the name of a tag to its address
  @param: address tagAddress = the address of the tag being mapped
  @param: string name = the name of the tag being mapped
  @return: nothing
  */
  function mapTagName(address tagAddress, string name)
  {
    tagName[tagAddress] = name; //maps the name of the tag to its address
  }

  /*
  @type: function
  @purpose: To map the address of a tag to its name
  @param: string name = the name of the tag being mapped
  @param: address tagAddress = the address of the tag being mapped
  @returns: nothing
  */
  function mapTagAddressFromName(string name, address tagAddress)
  {
    tagAddressFromName[name] = tagAddress; //maps the address of the tag to its name
  }

  /*
  @type: function
  @purpose: To map the address of a user to the address of the tag that the user has just passed
  @param: address user = the address of the user
  @param: address acheivment = the address of the tag just passed
  @returns: nothing
  */
  function mapAchievement(address user, address achievment)
  {
    achievements[user].push(achievment); //adds the address of the tag to the end of the array that is mapped to the user
  }

  /*
  @type: function
  @purpose: To map the user's availability to assess to the user's address
  @param: address user = the address of the user
  @param: bool available = the availa status of the user to assess
  @returns: nothing
  */
  function mapAvailability(address user, bool available)
  {
    availability[user] = available;
  }

  /*
  @type: function
  @purpose: To get the user's token balance
  @param: address user = the address of the user
  @returns: The token balance in the form of a uint
  */
  function getTokenBalance(address user) returns(uint)
  {
    return tokenBalance[user];
  }

  /*
  @type: function
  @purpose: To get the name of a tag from its address
  @param: address tagAddress = the address of the tag
  @returns: The name of the tag in the form of a string
  */
  function getTagName(address tagAddress) returns(string)
  {
    return tagName[tagAddress];
  }

  /*
  @type: function
  @purpose: To get the address of a tag from its name
  @param: string name = the name of the tag
  @returns: The address of the tag in the form of an address
  */
  function getTagAddressFromName(string name) returns(address)
  {
    return tagAddressFromName[name];
  }

  /*
  @type: function
  @purpose: To get the addresses of the tags that the user has achieved
  @param: address user = the address of the user
  @returns: The addresses of the tags that the user has achieved in the form of an array of addresses
  */
  function getAchievement(address user) returns(address[])
  {
    return achievements[user];
  }

  /*
  @type: function
  @purpose: To get the number of achievments of a user
  @param: address user = the address of the user
  @returns: The number of achievments of a user in the form of a uint
  */
  function getNumberOfachievments(address user) returns(uint)
  {
    return achievements[user].length;
  }

  /*
  @type: function
  @purpose: To get the availab of a user to assess
  @param: address user = the address of the user
  @returns: The availability of a user to assess in the form of a bool
  */
  function getAvailability(address user) returns(bool)
  {
    return availability[user];
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

  function Tag(string tagName, address[] parents, address masterAddress)
  {
    name = tagName;
    parentTags = parents;
    master = masterAddress;
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

  function calculateMAD(int[] scores, int n) returns(int)
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
      if(inRewardCluster[score] == true)
      {
        Master(master).mapTokenBalance(finalAssessors[i], Master(master).getTokenBalance(finalAssessors[i]) + uint((500/(100 - scoreDistance))));
        User(finalAssessors[i]).notification("You Have Received Payment For Your Assessment", tag, 15);
      }
      if(inRewardCluster[score] == true)
      {
        Master(master).mapTokenBalance(finalAssessors[i], Master(master).getTokenBalance(finalAssessors[i]) - uint((500/(100 - scoreDistance))));
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
