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
  mapping (address => uint)  tokenBalance; //Maps the addresses of users to their token balances
  mapping (address => address[])  achievements; //Maps the addresses of users to an array of addresses that contain the addresses of the tags that they have passed an assessment in
  mapping (address => bool)  availability; //Maps the addresses of users to their availability status for whether or not they can currently assess someone
  mapping (address => address)  users; //Maps the addresses of the users to their actual location of the blockchain

  event UserCreation(address _userAddress); //address of the created user contract

  /*
  @type: constructor function
  @purpose: To initialize the master contract and have it make the account tag
  @param: address creator = the address of the creator contract
  @returns: nothing
  */
  function UserMaster(address tagMaster)
  {
    tagMasterAddress = tagMaster; //Sets the address of the tagMaster contract
    tokenBalance[address(this)] = 1; //Gives the master contract a temporary tokenBalance so that it may make the tag
    address[] memory a; //Makes an empty array to serve as the parents of the tag
    //uint useless = Creator(creatorAddress).addTag("account", a, address(this)); //creates the account tag and gives the value of its error code to a relatively useless uint
  }

  /*
  @type: function
  @purpose: To create a user contract
  @param: address userAddress = the address of the user's wallet
  @param: address masterAddress = the address of the master contract that stores this user's address
  @returns: The address of the created user
  */
  function addUser(address userAddress, address masterAddress) constant returns(address)
  {
    User newUser = new User(userAddress, masterAddress); //Makes a new user that represents the address from userAddress and uses the master from masterAddress as its datastore
    Tag(TagMaster(masterAddress).getTagAddressFromName("account")).startAssessment(address(newUser),5); //Starts the account tag assessment process for the newly created tag to make sure it isnt a shitty bot
    UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
    return address(newUser);
  }

  /*
  @type: function
  @purpose: To map the address of a user to the address of the tag that the user has just passed
  @param: address user = the address of the user
  @param: address acheivment = the address of the tag just passed
  @returns: nothing
  */
  function mapAchievement(address user, address achievment)
  {
    achievements[user].push(achievment); //adds the address of the tag to the end of the array that is mapped to the user
  }

  /*
  @type: function
  @purpose: To map the user's availability to assess to the user's address
  @param: address user = the address of the user
  @param: bool available = the availa status of the user to assess
  @returns: nothing
  */
  function mapAvailability(address user, bool available)
  {
    availability[user] = available;
  }

  /*
  @type: function
  @purpose: To set a new token balance for a user
  @param: address user = the address of the user whose token balance is to be mapped
  @param: uint balance = the new token balance for the user
  @returns: nothing
  */
  function mapTokenBalance(address user, uint balance)
  {
    if(TagMaster(tagMasterAddress).getTagName(msg.sender) != 0x0) //makes sure this function is only called by a tag
    {
      tokenBalance[user] = balance; //sets the token balance of the user
    }
  }

  /*
  @type: function
  @purpose: To get the user's token balance
  @param: address user = the address of the user
  @returns: The token balance in the form of a uint
  */
  function getTokenBalance(address user) constant returns(uint)
  {
    return tokenBalance[user];
  }

  /*
  @type: function
  @purpose: To get the addresses of the tags that the user has achieved
  @param: address user = the address of the user
  @returns: The addresses of the tags that the user has achieved in the form of an array of addresses
  */
  function getAchievement(address user) constant returns(address[])
  {
    return achievements[user];
  }

  /*
  @type: function
  @purpose: To get the number of achievments of a user
  @param: address user = the address of the user
  @returns: The number of achievments of a user in the form of a uint
  */
  function getNumberOfachievments(address user) constant returns(uint)
  {
    return achievements[user].length;
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

  /*
  @type: function
  @purpose: to remove this contract
  @param: address receiver = the address of the wallet that will receive of the ether
  */
  function remove(address reciever)
  {
    suicide(reciever);
  }
}
