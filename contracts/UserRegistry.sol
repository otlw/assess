pragma solidity ^0.4.0;

import "./Concept.sol";
import "./User.sol";
import "./ConceptRegistry.sol";

/*
@type: contract
@name: UserRegistry
@purpose: To store data about users for easy, secure access and manage token balances
*/
contract UserRegistry {
  address public conceptRegistry;
  mapping (address => uint) public balances;
  mapping (address => address) public users;
  bool firstUserMade = false;
  event UserCreation(address _userAddress); //address of the created user contract

  modifier onlyConcept() {
    if(ConceptRegistry(conceptRegistry).conceptExists(msg.sender) == false)
    {
      throw;
    }
    _;
  }

  modifier onlyThis() {
    if(msg.sender != address(this))
    {
      throw;
    }
    _;
  }

  function UserRegistry(address _conceptRegistry) {
    conceptRegistry = _conceptRegistry;
  }

  /*
  @type: function
  @purpose: To create a user contract
  @param: address userAddress = the address of the user's wallet
  @returns: nothing
  */
  function addUser(address userAddress) {
    User newUser = new User(userAddress, address(this));
    Concept(ConceptRegistry(conceptRegistry).mewAddress()).addUser(address(newUser));
    users[userAddress] = newUser;
    UserCreation(address(newUser)); // event
  }

  function firstUser(address userAddress) {
    if(firstUserMade == false) {
      User newUser = new User(userAddress, address(this));
      Concept(ConceptRegistry(conceptRegistry).mewAddress()).addUser(address(newUser));
      users[userAddress] = newUser;
      balances[newUser] = 1000;
      UserCreation(address(newUser)); // event
    }
  }


  //@purpose: To preform payouts in Asessments
  function addBalance(address _to, uint _amount) returns(bool) {
    if(balances[_to] + _amount > balances[_to]){
      balances[_to] += _amount;
      return true;
    }
    else {
      return false;
    }
  }

  //@purpose: To preform payments and staking for assessments
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

  function remove(address reciever) onlyThis() {
    suicide(reciever);
  }
}
