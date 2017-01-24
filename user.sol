pragma solidity ^0.4.0;

import "userRegistry.sol";
import "concept.sol";
import "assessment.sol";
import "conceptRegistry.sol";

/*
@type: contract
@name: User
@purpose: To act as a representation for a user in the system
*/
contract User
{
  address user; //The address of the user's wallet
  address userRegistry; //The address of the userRegistry that spawned this user
  address conceptRegistry; //The address of the conceptRegistry
  string public userData; //An IPFS hash containing the user's data
  bool public availability;
  address[] public history;
  mapping (address => bool) public conceptPassed;
  mapping (address => Approval) transactApproved;
  mapping (address => Approval) assessApproved;
  struct Approval
  {
    bool approved;
    uint value; //fix stakes pls
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
    if(ConceptRegistry(conceptRegistry).conceptExists(msg.sender) == false)
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
    uint _code); //The notification code, see below for code guide:
    /*
    1 = Called As A Potential Assessor
    2 = Confirmed for assessing, stake has been taken
    3 = Assessment Cancled and you have been refunded
    4 = Assessment Has Started
    5 = Send in Score
    */

  /*
  @type: constructor function
  @purpose: To initialize the user contract
  @param: address userAddress = the address of the user's wallet
  @param: address userRegistryAddress = the address of the userRegistry that spawned this user
  @returns: nothing
  */
  function User(address _user, address _userRegistry, address _conceptRegistry)
  {
    user = _user; //Sets the user variable
    userRegistry = _userRegistry; //Sets the userRegistry variable
    conceptRegistry = _conceptRegistry; //Sets the conceptRegistry variable
  }

  /*
  @type: function
  @purpose: To set the availability of the user
  @param: bool available = the availability of the user
  @returns: nothing
  */
  function setAvailability(bool _availability) onlyUser()
  {
    availability = _availability;
  }

  function mapHistory(address assessment) onlyConcept()
  {
    history.push(assessment); //adds the address of the concept to the end of the array that is mapped to the user
  }

  /*
  @type: function
  @purpose: To confirm that a user is assessing or not assessing
  @param: address assessment =  The assessment that the user has been called to assess
  @param: uint confirm = The user's confirmation code
  @returns: nothing
  */
  function confirmAssessment(address assessment) onlyUser()
  {
    Assessment(assessment).confirmAssessor(); //Sends the user's confromation to the assessmnet
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
  function commit(address assessment, bytes32 hash) onlyUser()
  {
    Assessment(assessment).commit(hash); //Sets the user as done assessing in the assessment
  }

  /*
  @type: function
  @purpose: To send the score that the user has decided on to the assessment
  @param: address assessment =  The assessment that the user has been called to assess
  @param: uint score = the score that the user decided on
  @returns: nothing
  */
  function reveal(address assessment, int8 score, bytes16 salt, address assessor) onlyUser()
  {
    Assessment(assessment).reveal(score,salt,assessor); //Sends to score to the assessment
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
    return UserRegistry(userRegistry).transfer(user,amount);
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
      return UserRegistry(userRegistry).transfer(user,amount);
    }
  }

  function setConceptPassed(bool passed) onlyConcept()
  {
    conceptPassed[msg.sender] = passed;
  }

  function extMakeAssessment(address concept, uint cost, uint size) returns(bool)
  {
    if(assessApproved[msg.sender].approved == false)
    {
      return false;
    }
    else if(assessApproved[msg.sender].value > cost*size)
    {
      return false;
    }
    else
    {
      assessApproved[msg.sender].value -= cost*size;
      return Concept(concept).makeAssessment(cost, size);
    }
  }
}
