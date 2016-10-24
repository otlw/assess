import ../user.sol
import ../userMaster.sol

contract Group
{
  uint public size;
  bytes32 public goal;
  address[] public members;
  struct Role {
    uint num;
    bool needsAssessing;
    address[] requirements;
    address[] members;
  }
  role[] public Roles;
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
    members.push(member);
    size = _size;
  }

  function addMember(address member, uint _role) onlyRegistry()
  {
    role[_role].members.push();
    members.push(member);
  }
}
