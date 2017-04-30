pragma solidity ^0.4.0;

import "./abstract/AbstractUserRegistry.sol";
import "./Concept.sol";
import "./Assessment.sol";
import "./ConceptRegistry.sol";

/*
@type: contract
@name: User
@purpose: To act as a representation for a user in the system
*/
contract User {
  address user; //The address of the user's wallet
  address userRegistry; //The address of the userRegistry that spawned this user
  address conceptRegistry; //The address of the conceptRegistry
  string public userData; //An IPFS hash containing the user's data
  bool public availability;
  address[] public history;
  mapping (address => bool) public conceptPassed;
  mapping (address => Approval) transactApproved;
  mapping (address => Approval) assessApproved;
  struct Approval {
    bool approved;
    uint value; //fix stakes pls
  }

  modifier onlyUser() {
    if(msg.sender != user) {
      throw; 
    }
    _;
  }

  modifier onlyConcept() {
    if(ConceptRegistry(conceptRegistry).conceptExists(msg.sender) == false) {
      throw;
    }
    _;
  }

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

  function User(address _user, address _userRegistry, address _conceptRegistry) {
    user = _user;
    userRegistry = _userRegistry;
    conceptRegistry = _conceptRegistry;
  }

  function setAvailability(bool _availability) onlyUser() {
    availability = _availability;
  }

  function mapHistory(address assessment) onlyConcept() {
    history.push(assessment); 
  }

  function confirmAssessment(address assessment) onlyUser() {
    Assessment(assessment).confirmAssessor(); 
  }

  /*
  @type: function
  @purpose: To send and IPFS hash to the assessment
  @param: address assessment =  The assessment that the user has been called to assess
  @param: string data = the IPFS hash
  @returns: nothing
  */
  function setAssessmentData(address assessment, string data) onlyUser() {
    Assessment(assessment).setData(data);
  }

  /*
  @type: function
  @purpose: To notify the assessment that the user is done assessing
  @param: address assessment =  The assessment that the user has been called to assess
  @returns: nothing
  */
  function commit(address assessment, bytes32 hash) onlyUser() {
    Assessment(assessment).commit(hash); //Sets the user as done assessing in the assessment
  }

  /*
  @type: function
  @purpose: To send the score that the user has decided on to the assessment
  @param: address assessment =  The assessment that the user has been called to assess
  @param: uint score = the score that the user decided on
  @returns: nothing
  */
  function reveal(address assessment, int8 score, bytes16 salt, address assessor) onlyUser() {
    Assessment(assessment).reveal(score,salt,assessor); //Sends to score to the assessment
  }

  function notification(address concept, uint code) {
    Notification(msg.sender, address(this), concept, code);
  }

  function setUserData(string hash) onlyUser() {
    userData = hash; //Sets userData to the hash value
  }

  function transferTokens(address user, uint amount) onlyUser() returns(bool) {
    return AbstractUserRegistry(userRegistry).transfer(user,amount);
  }

  function extTransferTokens(address user, uint amount) returns(bool) {
    if(transactApproved[msg.sender].approved = false) {
      return false;
    }
    else if(transactApproved[msg.sender].value > amount) {
      return false;
    }
    else {
      transactApproved[msg.sender].value -= amount;
      return AbstractUserRegistry(userRegistry).transfer(user,amount);
    }
  }

  function setConceptPassed(bool passed) onlyConcept() {
    conceptPassed[msg.sender] = passed;
  }

  function extMakeAssessment(address concept, uint cost, uint size) returns(bool) {
    if(assessApproved[msg.sender].approved == false) {
      return false;
    }
    else if(assessApproved[msg.sender].value > cost*size) {
      return false;
    }
    else {
      assessApproved[msg.sender].value -= cost*size;
      return Concept(concept).makeAssessment(cost, size);
    }
  }
}
