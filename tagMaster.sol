import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";

/*
@type: contract
@name: TagMaster
@purpose: To create tags and store some tag data
*/
contract TagMaster
{
  mapping (address => string) tagName; //Maps the address of tags to their names
  mapping (string => address) tagAddressFromName; //Maps the names of tags to their addresses
  mapping (address => bool) tagExists; //Maps tag addresses to a bool to confirm their existance
  address userMasterAddress; //The address of the userMaster contract
  bool locked = false; //Keeps track of whether or not the function to set the userMasterAddress variable is locked yet or not
  address randomAddress; //The address of the random contract

  /*
  @type: modifier
  @name: onlyThis
  @purpose: to only allow the this contract to call a function to which this modifier is applied
  */
  modifier onlyThis
  {
    if(msg.sender != address(this)) //Checks if msg.sender is this contract
    {
      throw; //Throws out the function call if it isn't
    }
  }

  /*
  @type: event
  @name: TagCreation
  @occasion: When a tag is created
  @purpose: To help build a data store of tags
  @stores: string _tagName
  @stores: address _tagAddress
  @stores: address[] _parents
  */
  event TagCreation
  ( uint _response, //the error code of the procedure
    string _tagName, //the name of the tag that was created
    address _tagAddress, //the address of the tag that was created
    address[] _parents); //the addresses of the parents of the tag that as created

  /*
  @type: constructor function
  @purpose: To initialize the tagMaster contract and have it make the account tag
  @returns: nothing
  */
  function TagMaster()
  {
    Random random = new Random(); //Makes a new instance of the random contract
    randomAddress = address(random); //Sets the value of randomAddress to the address of the newly created random contract
  }

  /*
  @type: function
  @purpose: To check if an address belongs to an existing tag
  @param: address tagAddress = the address to be checked
  @returns: A bool corresponding to the existance of the tag
  */
  function checkTag(address tagAddress) returns(bool)
  {
   return tagExists[tagAddress];
  }

  /*
  @type: function
  @purpose: To set the userMasterAddress
  @param: address userMaster = the address of the userMaster contract
  @returns: nothing
  */
  function setUserMasterAddress(address userMaster)
  {
    if(locked == false) //Checks if the userMasterAddress has already been set
    {
      userMasterAddress = userMaster; //Sets the userMasterAddress to the value of userMaster
      locked = true; //Makes it so this function cannot be called again
    }
  }

  /*
  @type: function
  @purpose: To map the name of a tag to its address
  @param: address tagAddress = the address of the tag being mapped
  @param: string name = the name of the tag being mapped
  @return: nothing
  */
  function mapTagName(address tagAddress, string name) onlyThis
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
  function mapTagAddressFromName(string name, address tagAddress) onlyThis
  {
    tagAddressFromName[name] = tagAddress; //maps the address of the tag to its name
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
  @purpose: To make a tag
  @param: string name = the name of the tag to be made
  @param: address[] parentList = an array of addresses containing the addresses of the tags parents
  @returns: nothing
  */
  function makeTag(string name, address[] parentList)
  {
    uint response = 0; //initializes the error code
    address[] memory parents = new address[] (parentList.length); //initializes an array in memory to hold the values in parentList
    if(getTagAddressFromName(name) != 0) //checks if another tag already has this name
    {
      response += 1; //Modifies the error code to reflect that the name is already take (if it is)
    }
    if(parentList.length == 0) //checks if the tag has no parents
    {
      parents[0] = getTagAddressFromName("account"); //if it has no parents the account tag is set as its parent
    }
    for(uint i=0; i < parentList.length; i++) //iterates over the parentList
    {
      if(checkTag(parentList[i])==true) //checks if the parents exist
      {
        response += 100*(10**i); //modifies the error code to reflect any nonexistant parents
      }
      else
      {
        parents[i] = parentList[i]; //adds the parents that exist to the array in memory of parents
      }
    }
    if(response==0) //Checks if there were no errors so far
    {
      Tag newTag = new Tag(name, parents, userMasterAddress, address(this), randomAddress); //Makes a new tag with the provided data
      address newTagAddress = address(newTag); //initializes an address variable and sets it equal to the address of the newly created tag
      mapTagName(newTagAddress,name); //Maps the tag name to the tag address
      mapTagAddressFromName(name,newTagAddress); //Maps the tag address the the tag name
      tagExists[newTagAddress] = true; //Maps the tag address to true to show that it exists
      for(uint j=0; j < parents.length; j++) //Iterates of the parents array in memory
      {
        Tag(parents[j]).addChild(newTagAddress); //Adds the newly created tag to each of the parents as a child
      }
    }
    TagCreation(response, name, newTagAddress, parents); //Makes TagCreation event with provided data
  }

  /*
  @type: function
  @purpose: to remove this contract
  @param: address receiver = the address of the wallet that will receive of the ether
  @returns: nothing
  */
  function remove(address reciever) onlyThis
  {
    suicide(reciever);
  }
}
