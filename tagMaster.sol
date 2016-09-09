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
  mapping (address => bool) tagExists; //Maps tag addresses to a bool to confirm their existance
  address userMasterAddress; //The address of the userMaster contract
  bool locked = false; //Keeps track of whether or not the function to set the userMasterAddress variable is locked yet or not
  address randomAddress; //The address of the random contract
  address mewAddress;

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
  @purpose: To initialize the tagMaster contract and have it make the random contract
  @returns: nothing
  */
  function TagMaster()
  {
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

  function getMew() returns(address)
  {
    return mewAddress;
  }

  /*
  @type: function
  @purpose: To set the userMasterAddress
  @param: address userMaster = the address of the userMaster contract
  @returns: nothing
  */
  function init(address userMaster, address random, address mew)
  {
    if(locked == false) //Checks if the function has already been called
    {
      userMasterAddress = userMaster; //Sets the userMasterAddress to the value of userMaster
      randomAddress = random;
      mewAddress = mew;
      Tag(mewAddress).setMew(mewAddress);
      locked = true; //Makes it so this function cannot be called again
    }
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
    address[] memory parents = new address[] (parentList.length);
    for(uint i=0; i < parentList.length; i++) //iterates over the parentList
    {
      if(checkTag(parentList[i])==true) //checks if the parents exist
      {
        response += (10**i); //modifies the error code to reflect any nonexistant parents
      }
      else
      {
        parents[i] = parentList[i]; //adds the parents that exist to the array in memory of parents
      }
    }
    if(response==0) //Checks if there were no errors so far
    {
      Tag newTag = new Tag(name, parents, userMasterAddress, address(this), randomAddress); //Makes a new tag with the provided data
      newTag.setMew(mewAddress);
      address newTagAddress = address(newTag); //initializes an address variable and sets it equal to the address of the newly created tag
      tagExists[newTagAddress] = true; //Maps the tag address to true to show that it exists
      if(parents.length == 0)
      {
        Tag(mewAddress).addChild(newTagAddress);
      }
      for(uint j=0; j < parents.length; j++) //Iterates of the parents array in memory
      {
        Tag(parents[j]).addChild(newTagAddress); //Adds the newly created tag to each of the parents as a child
      }
    }
    TagCreation(response, name, newTagAddress, parents); //Makes TagCreation event with provided data
  }
}
