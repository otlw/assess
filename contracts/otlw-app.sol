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
    uint useless = addTag("account", a);
  }

  function mapTokenBalance(address user, uint balance)
  {
    if(tagName[msg.sender] = 0)
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
    return availability[user] = true;
  }

  function addUser()
  {
    User newUser = new User(msg.sender, address(this));
    Tag(tagAddressFromName["account"]).startAssessment(address(newUser),5);
  }

  function addTag(string name, address[] parentList) returns(uint) //Creates a new tag contract
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
      Tag newTag = new Tag(name, parents, address(this));
      address newTagAddress = address(newTag);
      tagName[newTagAddress] = name;
      tagAddressFromName[name] = newTagAddress;
      tokenBalance[msg.sender] -= 1;
      TagCreation(name, newTagAddress);
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
  address[] owners; //Those who have earned the tag
  mapping(address => address[]) assessmentHistory; //All assessments completed
  mapping(address => uint) scores; //All positive assessements scores
  event CompletedAssessment
  ( address _assessee,
    bool _pass,
    uint _score,
    address _assessment);

  function Tag(string tagName, address[] parents, address masterAddress)
  {
    name = tagName;
    parentTags = parents;
    master = masterAddress;
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
        Assessment(assessment).setAssessors();
      }
    }
  }

  function startAssessment(address assessee, uint size)
  {
    Assessment newAssessment = new Assessment(assessee, address(this));
    newAssessment.setNumberOfAssessors(size);
    newAssessment.setAssessmentPoolSize(size*20);
    setAssessorPool(address(this), address(newAssessment));
  }

  function finishAssessment(bool pass, uint score, address assessee, address assessment)
  {
    if(pass == true)
    {
      owners.push(assessee);
      scores[assessee] = score;
      Master(master).mapAchievement(assessee,address(this));
    }
    if(pass == false && address(this) == Master(master).getTagAddressFromName("account"))
    {
      User(assessee).suicide();
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
  address[] potentialAssessors;
  address[] finalAssessors;
  address tag;
  uint poolSizeRemaining;
  uint numberOfAssessors;
  struct Results
  {
    bool pass;
    uint score;
  }
  mapping(address => string) assessmentTasks; //Given by the assessors as IPFS hashes
  mapping(address => string) assessmentAnswers; //Given by the assessee as IPFS hashes
  mapping(address => Results) assessmentResults; //Pass/Fail and Score given by assessors
  uint finalScore;
  bool finalResult;
  uint referenceTime;

  function Assessment(address assesseeAddress, address tagAddress)
  {
    assessee = assesseeAddress;
    tag = tagAddress;
    referenceTime = block.timestamp;
  }

  function setNumberOfAssessors(uint number)
  {
    numberOfAssessors = number;
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

  function setPotentialAssessors()
  {
    for(uint i = 0; i < numberOfAssessors; i++)
    {
      randomAssessor = assessorPool[getRandom(assessorPool.length)];
      assessors[randomAssessor] = 3;
      potentialAssessors.push(randomAssessor);
      User(randomAssessor).notification("Called As A Potential Assessor",tag, 1);
    }
  }

  function getAssessorPoolLength() returns(uint)
  {
      return assessorPool.length;
  }

  function getRandom(uint i) returns(uint)
  {
    return 12;
  }
  function setTask(address assessorAddress, string data)
  {
    assessmentTasks[assessorAddress] = data;
  }

  function getTask(address assessorAddress) returns(string)
  {
    return assessmentTasks[assessorAddress];
  }

  function setAnswer(address assesseeAddress, string data)
  {
    assessmentAnswers[assesseeAddress] = data;
  }

  function getAnswer(address assesseeAddress) returns(string)
  {
    return assessmentAnswers[assesseeAddress];
  }

  function setResult(address assessorAddress, bool pass, uint score)
  {
    Results memory results;
    results.pass = pass;
    results.score = score;
    assessmentResults[assessorAddress] = results;
  }

  function assess()
  {

  }

  function calculateResult()
  {

  }

  function confirmAssessor(uint confirm)
  {
    if(assessors[msg.sender] != 0)
    {
      if(now - referenceTime <= 181)
      {
        assessors[msg.sender] = confirm;
        if(confirm == 1)
        {
          finalAssessors.push(msg.sender);
          User(msg.sender).notification("Confirmed As Assessing", tag, 2);
        }
        if(confirm == 2)
        {
          User(msg.sender).notification("Confirmed As Not Assessing", tag, 3);
        }
      }
      else
      {
        for(uint i = 0, i < potentialAssessors.length, i++)
        {
          if(assessors[msg.sender]==3)
          {
            User(msg.sender).notification("Did Not Respond In Time To Be Assessor", tag, 4);
            Master(Tag(tag).master).mapTokenBalance(msg.sender, Master(Tag(tag).master).getTokenBalance(msg.sender) - 1);
          }
        }
        if(numberOfAssessors - finalAssessors.length)
        {
          uint remaining = numberOfAssessors - finalAssessors.length;
          numberOfAssessors = remaining;
          delete potentialAssessors;
          referenceTime = now;
          setPotentialAssessors;
        }
      }
    }
  }

  function returnResults()
  {
    Tag(tag).finishAssessment(finalResult, finalScore, assessee, address(this));
  }

  function cashout()
  {

  }
}

contract User
{
  address user;
  address master;
  address[] acheivements;
  string userData;

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

  function suicide()
  {
    selfdestruct(master);
  }
}
