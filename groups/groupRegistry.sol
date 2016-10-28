import ../user.sol
import ../userMaster.sol
import group.sol

contract GroupRegistry
{
  mapping (address => address[]) groups;
  mapping (address => address) conceptFromGroup;
  address userMasterAddress;

  modifier onlyUser()
  {
    if(userMaster(userMasterAddress).getTokenBalance(msg.sender) <= 0)
    {
      throw;
    }
    _;
  }

  function GroupRegistry(address _userMasterAddress)
  {
    userMasterAddress = _userMasterAddress;
  }

  function addMember(address group, uint role) returns (bool success) onlyUser() payable()
  {
    if (Group(group).roles[role].num = Group(group).roles[role].members.length())
    {
      return false;
    }
    
    for (uint i = 0, i <= Group(group).requirements.length(), i++)
    {
      if(User(msg.sender).getConceptPassed(Group.requirements[i]) == false)
      {
        return false;
      }
    }
    Group(group).addMember(msg.sender);
    return true;
  }

  function addGroup(address concept, uint size, address[] _requirements) onlyUser
  {
    Group newGroup = new Group(concept, size, msg.sender);
    groups[concept].push(address(Group));
    conceptFromGroup[address(group)] = concept;
  }
}
