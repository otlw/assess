
import "lib/random.sol";
import "master.sol";
import "tag.sol";
import "assessment.sol";
import "user.sol";
import "creator.sol";

contract TagMaker
{

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

  function TagMaker()
  {

  }

  function makeTag(string name, address[] parentList, address masterAddress) returns(uint) //Creates a new tag contract
  {
    uint response = 0;
    address[] memory parents;
    if(Master(masterAddress).getTokenBalance(msg.sender) < 1)
    {
      response += 1;
    }
    if(Master(masterAddress).getTagAddressFromName(name) != 0)
    {
      response += 10;
    }
    if(response==0)
    {
      for(uint i=0; i <= parentList.length; i++) //adds all the given parents
      {
        if(parentList[i]==0)
        {
          response += 100*(10**i);
        }
        else
        {
          parents[i] = parentList[i];
        }
      }
      Tag newTag = new Tag(name, parents, masterAddress);
      address newTagAddress = address(newTag);
      Master(masterAddress).mapTagStuff(newTagAddress, name, msg.sender);
      for(uint j=0; j <= parents.length; j++)
      {
        Tag(parents[j]).addChild(newTagAddress);
      }
    TagCreation(name, newTagAddress, parents);
    }
    return response;
  }

  function remove(address reciever)
  {
    suicide(reciever);
  }
}
