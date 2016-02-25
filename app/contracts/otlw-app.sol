contract Master
{
  function Master()
  {

  }
  mapping(address => uint) tokenBalance;
  mapping(address => string) tagName;
  mapping(string => address) tagAddress;
  mapping(address => string[]) acheivements;
  function addTag(string name, address[] parentList) returns(uint)
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
      for(uint i=0; i<= parentList.length; i++)
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

contract Tag
{
  address[] parents;
  address masterAddress;
  address[] owners;
  mapping(address => address[]) assessmentHistory;
  mapping(address => uint) scores;
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

contract Assessment
{
  address assessee;
  address[] assessors;
  mapping(address => uint[]) assessmentData;
  mapping(address => uint[]) assessmentAnswers;
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
