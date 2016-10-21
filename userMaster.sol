import "lib/random.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";
import "tagMaster.sol";

/*
@type: contract
@name: UserMaster
@purpose: To store data about users for easy and secure access
*/
contract UserMaster
{
  address tagMasterAddress; //The address of the tagMaster contract
  mapping (address => int)  tokenBalance; //Maps the addresses of users to their token balances
  mapping (address => address[])  history; //Maps the addresses of users to an array of addresses that contain the addresses of their assessments
  mapping (address => bool)  availability; //Maps the addresses of users to their availability status for whether or not they can currently assess someone
  mapping (address => address)  users; //Maps the addresses of the users to their account
  bool firstUserMade = false; //Keeps track of whether or not the first user has been made yet
  event UserCreation(address _userAddress); //address of the created user contract

  /*
  @type: modifier
  @name: onlyTag
  @purpose: to only allow the Tag contract to call a function to which this modifier is applied
  */
  modifier onlyTag()
  {
    if(TagMaster(tagMasterAddress).checkTag(msg.sender) == false) //checks if the address calling the function is not a tag
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
  function UserMaster(address tagMaster)
  {
    tagMasterAddress = tagMaster; //Sets the address of the tagMaster contract
  }

  /*
  @type: function
  @purpose: To get the address of the Tag Master
  @returns: The address of the Tag Master
  */
  function getTagMasterAddress() returns(address)
  {
    return tagMasterAddress;
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
    User newUser = new User(userAddress, address(this), tagMasterAddress); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
    Tag(TagMaster(tagMasterAddress).getMew()).addUser(address(newUser));
    UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
  }

  function firstUser(address userAddress)
  {
    if(firstUserMade == false)
    {
      User newUser = new User(userAddress, address(this), tagMasterAddress); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
      Tag(TagMaster(tagMasterAddress).getMew()).addUser(address(newUser));
      UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
      tokenBalance[address(newUser)] = 1000;
    }
  }

  /*
  @type: function
  @purpose: To map the address of a user to the address of the tag that the user has just passed
  @param: address user = the address of the user
  @param: address assessment = the address of the assessment completed
  @returns: nothing
  */
  function mapHistory(address user, address assessment) onlyTag()
  {
    history[user].push(assessment); //adds the address of the tag to the end of the array that is mapped to the user
  }

  /*
  @type: function
  @purpose: To map the user's availability to assess to the user's address
  @param: address user = the address of the user
  @param: bool available = the availa status of the user to assess
  @returns: nothing
  */
  function mapAvailability(bool available)
  {
    availability[msg.sender] = available; //sets the availability of the user specified in the parameter to the availability specified in the parameter
  }

  /*
  @type: function
  @purpose: To set a new token balance for a user
  @param: address user = the address of the user whose token balance is to be mapped
  @param: uint balance = the new token balance for the user
  @returns: nothing
  */
  function mapTokenBalance(address user, int balance) onlyTag()
  {
    tokenBalance[user] = balance; //sets the token balance of the user
  }

  /*
  @type: function
  @purpose: To get the user's token balance
  @param: address user = the address of the user
  @returns: The token balance in the form of a uint
  */
  function getTokenBalance(address user) constant returns(int)
  {
    return tokenBalance[user];
  }

  /*
  @type: function
  @purpose: To get the addresses of the assessments that the user has completed
  @param: address user = the address of the user
  @returns: The addresses of the assessments that the user has completed in the form of an array of addresses
  */
  function getHistory(address user) constant returns(address[])
  {
    return history[user];
  }

  /*
  @type: function
  @purpose: To get the number of assessments completed by a user
  @param: address user = the address of the user
  @returns: The number of assessments that a user has completed in the form of a uint
  */
  function getNumberOfHistory(address user) constant returns(uint)
  {
    return history[user].length;
  }

  /*
  @type: function
  @purpose: To get the availability of a user to assess
  @param: address user = the address of the user
  @returns: The availability of a user to assess in the form of a bool
  */
  function getAvailability(address user) constant returns(bool)
  {
    return availability[user];
  }

  function transferTokens(address user, int amount) returns(bool)
  {
    if(amount > 0 && tokenBalance[msg.sender] > amount)
    {
      tokenBalance[msg.sender] -= amount;
      tokenBalance[user] += amount;
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
