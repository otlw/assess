import "api.sol";

contract RandomNumbers is usingOraclize
{
  function getSeedNumber() returns(uint)
  {
    oraclize_setNetwork(networkID_mainnet);
    return uint(oraclize_query("WolframAlpha", "random number between 0 and 100"));
  }

  function getRandom(uint max) returns(uint)
  {
    return ((getSeedNumber()/100)*max);
  }

  function getRandom(uint min, uint max) returns(uint)
  {
    return ((getSeedNumber()/100)*(max-min)+min);
  }
}
