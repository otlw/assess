contract Master
{
  function Master()
  {

  }
  //Initialize master data store
  mapping(address => uint) tokenBalance;
  mapping(address => string) tagName;
  mapping(string => address) tagAddressFromName;
  mapping(address => Tag) tagImplementation;
  //mapping(Tag => address) tagAddressFromImplementation;
  mapping(address => string[]) acheivements;

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
  function mapTagImplementation(address a, Tag t)
  {
    tagImplementation[a] = t;
  }
  function mapAcheivement(address a, string n)
  {
    acheivements[a].push(n);
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
  function getTagImplementation(address a) returns(Tag)
  {
    return tagImplementation[a];
  }
  function getAcheivement(address a, uint i) returns(string)
  {
    return acheivements[a][i];
  }
  function getNumberOfAcheivements(address a) returns(uint)
  {
    return acheivements[a].length;
  }
  function addTag(string name, address[] parentList) returns(uint) //Creates a new tag contract
  {
    uint response = 0;
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
      Tag newTag;
      address newTagAddress = address(newTag);
      tagName[newTagAddress] = name;
      tagAddressFromName[name] = newTagAddress;
      tagImplementation[newTagAddress] = newTag;
      //tagAddressFromImplementation[newTag] = newTagAddress;
      for(uint i=0; i<= parentList.length; i++) //adds all the given parents
      {
        if(parentList[i]==0)
        {
          response += 100;
        }
        if(response==0)
        {
          newTag.addParent(tagImplementation[parentList[i]]);
        }
      }
    }
    newTag.setMaster(this);
    newTag.setName(name);
    return response;
  }
}

//Defines the meta-contract for a Tag
contract Tag
{
  Tag[] parentTags;
  Master master;
  string name;
  address[] owners; //Those who have earned the tag
  mapping(address => address[]) assessmentHistory; //All assessments completed
  mapping(address => uint) scores; //All positive assessements scores
  function Tag()
  {

  }
  function addParent(Tag parentTag)
  {
    parentTags.push(parentTag);
  }
  function setMaster(Master m)
  {
    master = m;
  }
  function setName(string n)
  {
    name = n;
  }
  function getAssessors(uint randomNumber)
  {

  }
  function startAssessment(address assessee, address[] assessors)
  {
    Assessment newAssessment;
    newAssessment.setAssessee(assessee);
    newAssessment.setAssessors(assessors);
    newAssessment.setTag(this);
  }
  function getAssessmentResults(bool result, uint score, address assessee, address assessment) returns(bool)
  {
    if(result == true)
    {
      owners.push(assessee);
      scores[assessee] = score;
      master.mapAcheivement(assessee,name);
    }
    assessmentHistory[assessee].push(assessment);
    return result;
  }
}

//Defines the meta-contract for an assessment
contract Assessment
{
  address assessee; //We need a better word for this
  address[] assessors;
  Tag tag;
  mapping(address => uint[]) assessmentData; //Given by the assessors as IPFS hashes
  mapping(address => uint[]) assessmentAnswers; //Given by the assessee as IPFS hashes
  mapping(address => bool[]) assessmentResults; //Pass/Fail given by assessors
  mapping(address => uint[]) assessmentScores; //Numerical score given by assessors

  function Assessment()
  {

  }
  function setAssessee(address newAssessee)
  {
    assessee = newAssessee;
  }
  function setAssessors(address[] newAssessors)
  {
    assessors = newAssessors;
  }
  function setTag(Tag t)
  {
    tag = t;
  }
  function assess()
  {

  }
  function cashout()
  {

  }
}
