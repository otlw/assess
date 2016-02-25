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
    uint responce = 0;
    if(tokenBalance[msg.sender] < 1)
      responce += 1;
    if(tagAddress[name] == 0)
      responce += 10;
    if(responce==0)
    {
      //Put the code to actually create a new tag contract here
      //Need to create a general purpose tag contract to be used as a template for this
    }
    return responce;  
  }
}
