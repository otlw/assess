contract otlwApp
{
        function otlwApp()
        {
        }
        mapping (address => uint) tokenBalance;
        mapping (address => string) tagName;
        mapping (string => address) tagAddress;
        mapping (address => string[]) acheivements;
        function addTag(string name) returns(uint response)
        {
                if(tokenBalance[msg.sender] < 1)
                        return 1;
                if(tagAddress[name] == 0)
                        return 2;
                
        }
}
