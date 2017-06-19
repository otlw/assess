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
  /*
    function to invoce another contract using this User.sol as a proxy
@param destination: the contract, whose function is to be called
@param value, the amount of gas allowed to be spent
@param data to be sent along with the call
example usage: 
   */
  function execute(address destination, uint value, bytes data) onlyUser() returns(bool) {
    if(destination.call.value(value)(data)) {
      return true;
    }
    else {
      return false;
    }
  }

  event Transfer(uint _amount);
  event Failed(uint _t);
  
  function proxyTransfer(address _to, uint _amount) returns(bool){
    
    bool tmp = userRegistry.call(bytes4(keccak256("transfer(address,uint256)")), _to, _amount);
    if (tmp)
      Transfer(_amount);
    else
      Failed(1);
      /**/
    /*
    bool tmp2 = userRegistry.call("transfer", _amount);
    if (tmp2)
      Transfer(_amount);
    else
      Failed(2);
    */
}
    

  function setConceptPassed(bool passed) onlyConcept(){
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
