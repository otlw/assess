import "lib/random.sol";
import "master.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";
import "tagMaker.sol";

contract Creator
{
  address[] masterList;

  /*
  @type: event
  @name: TagCreation
  @occasion: When a tag is created
  @purpose: To help build a data store of tags
  @stores: string _tagName = the name of the tag that was created
  @stores: address _tagAddress = the address of the tag that was created
  @stores: address[] _parents = the addresses of the parents of the tag that as created
  */
  event TagCreation
  ( string _tagName,
    address _tagAddress,
    address[] _parents);

  address tagMakerAddress;
  function Creator(address theTagMaker)
  {
    tagMakerAddress = theTagMaker;
  }

  function addMaster() constant returns(address)
  {
    Master newMaster = new Master(address(this));
    masterList.push(address(newMaster));
    return address(newMaster);
  }

  function addUser(address userAddress, address masterAddress) constant returns(address)
  {
    User newUser = new User(userAddress, masterAddress);
    Tag(Master(masterAddress).getTagAddressFromName("account")).startAssessment(address(newUser),5);
    return address(newUser);
  }

  function addTag(string name, address[] parentList, address masterAddress) constant returns(uint) //Creates a new tag contract
  {
    uint response = TagMaker(tagMakerAddress).makeTag(name,parentList,masterAddress);
    return response;
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
