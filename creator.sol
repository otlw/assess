import "lib/random.sol";
import "master.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";
import "tagMaker.sol";

/*
@type: contract
@name: Creator
@purpose: To create other contracts (requires the use of tagMaker to make tags)
*/
contract Creator
{

  address[] masterList; //Array of the master contract addresses
  address tagMakerAddress; //Address of the tagMaker contract

  /*
  @type: event
  @name: MasterCreation
  @occasion: When a master is created
  @purpose: To help build a data store of masters
  @stores: address _masterAddress
  */
  event MasterCreation(address _masterAddress); //address of the created master contract

  /*
  @type: event
  @name: UserCreation
  @occasion: When a user is created
  @purpose: To help build a data store of users
  @stores: address _userAddress
  */
  event UserCreation(address _userAddress); //address of the created user contract

  /*
  @type: constructor function
  @purpose: To initialize the creator contract and give it the vale for tagMakerAddress
  @param: address theTagMaker = the address of the previously deployed tagMaker contract
  @returns: nothing
  */
  function Creator(address theTagMaker)
  {
    tagMakerAddress = theTagMaker; //Assigns the value of theTagMaker to the variable tagMakerAddress
  }

  /*
  @type: function
  @purpose: To create a master contract
  @returns: The address of the created master
  */
  function addMaster() constant returns(address)
  {
    Master newMaster = new Master(address(this)); //Makes a new master contract
    masterList.push(address(newMaster)); //Adds the newly created master contract to the master list
    MasterCreation(address(newMaster)); //Makes a new MasterCreation event with the address of the newly created master
    return address(newMaster);
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
    Tag(Master(masterAddress).getTagAddressFromName("account")).startAssessment(address(newUser),5); //Starts the account tag assessment process for the newly created tag to make sure it isnt a shitty bot
    UserCreation(address(newUser)); //Makes a new UserCreation event with the address of the newly created user
    return address(newUser);
  }

  /*
  @type: function
  @purpose: To create a tag contract
  @returns: The tag creation's error code
  */
  function addTag(string name, address[] parentList, address masterAddress) constant returns(uint)
  {
    uint response = TagMaker(tagMakerAddress).makeTag(name,parentList,masterAddress); //calls the function in tagMaker to make the tag
    return response;
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
