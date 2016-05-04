import "lib/random.sol";
import "master.sol";
import "creator.sol";
import "assessment.sol";
import "user.sol";

//Defines the meta-contract for a Tag
contract Tag
{
  address[] parentTags;
  address[] childTags;
  address master;
  string name;
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

  function getOwners() constant returns(address[])
  {
    return owners;
  }

  function getOwnerLength() constant returns(uint)
  {
    return owners.length;
  }

  function getOwner(uint index) constant returns(address)
  {
    return owners[index];
  }

  function getParents() constant returns(address[])
  {
    return parentTags;
  }

  function getParentsLength() constant returns(uint)
  {
    return parentTags.length;
  }

  function getParent(uint index) constant returns(address)
  {
      return parentTags[index];
  }

  function addParent(address parentAddress)
  {
      parentTags.push(parentAddress);
  }

  function getChildren() constant returns(address[])
  {
    return childTags;
  }

  function getChildrenLength() constant returns(uint)
  {
    return childTags.length;
  }

  function getChild(uint index) constant returns(address)
  {
      return childTags[index];
  }

  function addChild(address childAddress)
  {
      childTags.push(childAddress);
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

        for(uint k = 0; k < Tag(tagAddress).getChildrenLength(); k++)
        {
          setAssessorPool(Tag(tagAddress).getChild(k), assessment);
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
      User(assessee).remove(master);
    }
    assessmentHistory[assessee].push(assessment);
    CompletedAssessment(assessee, pass, score, assessment);
  }
  function getRandom(uint i) constant returns(uint)
  {
    return 12;
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
