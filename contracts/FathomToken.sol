pragma solidity ^0.4.11;

import "./Concept.sol";
import "./ConceptRegistry.sol";
import "./lib/StandardToken.sol";

/*
@type: contract
@name: UserRegistry
@purpose: To store data about users for easy, secure access and manage token balances
*/
contract FathomToken is StandardToken{
    address public conceptRegistry;
    string public constant name = "Aha";

    event Notification(address user, address sender, uint topic);
    /*
      0 = You've started an assessment
      1 = Called As A Potential Assessor
      2 = Confirmed for assessing, stake has been taken
      3 = Assessment Cancelled and you have been refunded
      4 = Assessment Has Started
      5 = All have commited; Reveal score
      6 = Consenus was reached; Tokens paid out
      7 = Assessment Finished,
    */

    function FathomToken(address _conceptRegistry, address _initialUser, uint _initialBalance) {
        conceptRegistry = _conceptRegistry;
        totalSupply = _initialBalance;
        balances[_initialUser] = _initialBalance;
    }

    function notification(address user, uint topic) {
        Notification(user, msg.sender, topic);
    }

    //@purpose: To perform payments and staking for assessments
    function takeBalance(address _from,  address _to, uint _amount, address _concept) returns(bool) {
        require(ConceptRegistry(conceptRegistry).conceptExists(_concept));
        if(msg.sender != _concept) require(Concept(_concept).assessmentExists(msg.sender));

        require(balances[_from] >= _amount
                && balances[_to] + _amount > balances[_to]);
        balances[_from] -= _amount;
        balances[_to] += _amount;
        Transfer(_from, _to, _amount);
        return true;
    }
}
