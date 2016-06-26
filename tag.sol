import "lib/random.sol";
import "userMaster.sol";
import "assessment.sol";
import "user.sol";
import "tagMaster.sol";

//Defines the meta-contract for a Tag
contract Tag
{
  address[] parentTags;
  address[] childTags;
  address userMaster;
  address tagMaster;
  address random;
  string name;
  uint size;
  address[] owners; //Those who have earned the tag
  mapping(address => address[]) assessmentHistory; //All assessments completed
  mapping(address => bool) assessmentExists; //All existing assessments

  modifier onlyUserMaster
  {
    if(msg.sender != userMaster)
    {
      throw;
    }
  }

  modifier onlyTagMaster
  {
    if(msg.sender != tagMaster)
    {
      throw;
    }
  }

  modifier onlyThis
  {
    if(msg.sender != address(this))
    {
      throw;
    }
  }

  event CompletedAssessment
  ( address _assessee,
    bool _pass,
    int _score,
    address _assessment);

  function Tag(string tagName, address[] parents, address userMasterAddress, address tagMasterAddress, address randomAddress, uint sizeOfAssessment)
  {
    name = tagName;
    parentTags = parents;
    userMaster = userMasterAddress;
    random = randomAddress;
    tagMaster = tagMasterAddress;
    size = sizeOfAssessment;
  }

  function addFirstUser(address firstUser) onlyUserMaster
  {
    if(owners.length == 0)
    {
      owners.push(firstUser);
    }
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

  function addParent(address parentAddress) onlyTagMaster
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

  function addChild(address childAddress) onlyTagMaster
  {
    childTags.push(childAddress);
  }

function setAssessorPool(address tagAddress, address assessment, uint seed) onlyThis
  {
    if(Tag(TagMaster(tagMaster).getTagAddressFromName("account")).getOwnerLength() < Assessment(assessment).getAssessmentPoolSize())
    {
      for(uint i = 0; i < Tag(TagMaster(tagMaster).getTagAddressFromName("account")).getOwnerLength(); i++)
      {
        Assessment(assessment).addToAssessorPool(Tag(TagMaster(tagMaster).getTagAddressFromName("account")).getOwner(i));
      }
      Assessment(assessment).setPotentialAssessor(size);
    }
    for(uint j = 0; j < Tag(tagAddress).getOwnerLength() && Assessment(assessment).getAssessmentPoolSize() != 0; j++)
    {
      if(Assessment(assessment).getAssessorPoolLength() < Tag(tagAddress).getOwnerLength()/10)
      {
        address randomUser = Tag(tagAddress).getOwner(Random(random).getRandom(seed, Tag(tagAddress).getOwnerLength()-1));
        if(UserMaster(userMaster).getAvailability(randomUser) == true)
        {
          Assessment(assessment).addToAssessorPool(randomUser);
          Assessment(assessment).setAssessmentPoolSize(Assessment(assessment).getAssessmentPoolSize() -1);
        }
      }
      else
      {
        for(uint l = 0; l < Tag(tagAddress).getParentsLength(); l++)
        {
          setAssessorPool(Tag(tagAddress).getParent(l), assessment, Random(random).getRandom(seed, Tag(tagAddress).getOwnerLength()-1));
        }

        for(uint k = 0; k < Tag(tagAddress).getChildrenLength(); k++)
        {
          setAssessorPool(Tag(tagAddress).getChild(k), assessment, Random(random).getRandom(seed, Tag(tagAddress).getOwnerLength()-1));
        }
      }
      if(Assessment(assessment).getAssessmentPoolSize() <= 0)
      {
        Assessment(assessment).setPotentialAssessor(size);
      }
    }
  }

  function makeAssessment(address assessee)
  {
    Assessment newAssessment = new Assessment(assessee, address(this), userMaster, tagMaster, random);
    assessmentExists[address(newAssessment)] = true;
    newAssessment.setNumberOfAssessors(size);
    newAssessment.setAssessmentPoolSize(size*20);
  }

  function startAssessment(address assessment, uint size)
  {
    if(block.number - Assessment(assessment).getReferenceBlock() >= 4 && block.number - Assessment(assessment).getReferenceBlock() <= 6)
    {
      setAssessorPool(address(this), assessment, size);
    }
    else
    {
      Assessment(assessment).cancelAssessment();
    }
  }

  function finishAssessment(bool pass, int score, address assessee, address assessment)
  {
    if(msg.sender == assessment)
    {
      if(pass == true)
      {
        owners.push(assessee);
        UserMaster(userMaster).mapAchievement(assessee,address(this));
      }
      if(pass == false && address(this) == TagMaster(tagMaster).getTagAddressFromName("account"))
      {
        User(assessee).remove(userMaster);
      }
      assessmentHistory[assessee].push(assessment);
      CompletedAssessment(assessee, pass, score, assessment);
    }
  }

  function pay(address user, int amount) onlyThis
  {
    if(assessmentExists[msg.sender] = true)
    {
      UserMaster(userMaster).mapTokenBalance(user, amount);
    }
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
