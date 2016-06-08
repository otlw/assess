import "lib/random.sol";
import "master.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";
import "tagMaker.sol";

contract Creator
{
  address[] masterList;
  address tagMakerAddress;

  event MasterCreation(address _masterAddress);
  event UserCreation(address _userAddress);
  /*
  @type: constructor function
  @purpose: To initialize the master contract and have it make the account tag
  @param: none
  @returns: nothing
  */
  function Creator(address theTagMaker)
  {
    tagMakerAddress = theTagMaker;
  }

  function addMaster() constant returns(address)
  {
    Master newMaster = new Master(address(this));
    masterList.push(address(newMaster));
    MasterCreation(address(newMaster));
    return address(newMaster);
  }

  function addUser(address userAddress, address masterAddress) constant returns(address)
  {
    User newUser = new User(userAddress, masterAddress);
    Tag(Master(masterAddress).getTagAddressFromName("account")).startAssessment(address(newUser),5);
    UserCreation(address newUser);
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
