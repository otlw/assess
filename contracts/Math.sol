pragma solidity ^0.4.11;

/*
@type: contract
@name: Math
@purpose: To provide a library of math functions
*/

library Math {
    uint constant maxAssessors = 200;
  /*
  @purpose: To generate a weak random number between 0 and the specified maximum
  @param: uint seed = seed number for the generation of a random number
  @param: uint max = the max for the range of random numbers that can be made
  @returns: The random number
  */
  function getRandom(uint seed, uint max) constant returns(uint) { //Based on the function by alexvandesande
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max+1)); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus
  }

  /*
  @purpose: To generate a weak random number between a specified minimum and the specified maximum
  @param: uint seed = seed number for the generation of a random number
  @param: uint max = the max for the range of random numbers that can be made
  @param: uint min = the min for the range of random numbers that can be made
  @returns: The random number
  */
  function getRandom(uint seed, uint min, uint max) constant returns(uint) {
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max-min+1) + min); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus and addition
  }

  function calculateMAD(int[] data) constant returns(uint meanAbsoluteDeviation) {
    int mean;
    for(uint j = 0; j < data.length; j++) {
        mean += data[j];
    }
    mean /=  int(data.length);
    for(uint k = 0; k < data.length; k++) {
        meanAbsoluteDeviation += abs(data[k] - mean);
    }
    meanAbsoluteDeviation /= data.length;
  }

  function getFinalScore(int[] data) returns(int finalScore, uint largestClusterSize, uint MAD) {
        //get largest Cluster and its score
        MAD = calculateMAD(data);
        for(uint i=0; i < data.length; i++) {
            uint clusterSize = 0;
            int clusterScore = 0;
            for (uint j = 0; j < data.length; j++){
                if(abs(data[i] - data[j]) <= MAD ){
                    clusterScore += data[j];
                    clusterSize++;
                }
            }
            if(clusterSize > largestClusterSize) {
                largestClusterSize = clusterSize;
                finalScore = clusterScore/int(clusterSize);
            }
        }
   }

  function getPayout(int score, int finalScore, uint mad, uint stake, uint q) returns(uint payout){
      uint distance = abs(score - finalScore);
      uint xOfMad = mad > 0 ? (distance*10000) / mad : 0;
      if (mad - distance <= mad){ //is in RewardCluster?
          uint xOfMadCapped = xOfMad > 10000 ? 10000 : xOfMad;
          payout = (q * stake * (10000 - xOfMadCapped)) / 10000 + stake;
      }
      else {
          uint xOf2MadCapped = xOfMad > 20000 ? 20000 : xOfMad;
          payout = (stake * (20000 - xOf2MadCapped)) / 20000;
      }
  }


  function abs(int x) returns (uint){
      if( x < 0 ) { return uint(-1*x); }
      else { return uint(x);}
  }
}

