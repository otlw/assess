pragma solidity ^0.4.11;

/*
@type: Library
@name: Math
@purpose: To provide a library of math functions
*/

library Math {
    /*
      @purpose: To generate a weak random number between 0 and the specified maximum
      @param: uint seed = seed number for the generation of a random number
      @param: uint max = the max for the range of random numbers that can be made
      @returns: The random number
    */
    function getRandom(uint seed, uint max) public constant returns(uint) { //Based on the function by alexvandesande
        return(uint(keccak256(block.blockhash(block.number-1), seed))%(max+1)); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus
    }

  /*
    @purpose: To calculate the mean average distance of an array of datapoints
    @param: int[] data = the array of datapoints
  */
  function calculateMAD(int[] data) public pure returns(uint meanAbsoluteDeviation) {
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

  function getFinalScore(int[] data, uint MAD) public pure returns(int finalScore, uint largestClusterSize) {
        //get largest Cluster and its score
        for(uint i = 0; i < data.length; i++) {
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

  /*
    @purpose: To calculate the proportion of stake an assessors gets back and whether
    or not the remained should be distributed to the others or not (iff they are not in
    the biggest cluster)
  */
  function getPayout(uint distance, uint mad, uint stake, uint q) public pure returns(uint payout, bool dissenting){
      uint xOfMad = mad > 0 ? (distance*10000) / mad : 0;
      //if in rewardCluster
      if ((distance < mad) || (mad == 0 && distance == 0)) {
          uint xOfMadCapped = xOfMad > 10000 ? 10000 : xOfMad;
          payout = (q * stake * (10000 - xOfMadCapped)) / 10000 + stake;
      }
      else {
          uint xOf2MadCapped = xOfMad > 20000 ? 20000 : xOfMad;
          payout = (stake * (20000 - xOf2MadCapped)) / 20000;
          dissenting = true;
      }
  }


  function abs(int x) public pure returns(uint){
      if( x < 0 ) { return uint(-1*x); }
      else { return uint(x);}
  }
}

