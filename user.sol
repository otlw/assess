import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "assessment.sol";
import "tagMaster.sol";

contract User
{
  address user;
  address master;
  address[]  acheivements;
  string userData;
  uint reputation;

  event Notification
  ( string _description,
    address _sender,
    address _user,
    address _tag,
    uint _code);

  function User(address userAddress, address masterAddress)
  {
    user = userAddress;
    master = masterAddress;
    reputation = 1;
  }

  function getReputation() constant returns(uint)
  {
    return reputation;
  }

  function setReputation(uint newReputation)
  {
    reputation = newReputation;
  }

  function notification(string description, address tag, uint code)
  {
    Notification(description, msg.sender, address(this), tag, code);
  }

  function setUserData(string hash)
  {
    userData = hash;
  }

  function getUserData() constant returns(string)
  {
    return userData;
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
