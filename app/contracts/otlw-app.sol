contract Master
{
  function Master()
  {

  }
  //Initialize master data store
  mapping(address => uint) tokenBalance;
  mapping(address => string) tagName;
  mapping(string => address) tagAddress;
  mapping(address => string[]) acheivements;

  function addTag(string name, address[] parentList) returns(uint) //Creates a new tag contract
  {
    uint response = 0;
    if(tokenBalance[msg.sender] < 1)
    {
      response += 1;
    }
    if(tagAddress[name] == 0)
    {
      response += 10;
    }
    if(response==0)
    {
      Tag newTag;
      address newTagAddress = address(newTag);
      tagName[newTagAddress] = name;
      tagAddress[name] = newTagAddress;
      for(uint i=0; i<= parentList.length; i++) //adds all the given parents
      {
        if(parentList[i]==0)
        {
          response += 100;
        }
        if(response==0)
        {
          newTag.addParent(parentList[i]);
        }
      }
    }
    newTag.setMaster(address(this));
    return response;
  }
}

//Defines the meta-contract for a Tag
contract Tag
{
  address[] parents; //The tags this is a subset of
  address masterAddress;
  address[] owners; //Those who have earned the tag
  mapping(address => address[]) assessmentHistory; //All assessments completed
  mapping(address => uint) scores; //All positive assessements scores
  function Tag()
  {

  }
  function addParent(address parent)
  {
    parents.push(parent);
  }
  function setMaster(address master)
  {
    masterAddress = master;
  }
  function getAssessors(uint randomNumber)
  {

  }
  function startAssessment(address assessee, address[] assessors)
  {
    Assessment newAssessment;
    newAssessment.setAssessee(assessee);
    newAssessment.setAssessors(assessors);
  }
  function getAssessmentResults(bool result, uint score, address assessee, address assessment) returns(bool)
  {
    if(result == true)
    {
      owners.push(assessee);
      scores[assessee] = score;
    }
    assessmentHistory[assessee] = assessment;
    return result;
  }
}

//Defines the meta-contract for an assessment
contract Assessment
{
  address assessee; //We need a better word for this
  address[] assessors;
  mapping(address => uint[]) assessmentData; //Given by the assessors as IPFS hashes
  mapping(address => uint[]) assessmentAnswers; //Given by the assessee as IPFS hashes
  mapping(address => bool[]) assessmentResults;
  mapping(address => uint[]) assessmentScores;

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
  function assess()
  {

  }
  function cashout()
  {

  }
}
