contract otlw-app 
{
	function otlw-app()
	{
        }		
	mapping (address => uint) public tokenBalance;
	mapping (address => string) public tagName;
	mapping (string => address) public tagAddress;
	mapping (address => string[]) public acheivements;
	function addTag(string name) returns(uint response)
	{
		if(tokenBalance[msg.sender] < 1) 
			return 1;
		if(tokenAddress[name] = 
	function addAcheivment(address user, string acheivment)
	{
		
	
