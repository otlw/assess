pragma solidity ^0.4.0;

import "./Concept.sol";
import "./ConceptRegistry.sol";

/*
@type: contract
@name: UserRegistry
@purpose: To store data about users for easy, secure access and manage token balances
*/
contract UserRegistry {
  address public conceptRegistry;
  mapping (address => uint) public balances;
  mapping (address => bool) public availability;
  mapping (address => mapping (address => uint)) public allowed;
  bool firstUserMade = false;
  event Notification(address user, address sender, uint topic);
    /*
      0 = You've started an assessment
      1 = Called As A Potential Assessor
      2 = Confirmed for assessing, stake has been taken
      3 = Assessment Cancelled and you have been refunded
      4 = Assessment Has Started
      5 = Reveal Score
      6 = Payout
      7 = Assessment Finished
    */

  function UserRegistry(address _conceptRegistry) {
    conceptRegistry = _conceptRegistry;
  }

  function toggleAvailability() {
    availability[msg.sender] = !availability[msg.sender];
  }

  function notification(address user, uint topic) {
    Notification(user, msg.sender, topic);
  }

  //@purpose: To perform payouts in Asessments
  function addBalance(address _to, uint _amount) returns(bool) {
    if(balances[_to] + _amount > balances[_to]){
      balances[_to] += _amount;
      return true;
    }
    else {
      return false;
    }
  }

  //@purpose: To perform payments and staking for assessments
  function subtractBalance(address _from, uint _amount) returns(bool) {
    if(balances[_from] > _amount){
      balances[_from] -= _amount;
      return true;
    }
    return false;
  }

  function transfer(address _to, uint _amount) returns(bool) {
    if(balances[msg.sender] > _amount &&
       balances[_to] + _amount > balances[_to]) {
      balances[msg.sender] -= _amount;
      balances[_to] += _amount;
      return true;
    }
    else {
      return false;
    }
  }

  //@purpose: approve an address to transfer tokens on a users behalf
  function approve(address _spender, uint _amount) returns(bool) {
      allowed[msg.sender][_spender] = _amount;
      return true;
  }

  //@purpose: transfer tokens from an account
  function transferFrom(address _from, address _to, uint _amount) returns(bool) {
    if(allowed[_from][msg.sender] > _amount &&
       balances[_from] > _amount &&
       balances[_to] > balances[_to] + _amount) {
        balances[_from] -= _amount;
        balances[_to] += _amount;
        allowed[_from][msg.sender] -= _amount;
        return true;
    }
    else {
        return false;
    }
  }
}
