import "lib/random.sol";
import "creator.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";
import "tagMaker.sol"

/*
@type: contract
@name: Master
@purpose: To store data for easy and secure access
*/
contract Master
{
  address creatorAddress; //The address of the Creator contract
  mapping (address => uint)  tokenBalance; //Maps the addresses of users to their token balances
  mapping (address => string)  tagName; //Maps the address of tags to their names
  mapping (string => address) tagAddressFromName; //Maps the names of tags to their addresses
  mapping (address => address[])  achievements; //Maps the addresses of users to an array of addresses that contain the addresses of the tags that they have passed an assessment in
  mapping (address => bool)  availability; //Maps the addresses of users to their availability status for whether or not they can currently assess someone
  mapping (address => address)  users; //Maps the addresses of the users to their actual location of the blockchain

  /*
  @type: constructor function
  @purpose: To initialize the master contract and have it make the account tag
  @param: address creator = the address of the creator contract
  @returns: nothing
  */
  function Master(address creator)
  {
    creatorAddress = creator; //Sets the address of the Creator contract
    tokenBalance[address(this)] = 1; //Gives the master contract a temporary tokenBalance so that it may make the tag
    address[] memory a; //Makes an empty array to serve as the parents of the tag
    uint useless = Creator(creatorAddress).addTag("account", a, address(this)); //creates the account tag and gives the value of its error code to a relatively useless uint
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
    if(tagAddressFromName[tagName[msg.sender]] == 0) //makes sure this function is not called by a tag
    {
      tokenBalance[user] = balance; //sets the token balance of the user
    }
  }

  /*
  @type: function
  @purpose: To map the name of a tag to its address
  @param: address tagAddress = the address of the tag being mapped
  @param: string name = the name of the tag being mapped
  @return: nothing
  */
  function mapTagName(address tagAddress, string name)
  {
    tagName[tagAddress] = name; //maps the name of the tag to its address
  }

  /*
  @type: function
  @purpose: To map the address of a tag to its name
  @param: string name = the name of the tag being mapped
  @param: address tagAddress = the address of the tag being mapped
  @returns: nothing
  */
  function mapTagAddressFromName(string name, address tagAddress)
  {
    tagAddressFromName[name] = tagAddress; //maps the address of the tag to its name
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
  @purpose: To get the name of a tag from its address
  @param: address tagAddress = the address of the tag
  @returns: The name of the tag in the form of a string
  */
  function getTagName(address tagAddress) constant returns(string)
  {
    return tagName[tagAddress];
  }

  /*
  @type: function
  @purpose: To get the address of a tag from its name
  @param: string name = the name of the tag
  @returns: The address of the tag in the form of an address
  */
  function getTagAddressFromName(string name) constant returns(address)
  {
    return tagAddressFromName[name];
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
  @purpose: To map the values associated with a tag
  @param: address tagAddress = the address of the tag being mapped
  @param: string tagName = the name of the tag being mapped
  @param: address maker = the name of the person who created the tag
  @returns: none
  */
  function mapTagStuff(address tagAddress, string tagName, address maker)
  {
    mapTagName(tagAddress,tagName); //Maps the tag name to the tag address
    mapTagAddressFromName(tagName,tagAddress); //Maps the tag address the the tag name
    mapTokenBalance(maker,getTokenBalance(maker) - 1); //Removes the cost of making a tag from the
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
