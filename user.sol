import "lib/random.sol";
import "userMaster.sol";
import "concept.sol";
import "assessment.sol";
import "conceptMaster.sol";

/*
@type: contract
@name: User
@purpose: To act as a representation for a user in the system
*/
contract User
{
  address user; //The address of the user's wallet
  address master; //The address of the userMaster that spawned this user
  address conceptMaster; //The address of the conceptMaster
  string public userData; //An IPFS hash containing the user's data
  mapping (address => bool) public conceptPassed;
  mapping (address => Approval) transactApproved;
  mapping (address => Approval) assessApproved;
  struct Approval
  {
    bool approved;
    int value; //fix stakes pls
  }

  /*
  @type: modifier
  @name: onlyUser
  @purpose: to only allow the user's wallet contract to call a function to which this modifier is applied
  */
  modifier onlyUser()
  {
    if(msg.sender != user) //checks if msg.sender has the same address as the user's wallet
    {
      throw; //throws the function call if not
    }
    _;
  }

  modifier onlyConcept()
  {
    if(ConceptMaster(conceptMaster).conceptExists(msg.sender) == false)
    {
      throw;
    }
    _;
  }
  /*
  @type: event
  @name: Notification
  @purpose: To provide a user with notifications
  */
  event Notification
  ( address _sender, //The notification sender
    address _user, //The address of the user that received the notification
    address _concept, //The address of the concept involved in this notification
    uint _code); //The notification code

  /*
  @type: constructor function
  @purpose: To initialize the user contract
  @param: address userAddress = the address of the user's wallet
  @param: address masterAddress = the address of the user master that spawned this user
  @returns: nothing
  */
  function User(address userAddress, address masterAddress, address conceptMasterAddress)
  {
    user = userAddress; //Sets the user variable
    master = masterAddress; //Sets the master variable
    conceptMaster = conceptMasterAddress; //Sets the conceptMaster variable
  }

  /*
  @type: function
  @purpose: To set the availability of the user
  @param: bool available = the availability of the user
  @returns: nothing
  */
  function setAvailability(bool available) onlyUser()
  {
    UserMaster(master).mapAvailability(available); //Sets the user's availability to the value of the parameter
  }

  /*
  @type: function
  @purpose: To confirm that a user is assessing or not assessing
  @param: address assessment =  The assessment that the user has been called to assess
  @param: uint confirm = The user's confirmation code
  @returns: nothing
  */
  function confirmAssessment(address assessment, uint confirm) onlyUser()
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
  function setAssessmentData(address assessment, string data) onlyUser()
  {
    Assessment(assessment).setData(data); //Gives the assessment the IPFS hash
  }

  /*
  @type: function
  @purpose: To notify the assessment that the user is done assessing
  @param: address assessment =  The assessment that the user has been called to assess
  @returns: nothing
  */
  function doneAssessing(address assessment) onlyUser()
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
  function setResult(address assessment, int score) onlyUser()
  {
    Assessment(assessment).setResult(score); //Sends to score to the assessment
  }

  /*
  @type: function
  @purpose: To send this user a notification
  @param: string description = the notification message
  @param: address concept = the address of the concept involved in this notification
  @param: uint code = the address of the concept involved in this notification
  @returns: nothing
  */
  function notification(address concept, uint code)
  {
    Notification(msg.sender, address(this), concept, code);
  }

  /*
  @type: function
  @purpose: To set the user's IPFS hash containing their information
  @param: string hash = IPFS hash containing the user information
  @returns: nothing
  */
  function setUserData(string hash) onlyUser()
  {
    userData = hash; //Sets userData to the hash value
  }

  function transferTokens(address user, uint amount) onlyUser() returns(bool)
  {
    return UserMaster(master).transfer(user,amount);
  }

  function extTransferTokens(address user, uint amount) returns(bool)
  {
    if(transactApproved[msg.sender].approved = false)
    {
      return false;
    }
    else if(transactApproved[msg.sender].value > amount)
    {
      return false;
    }
    else
    {
      transactApproved[msg.sender].value -= amount;
      return UserMaster(master).transfer(user,amount);
    }
  }

  function setConceptPassed(bool passed) onlyConcept()
  {
    conceptPassed[msg.sender] = passed;
  }

  function makeAssessment(address concept, uint time, uint size) onlyConcept() returns(bool)
  {
    return Concept(concept).makeAssessment(time,size);
  }

  function extMakeAssessment(address concept, uint time, uint size) returns(bool)
  {
    if(assessApproved[msg.sender].approved = false)
    {
      return false;
    }
    else if(assessApproved[msg.sender].value > int(time*size))
    {
      return false;
    }
    else
    {
      assessApproved[msg.sender].value -= int(time*size);
      return Concept(concept).makeAssessment(time,size);
    }
  }

  function startAssessment(address concept, address assessment) onlyConcept()
  {
    Concept(concept).startAssessment(assessment);
  }

  /*
  @type: function
  @purpose: to remove this contract
  @param: address receiver = the address of the wallet that will receive of the ether
  @returns: nothing
  */
  function remove(address reciever) onlyUser()
  {
    suicide(reciever);
  }
}
