import ../user.sol
import ../userMaster.sol

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

  function addMember(address group) returns (bool success) onlyUser() payable()
  {
    for (uint i = 0, if i < Group(group).members.length(), i++)
    {
      if(User(msg.sender).getConceptPassed(Group.requirements[i]) == false)
      {
        return false;
      }
      if (Group(group).members.length() = Group(group.size))
      {
        return false;
      }
      Group(group).addMember(msg.sender);
      return true;
    }
  }

  function addGroup(address concept, uint size)
  {
    Group newGroup = new Group(concept, size, msg.sender);
    groups[concept].push(address(Group));
    conceptFromGroup[address(group)] = concept;
  }
}

contract Group
{
  uint public size;
  address[] public members;
  address[] public requirements;
  address concept;
  address registry;

  modifier onlyRegistry()
  {
    if (msg.sender != registry)
    {
      throw;
    }
    _;
  }

  function Group(address _concept, uint _size, address member)
  {
    concept = _concept;
    registry = msg.sender;
    requirements = _size;
    members.push(member);
    size = _size;
  }

  function addMember(address member) onlyRegistry()
  {
    members.push(member);
  }
}
