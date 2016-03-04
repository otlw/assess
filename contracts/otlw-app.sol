contract Master
{
  //Initialize master data store
  mapping (address => uint) tokenBalance;
  mapping (address => string) tagName;
  mapping (string => address) tagAddressFromName;
  mapping (address => address[]) achievements;
  mapping (address => bool) availability;
  mapping (address => address) users;

  function Master()
  {
    tokenBalance[address(this)] = 1;
    address[] a;
    uint useless = addTag("account", a);
  }

  function mapTokenBalance(address user, uint balance)
  {
    tokenBalance[user] = balance;
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
  function mapAvailability(address user, bool availability)
  {
    availability[user] = availability;
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
    return achievments[user].length;
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

  function Tag(string tagName, address[] parents, address masterAddress)
  {
    name = tagName;
    parentTags = parents;
    master = masterAddress;
  }

  function setAssessorPool(address tagAddress, address assessment)
  {
    for(uint i = 0; i < Tag(tagAddress).owners.length && Assessment(assessment).poolSizeRemaining != 0; i++)
    {
      if(pool.length < .1*Tag(tagAddress).owners.length)
      {
        address random = Tag(tagAddress).owners[getRandom(Tag(tagAddress).owners.length)];
        if(Master(master).getAvailability(random) == true)
        {
          Assessment(assessment).addToAssessorPool();
          Assessment(assessment).poolSizeRemaining--;
        }
      }
      else
      {
        for(uint j = 0; j < Tag(tagAddress).parentTags.length; j++)
        {
          setAssessorPool(Tag(tagAddress).parentTags[j], assessment);
        }
      }
      if(Assessment(assessment).poolSizeRemaining =< 0)
      {
        Assessment(assessment).setAssessors();
      }
    }
  }

  function startAssessment(address assessee, uint size)
  {
    Assessment newAssessment = new Assessment(assessee, address.this);
    newAssessment.setNumberOfAssessors(size);
    newAssessment.setAssessmentPoolSize(size*20)
    setAssessorPool(address(this), address(newAssessment));
  }

  function finishAssessment(bool result, uint score, address assessee, address assessment) returns(bool)
  {
    if(result == true)
    {
      owners.push(assessee);
      scores[assessee] = score;
      Master(master).mapAchievement(assessee,address(this));
    }
    assessmentHistory[assessee].push(assessment);
    return result;
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
  address[] assessors;
  address tag;
  uint poolSizeRemaining;
  uint numberOfAssessors;
  struct Results
  {
    bool pass;
    uint score;
  }
  mapping(address => string) assessmentQuestions; //Given by the assessors as IPFS hashes
  mapping(address => string) assessmentAnswers; //Given by the assessee as IPFS hashes
  mapping(address => Results) assessmentResults; //Pass/Fail and Score given by assessors
  uint finalScore;
  bool finalResult;

  function Assessment(address assesseeAddress, address tagAddress)
  {
    assessee = assesseeAddress;
    tag = tagAddress;
  }

  function setNumberOfAssessors(uint number)
  {
    numberOfAssessors = number;
  }

  function setAssessmentPoolSize(uint sizeRemaining)
  {
    poolSizeRemaining = sizeRemaining;
  }
  function addToAssessorPool(address potentialAddress)
  {
    assessorPool.push(potentialAddress);
  }

  function setAssessors()
  {
    for(uint i = 0, i < numberOfAssessors, i++)
    {
      assessors.push(assessorPool[getRandom(assessorPool.length)]);
    }
  }

  function getRandom(uint i) returns(uint)
  {
    return 12;
  }
  function setQuestion(address assessorAddress, uint[] data)
  {
    assessmentQuestions[assessorAddress] = data;
  }

  function getQuestion(address assessorAddress) returns(uint[])
  {
    return assessmentQuestions[assessorAddress];
  }

  function setAnswer(address assesseeAddress, uint[] data)
  {
    assessmentAnswers[assesseeAddress] = data;
  }

  function getAnswer(address assesseeAddress) returns(uint[])
  {
    return assessmentAnswers[assesseeAddress];
  }

  function setResult(address assessorAddress, bool pass, uint score)
  {
    Results memory results;
    results.pass = pass;
    results.score = score;
    assessmentResults[a] = results;
  }

  function assess()
  {

  }

  function calculateResult()
  {

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

  function User(address userAddress, address masterAddress, string ipfsHash)
  {
    user = userAddress;
    master = masterAddress;
    userData = ipfsHash;
  }

  function setUserData(string hash)
  {
    userData hash;
  }

  function getUserData() returns(string)
  {
      return userData;
  }
}
