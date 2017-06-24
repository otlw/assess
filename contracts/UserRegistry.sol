pragma solidity ^0.4.0;

import "./Concept.sol";
import "./ConceptRegistry.sol";

/*
@type: contract
@name: UserRegistry
@purpose: To store data about users for easy and secure access
*/
contract UserRegistry {
  address public conceptRegistry; //The address of the conceptRegistry contract
  mapping (address => uint) public balances; //Maps the addresses of users to their token balances
  mapping (address => bool) public availability;
  bool firstUserMade = false; //Keeps track of whether or not the first user has been made yet
  event UserCreation(address _userAddress); //address of the created user contract

  modifier onlyConcept() {
    if(ConceptRegistry(conceptRegistry).conceptExists(msg.sender) == false) //checks if the address calling the function is not a concept
    {
      throw; //throws out the fucntion call
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

  //Constructor
  function UserRegistry(address _conceptRegistry) {
    conceptRegistry = _conceptRegistry;
  }

  /*
  @type: function
  @purpose: To create a user contract
  @param: address userAddress = the address of the user's wallet
  @param: address masterAddress = the address of the master contract that stores this user's address
  @returns: nothing
  */
  function addUser() {
    Concept(ConceptRegistry(conceptRegistry).mewAddress()).addUser(msg.sender);
    UserCreation(msg.sender); //Makes a new UserCreation event with the address of the newly created user
  }

  function toggleAvailability() {
    availability[msg.sender] = !availability[msg.sender];
  }

  function firstUser(address userAddress) {
    if(firstUserMade == false) {
      Concept(ConceptRegistry(conceptRegistry).mewAddress()).addUser(userAddress);
      balances[userAddress] = 1000;
      UserCreation(userAddress); //Makes a new UserCreation event with the address of the newly created user
    }
  }

  function addBalance(address _to, uint _amount) returns(bool) {
    if(balances[_to] + _amount > balances[_to]){
      balances[_to] += _amount;
      return true;
    }
    else {
      return false;
    }
  }

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
