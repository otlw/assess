/*
@type: contract
@name: Math
@purpose: To provide a library of math functions
*/

contract Math
{
  /*
  @type: function
  @name: getRandom
  @purpose: To generate a weak random number between 0 and the specified maximum
  @param: uint seed = seed number for the generation of a random number
  @param: uint max = the max for the range of random numbers that can be made
  @returns: The random number
  */
  function getRandom(uint seed, uint max) constant returns(uint) //Based on the original function written by github user alexvandesande
  {
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max+1)); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus
  }

  /*
  @type: function
  @name: getRandom
  @purpose: To generate a weak random number between a specified minimum and the specified maximum
  @param: uint seed = seed number for the generation of a random number
  @param: uint max = the max for the range of random numbers that can be made
  @param: uint min = the min for the range of random numbers that can be made
  @returns: The random number
  */
  function getRandom(uint seed, uint min, uint max) constant returns(uint) //Based on the original function written by github user alexvandesande
  {
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max-min+1) + min); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus and addition
  }

  function calculateMAD(int[] data, int n) constant returns(int)
  {
    int mean;
    int totalRelativeDistance;
    int meanAbsoluteDeviation;
    for(uint j = 0; j < data.length; j++)
    {
      mean += data[j];
    }
    mean /= n;
    for(uint k = 0; k < data.length; k++)
    {
      int distanceFromMean = data[k] - mean;
      if(distanceFromMean < 0)
      {
        distanceFromMean *= -1;
      }
      totalRelativeDistance += distanceFromMean;
    }
    meanAbsoluteDeviation = totalRelativeDistance/n;
    return meanAbsoluteDeviation;
    }
}
