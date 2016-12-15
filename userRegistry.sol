import "concept.sol";
import "user.sol";
import "conceptRegistry.sol";

/*
@type: contract
@name: UserRegistry
@purpose: To store data about users for easy and secure access
*/
contract UserRegistry
{
  address public conceptRegistryAddress; //The address of the conceptRegistry contract
  mapping (address => uint)  balance; //Maps the addresses of users to their token balances
  mapping (address => address)  users; //Maps the addresses of the users to their account
  bool firstUserMade = false; //Keeps track of whether or not the first user has been made yet
  event UserCreation(address _userAddress); //address of the created user contract

  /*
  @type: modifier
  @name: onlyConcept
  @purpose: to only allow the Concept contract to call a function to which this modifier is applied
  */
  modifier onlyConcept()
  {
    if(ConceptRegistry(conceptRegistryAddress).conceptExists(msg.sender) == false) //checks if the address calling the function is not a concept
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
  function UserRegistry(address conceptRegistry)
  {
    conceptRegistryAddress = conceptRegistry; //Sets the address of the conceptRegistry contract
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
    User newUser = new User(userAddress, address(this), conceptRegistryAddress); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
    Concept(ConceptRegistry(conceptRegistryAddress).mewAddress()).addUser(address(newUser));
    UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
  }

  function firstUser(address userAddress)
  {
    if(firstUserMade == false)
    {
      User newUser = new User(userAddress, address(this), conceptRegistryAddress); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
      Concept(ConceptRegistry(conceptRegistryAddress).mewAddress()).addUser(address(newUser));
      UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
      balance[address(newUser)] = 1000;
    }
  }

  /*
  @type: function
  @purpose: To set a new token balance for a user
  @param: address user = the address of the user whose token balance is to be mapped
  @param: uint balance = the new token balance for the user
  @returns: nothing
  */
  function mapBalance(address user, uint newBalance) onlyConcept()
  {
    balance[user] = newBalance; //sets the token balance of the user
  }

  /*
  @type: function
  @purpose: To get the user's token balance
  @param: address user = the address of the user
  @returns: The token balance in the form of a uint
  */
  function getBalance(address user) constant returns(uint)
  {
    return balance[user];
  }

  function transfer(address user, uint amount) returns(bool)
  {
    if(balance[msg.sender] > amount)
    {
      balance[msg.sender] -= amount;
      balance[user] += amount;
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
