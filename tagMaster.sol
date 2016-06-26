import "lib/random.sol";
import "userMaster.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";

contract TagMaster
{
  mapping (address => string) tagName; //Maps the address of tags to their names
  mapping (string => address) tagAddressFromName; //Maps the names of tags to their addresses
  mapping (address => bool) tagExists;
  address userMasterAddress;
  bool locked = false;
  address randomAddress;

  modifier onlyThis
  {
    if(msg.sender != address(this))
    {
      throw;
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

  function TagMaster()
  {
    Random random = new Random();
    randomAddress = address(random);
  }

  function checkTag(address tagAddress) returns(bool)
  {
   return tagExists[tagAddress];
  }

  function setUserMasterAddress(address userMaster)
  {
    if(locked == false)
    {
      userMasterAddress = userMaster;
      locked = true;
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

  function makeTag(string name, address[] parentList, uint assessmentSize)
  {
    uint response = 0;
    address[] memory parents = new address[] (parentList.length);
    if(getTagAddressFromName(name) != 0)
    {
      response += 1;
    }
    if(assessmentSize == 0)
    {
      response += 10;
    }
    if(parentList.length == 0)
    {
      parents[0] = getTagAddressFromName("account");
    }
    for(uint i=0; i < parentList.length; i++) //adds all the given parents
    {
      if(checkTag(parentList[i])==true)
      {
        response += 100*(10**i);
      }
      else
      {
        parents[i] = parentList[i];
      }
    }
    if(response==0)
    {
      Tag newTag = new Tag(name, parents, userMasterAddress, address(this), randomAddress, assessmentSize);
      address newTagAddress = address(newTag);
      mapTagName(newTagAddress,name); //Maps the tag name to the tag address
      mapTagAddressFromName(name,newTagAddress); //Maps the tag address the the tag name
      tagExists[newTagAddress] = true;
      for(uint j=0; j < parents.length; j++)
      {
        Tag(parents[j]).addChild(newTagAddress);
      }
    }
    TagCreation(response, name, newTagAddress, parents);
  }

  function remove(address reciever) //remove after testing
  {
    suicide(reciever);
  }
}
