// taken from https://github.com/ConsenSys/Tokens/blob/master/contracts/StandardToken.sol
//Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
pragma solidity ^0.4.8;

import "./Token.sol";

contract StandardToken is Token {

    function transfer(address _to, uint256 _value) returns (bool success) {
        return transferBalance(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        require( allowed[_from][msg.sender] >= _value);
        if(transferBalance(_from, _to, _value)) {
            allowed[_from][msg.sender] -= _value;
        }
        return true;
    }

    function transferBalance(address _from, address _to, uint256 _value) internal returns (bool success) {
        require(balances[_from] >= _value &&
                balances[_to] + _value > balances[_to]);
        balances[_from] -= _value;
        balances[_to] += _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) public balances; // *added public
    mapping (address => mapping (address => uint256)) public allowed; // *added public
}
