import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "assessment.sol";
import "tagMaster.sol";

/*
@type: contract
@name: User
@purpose: To act as a representation for a user in the system
*/
contract User
{
  address user; //The address of the user's wallet
  address master; //The address of the userMaster that spawned this user
  address[] acheivements; //The addresses of the tags that the user possesses
  string userData; //An IPFS hash containing the user's data

  /*
  @type: modifier
  @name: onlyUser
  @purpose: to only allow the user's wallet contract to call a function to which this modifier is applied
  */
  modifier onlyUser
  {
    if(msg.sender != user) //checks if msg.sender has the same address as the user's wallet
    {
      throw; //throws the function call if not
    }
  }

  /*
  @type: event
  @name: Notification
  @purpose: To provide a user with notifications
  */
  event Notification
  ( string _description, //A notification message
    address _sender, //The notification sender
    address _user, //The address of the user that received the notification
    address _tag, //The address of the tag involved in this notification
    uint _code); //The notification code

  /*
  @type: constructor function
  @purpose: To initialize the user contract and have it make the account tag
  @param: address userAddress = the address of the user's wallet
  @param: address masterAddress = the address of the user master that spawned this user
  @returns: nothing
  */
  function User(address userAddress, address masterAddress)
  {
    user = userAddress; //Sets the user variable
    master = masterAddress; //Sets the master variable
  }

  /*
  @type: function
  @purpose: To set the availability of the user
  @param: bool available = the availability of the user
  @returns: nothing
  */
  function setAvailability(bool available) onlyUser
  {
    UserMaster(master).mapAvailability(address(this), available); //Sets the user's availability to the value of the parameter
  }

  /*
  @type: function
  @purpose: To confirm that a user is assessing or not assessing
  @param: address assessment =  The assessment that the user has been called to assess
  @param: uint confirm = The user's confirmation code
  @returns: nothing
  */
  function confirmAssessment(address assessment, uint confirm) onlyUser
  {
    Assessment(assessment).confirmAssessor(confirm); //Sends the user's confromation to the assessmnet
  }

  /*
  @type: function
  @purpose: To send and IPFS hash to the assessment
  @param: address assessment =  The assessment that the user has been called to assess
  @param: string data = the IPFS hash
  @returns: nothing
  */
  function setAssessmentData(address assessment, string data) onlyUser
  {
    Assessment(assessment).setData(data); //Gives the assessment the IPFS hash
  }

  /*
  @type: function
  @purpose: To notify the assessment that the user is done assessing
  @param: address assessment =  The assessment that the user has been called to assess
  @returns: nothing
  */
  function doneAssessing(address assessment) onlyUser
  {
    Assessment(assessment).doneAssessing(); //Sets the user as done assessing in the assessment
  }

  /*
  @type: function
  @purpose: To send the score that the user has decided on to the assessment
  @param: address assessment =  The assessment that the user has been called to assess
  @param: uint score = the score that the user decided on
  @returns: nothing
  */
  function setResult(address assessment, int score) onlyUser
  {
    Assessment(assessment).setResult(score); //Sends to score to the assessment
  }

  /*
  @type: function
  @purpose: To send this user a notification
  @param: string description = the notification message
  @param: address tag = the address of the tag involved in this notification
  @param: uint code = the address of the tag involved in this notification
  @returns: nothing
  */
  function notification(string description, address tag, uint code)
  {
    Notification(description, msg.sender, address(this), tag, code);
  }

  /*
  @type: function
  @purpose: To set the user's IPFS hash containing their information
  @param: string hash = IPFS hash containing the user information
  @returns: nothing
  */
  function setUserData(string hash) onlyUser
  {
    userData = hash; //Sets userData to the hash value
  }

  /*
  @type: function
  @purpose: To get the user's IPFS hash containing their information
  @returns: The IPFS hash containing the user information
  */
  function getUserData() constant returns(string)
  {
    return userData;
  }

  /*
  @type: function
  @purpose: to remove this contract
  @param: address receiver = the address of the wallet that will receive of the ether
  @returns: nothing
  */
  function remove(address reciever) onlyUser
  {
    suicide(reciever);
  }
}
