pragma solidity ^0.4.0;

import "./Concept.sol";
import "./User.sol";
import "./ConceptRegistry.sol";

/*
@type: contract
@name: UserRegistry
@purpose: To store data about users for easy and secure access
*/
contract UserRegistry
{
  address public conceptRegistry; //The address of the conceptRegistry contract
  mapping (address => uint) public balances; //Maps the addresses of users to their token balances
  mapping (address => address) users; //Maps the addresses of the users to their account
  bool firstUserMade = false; //Keeps track of whether or not the first user has been made yet
  event UserCreation(address _userAddress); //address of the created user contract

  /*
  @type: modifier
  @name: onlyConcept
  @purpose: to only allow the Concept contract to call a function to which this modifier is applied
  */
  modifier onlyConcept()
  {
    if(ConceptRegistry(conceptRegistry).conceptExists(msg.sender) == false) //checks if the address calling the function is not a concept
    {
      throw; //throws out the fucntion call
    }
    _;
  }

  /*
  @type: modifier
  @name: onlyThis
  @purpose: to only allow the this contract to call a function to which this modifier is applied
  */
  modifier onlyThis()
  {
    if(msg.sender != address(this)) //Checks if msg.sender is this contract
    {
      throw; //Throws out the function call if it isn't
    }
    _;
  }

  /*
  @type: constructor function
  @purpose: To initialize the userMaster contract
  @param: address creator = the address of the creator contract
  @returns: nothing
  */
  function UserRegistry(address _conceptRegistry)
  {
    conceptRegistry = _conceptRegistry; //Sets the address of the conceptRegistry contract
  }

  /*
  @type: function
  @purpose: To create a user contract
  @param: address userAddress = the address of the user's wallet
  @param: address masterAddress = the address of the master contract that stores this user's address
  @returns: nothing
  */
  function addUser(address userAddress)
  {
    User newUser = new User(userAddress, address(this), conceptRegistry); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
    Concept(ConceptRegistry(conceptRegistry).mewAddress()).addUser(address(newUser));
    UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
  }

  function firstUser(address userAddress)
  {
    if(firstUserMade == false)
    {
      User newUser = new User(userAddress, address(this), conceptRegistry); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
      Concept(ConceptRegistry(conceptRegistry).mewAddress()).addUser(address(newUser));
      UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
      balances[address(newUser)] = 1000;
    }
  }

  /*
  @type: function
  @purpose: To set a new token balance for a user
  @param: address user = the address of the user whose token balance is to be mapped
  @param: uint balance = the new token balance for the user
  @returns: nothing
  */
  function setBalance(address user, uint newBalance) onlyConcept()
  {
    balances[user] = newBalance; //sets the token balance of the user
  }

  function transfer(address user, uint amount) returns(bool)
  {
    if(balances[msg.sender] > amount)
    {
      balances[msg.sender] -= amount;
      balances[user] += amount;
      return true;
    }
    else
    {
      return false;
    }
  }

  /*
  @type: function
  @purpose: to remove this contract
  @param: address receiver = the address of the wallet that will receive of the ether
  @returns: nothing
  */
  function remove(address reciever) onlyThis()
  {
    suicide(reciever);
  }
}
