import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "assessment.sol";
import "tagMaster.sol";

contract User
{
  address user;
  address master;
  address[] acheivements;
  string userData;

  modifier onlyUser
  {
    if(msg.sender != user)
    {
      throw;
    }
  }

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
  }

  function setAvailability(bool available) onlyUser
  {
    UserMaster(master).mapAvailability(address(this), available);
  }

  function confirmAssessment(address assessment, uint confirm) onlyUser
  {
    Assessment(assessment).confirmAssessor(confirm);
  }

  function setAssessmentData(address assessment, string data) onlyUser
  {
    Assessment(assessment).setData(data);
  }

  function doneAssessing(address assessment) onlyUser
  {
    Assessment(assessment).doneAssessing();
  }

  function setResult(address assessment, int score) onlyUser
  {
    Assessment(assessment).setResult(score);
  }

  function notification(string description, address tag, uint code)
  {
    Notification(description, msg.sender, address(this), tag, code);
  }

  function setUserData(string hash) onlyUser
  {
    userData = hash;
  }

  function getUserData() constant returns(string)
  {
    return userData;
  }

  function remove(address reciever) onlyUser
  {
    suicide(reciever);
  }
}
