contract Random
{
  function getRandom(uint seed, uint max) constant returns (uint randomNumber) //Based on the original function written by github user alexvandesande
  {
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max+1));
  }

  function getRandom(uint seed, uint min, uint max) constant returns (uint randomNumber) //Based on the original function written by github user alexvandesande
  {
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max-min+1) + min);
  }
}
