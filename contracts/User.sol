pragma solidity ^0.4.0;

import "./UserRegistry.sol";
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
  mapping (address => bool) public conceptPassed;

  // Mappings to approve addresses to transact or create assessments
  mapping (address => Approval) transactApproved;
  mapping (address => Approval) assessApproved;
  struct Approval {
    bool approved;
    uint value;
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
    0 = You've started an assessment
    1 = Called As A Potential Assessor
    2 = Confirmed for assessing, stake has been taken
    3 = Assessment Cancled and you have been refunded
    4 = Assessment Has Started
    5 = Send in Score
    */

  function User(address _user, address _userRegistry) {
    user = _user;
    userRegistry = _userRegistry;
    conceptRegistry = UserRegistry(userRegistry).conceptRegistry();
  }

  function setAvailability(bool _availability) onlyUser() {
    availability = _availability;
  }

  function notification(address concept, uint code) {
    Notification(msg.sender, address(this), concept, code);
  }

  function setUserData(string hash) onlyUser() {
    userData = hash; //Sets userData to the hash value
  }

  //@purpose: allows external contracts to transfer tokens from this account
  function extTransferTokens(address user, uint amount) returns(bool) {
    if(transactApproved[msg.sender].approved = false) {
      return false;
    }
    else if(transactApproved[msg.sender].value > amount) {
      return false;
    }
    else {
      transactApproved[msg.sender].value -= amount;
      return UserRegistry(userRegistry).transfer(user,amount);
    }
  }

  //@purpose: execute arbitrary transactions
  function execute(address destination, uint value, bytes data) onlyUser() returns(bool) {
    if(destination.call.value(value)(data)) {
      return true;
    }
    else {
      return false;
    }
  }

  function setConceptPassed(bool passed) onlyConcept(){
    conceptPassed[msg.sender] = passed;
  }

  //@purpose: allows external contracts to initate assessments for this user
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
