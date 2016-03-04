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

  }

  function mapTokenBalance(address a, uint b)
  {
    tokenBalance[a] = b;
  }
  function mapTagName(address a, string n)
  {
    tagName[a] = n;
  }
  function mapTagAddressFromName(string n, address a)
  {
    tagAddressFromName[n] = a;
  }
  function mapAchievement(address a, address t)
  {
    achievements[a].push(t);
  }
  function mapAvailability(address a, bool b)
  {
    availability[a] = b;
  }

  function getTokenBalance(address a) returns(uint)
  {
    return tokenBalance[a];
  }
  function getTagName(address a) returns(string)
  {
    return tagName[a];
  }
  function getTagAddressFromName(string n) returns(address)
  {
    return tagAddressFromName[n];
  }
  function getAchievement(address a) returns(address[])
  {
    return achievements[a];
  }
  function getNumberOfachievments(address a) returns(uint)
  {
    return achievments[a].length;
  }
  function getAvailability(address a) returns(bool)
  {
    return availability[a] = true;
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

  function Tag(string n, address[] p, address m)
  {
    name = n;
    parentTags = p;
    master = m;
  }

  function setAssessorPool(address a, address assessment)
  {
    for(uint i = 0; i < Tag(a).owners.length && Assessment(assessment).poolSizeRemaining != 0; i++)
    {
      if(pool.length < .1*Tag(a).owners.length)
      {
        address random = Tag(a).owners[getRandom(Tag(a).owners.length)];
        if(Master(master).getAvailability(random) == true)
        {
          Assessment(assessment).addToAssessorPool();
          Assessment(assessment).poolSizeRemaining--;
        }
      }
      else
      {
        for(uint j = 0; j < Tag(a).parentTags.length; j++)
        {
          setAssessorPool(s, Tag(a).parentTags[j], assessment);
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
      Master(master).mapachievment(assessee,address(this));
    }
    assessmentHistory[assessee].push(assessment);
    return result;
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

  function Assessment(address a, address t)
  {
    assessee = a;
    tag = t;
  }

  function setNumberOfAssessors(uint n)
  {
    numberOfAssessors = n;
  }

  function setAssessmentPoolSize(uint n)
  {
    poolSizeRemaining = n;
  }
  function addToAssessorPool(address a)
  {
    assessorPool.push(a);
  }

  function setAssessors()
  {
    for(uint i = 0, i < n, i++)
    {
      assessors.push(assessorPool[getRandom(assessorPool.length)]);
    }
  }

  function setQuestion(address a, uint[] data)
  {
    assessmentQuestions[a] = data;
  }

  function getQuestion(address a) returns(uint[])
  {
    return assessmentQuestions[a];
  }

  function setAnswer(address a, uint[] data)
  {
    assessmentAnswers[a] = data;
  }

  function getAnswer(address a) returns(uint[])
  {
    return assessmentAnswers[a];
  }

  function setResult(address a, bool b, uint s)
  {
    Results memory results;
    results.pass = b;
    results.score = s;
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
  uint balance;
  address master;
  address[] acheivements;
  string userData;

  function User(address u, address m, string s)
  {
    user = u;
    master = m;
    userData = s;
  }

}
