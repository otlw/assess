pragma solidity ^0.4.11;

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
    mapping (address => mapping (address => uint)) public allowed;
    event Notification(address user, address sender, uint topic);
    /*
      0 = You've started an assessment
      1 = Called As A Potential Assessor
      2 = Confirmed for assessing, stake has been taken
      3 = Assessment Cancelled and you have been refunded
      4 = Assessment Has Started
      5 = All have commited; Reveal score
      6 = All have revealed; Tokens paid out
      7 = Assessment Finished
    */

    modifier onlyConcept() {
        require(ConceptRegistry(conceptRegistry).conceptExists(msg.sender));
        _;
    }

    function UserRegistry(address _conceptRegistry, address _user, uint _initialBalance) {
        conceptRegistry = _conceptRegistry;
        balances[_user] = _initialBalance;
    }

    function notification(address user, uint topic) {
        Notification(user, msg.sender, topic);
    }

    //@purpose: To perform payouts in Asessments
    function addBalance(address _to, uint _amount, address _concept) returns(bool) {
        require(ConceptRegistry(conceptRegistry).conceptExists(_concept) &&
                Concept(_concept).assessmentExists(msg.sender));
        if (balances[_to] + _amount > balances[_to]){
            balances[_to] += _amount;
            return true;
        }
    }

    //@purpose: To perform payments and staking for assessments
    function subtractBalance(address _from, uint _amount) onlyConcept() returns(bool) {
        if (balances[_from] >= _amount){
            balances[_from] -= _amount;
            return true;
        }
    }

    function transfer(address _to, uint _amount) returns(bool) {
        if (balances[msg.sender] >= _amount &&
           balances[_to] + _amount > balances[_to]) {
            balances[msg.sender] -= _amount;
            balances[_to] += _amount;
            return true;
        }
    }

    //@purpose: approve an address to transfer tokens on a users behalf
    function approve(address _spender, uint _amount) {
        allowed[msg.sender][_spender] = _amount;
    }

    //@purpose: transfer tokens from an account
    function transferFrom(address _from, address _to, uint _amount) returns(bool) {
        if (allowed[_from][msg.sender] > _amount &&
           balances[_from] >= _amount &&
           balances[_to] > balances[_to] + _amount) {
            balances[_from] -= _amount;
            balances[_to] += _amount;
            allowed[_from][msg.sender] -= _amount;
            return true;
        }
    }
}
