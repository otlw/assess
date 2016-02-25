contract otlwApp
{
  function otlwApp()
  {

  }
  mapping (address => uint) tokenBalance;
  mapping (address => string) tagName;
  mapping (string => address) tagAddress;
  mapping (address => string[]) acheivements;
  function addTag(string name) returns(uint)
  {
    uint response = 0;
    if(tokenBalance[msg.sender] < 1)
      response += 1;
    if(tagAddress[name] == 0)
      response += 10;
    if(response==0)
    {
      //Put the code to actually create a new tag contract here
      //Need to create a general purpose tag contract to be used as a template for this
    }
    return response;
  }
}
