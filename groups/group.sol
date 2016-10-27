import ../user.sol

contract Group
{
  uint public size;
  bytes32 public goal;
  address[] public members;
  address[] public requirements;
  address concept;
  address registry;
  mapping (address => bool) done;

  modifier onlyRegistry()
  {
    if (msg.sender != registry)
    {
      throw;
    }
    _;
  }
  modifier onlyMember()
  {
    if (msg.sender )
  }

  function Group(address _concept, uint _size, address[] _requirements)
  {
    concept = _concept;
    registry = msg.sender;
    requirements = _requirements;
    members.push(member);
    size = _size;
  }

  function addMember(address member) onlyRegistry()
  {
    if(members.length() < size)
    {
      members.push(member);
    }
  }

  function setDone()
  {
    done(msg.sender) = true;
    for(uint i = 0, if i <= members.length(), i++)
    {
      if(done[members[i]] == false)
      {
        return
      }
    }
    //Call some thing to do if the whole group is done here
  }

}
