contract Master
{
  function Master()
  {

  }
  mapping (address => uint) tokenBalance;
  mapping (address => string) tagName;
  mapping (string => address) tagAddress;
  mapping (address => string[]) acheivements;
  function addTag(string name, address[] parentList) returns(uint)
  {
    uint response = 0;
    if(tokenBalance[msg.sender] < 1)
    {
      response += 1;
    }
    if(tagAddress[name] == 0)
    {
      response += 10;
    }
    if(response==0)
    {
      Tag newTag;
      address newTagAddress = address(newTag);
      tagName[newTagAddress] = name;
      tagAddress[name] = newTagAddress;
      for(uint i=0; i<= parentList.length; i++)
      {
        if(parentList[i]==0)
        {
          response += 100;
        }
        if(response==0)
        {
          newTag.addParent(parentList[i]);
        }
      }
    }
    return response;
  }
  function getTagName(address parentAddress) returns(string)
  {
    return tagName[parentAddress];
  }
}

contract Tag
{
  address[] parents;
  function Tag()
  {

  }
  function addParent(address parent)
  {
    parents.push(parent);
  }
}
