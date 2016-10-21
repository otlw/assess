import ../user.sol
import ../userMaster.sol


contract GroupRegistry
{
  mapping (address => address[]) groups;
  mapping (address => address) tagFromGroup;
  address userMasterAddress;

  modifier onlyUser() {
    if( userMaster(userMasterAddress).getTokenBalanzce(msg.sender) <= 0){
      throw;
    }
    _;
  }


  function GroupRegistry(address _userMasterAddress)
  {
    userMasterAddress = _userMasterAddress;
  }

  function addMember(address group) returns (bool success) onlyUser payable {
    for (uint i = 0, if i < Group(group).members.length(), i++) {
      if(User(msg.sender).getTagPassed(Group.requirements[i]) == false){
        return false;
      }
      if (Group(group).members.length() = Group(group.size)){
        return false;
      }
      Group(group).addMember(msg.sender);
      return true;
    }
  }

  function addGroup(address tag, uint size,){
    Group newGroup = new Group(tag, size, msg.sender);
    groups[tag].push(address(Group));
    tagFromGroup[address(group)] = tag;
  }
}




contract Group
{
  uint public size;
  address[] public members;
  address[] public requirements;
  address tag;
  address registry;

  modifier onlyRegistry() {
    if (msg.sender != registry) {
      throw;
    }
    _;
  }

  function Group(address _tag, uint _size, address member)
  {
    tag = _tag;
    registry = msg.sender;
    requirements = _size;
    members.push(member);
    size = _size;
  }

  function addMember(address member) onlyRegistry {
    members.push(member);
  }
}
