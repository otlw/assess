import "api.sol";


contract RandomNumbers is usingOraclize {


  function sortaRandomGen() returns(uint) { //function using oraclize to get a random number from wolfram alpha

    oraclize_setNetwork(networkID_mainnet);

    return uint(oraclize_query("WolframAlpha", "random number between 0 and 100"));

  }
}
