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
    function getRandom(uint seed, uint max) constant returns(uint) { //Based on the function by alexvandesande
        return(uint(sha3(block.blockhash(block.number-1), seed))%(max+1)); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus
    }

  /*
    @purpose: To calculate the mean average distance of a (sub-)array of datapoints
    @param: int[] data = the array of datapoints
    @param: length = the position of the array that should be not considered any more
  */
  function calculateMAD(int[] data, uint length ) returns(uint meanAbsoluteDeviation) {
      assert(length <= data.length);
      int mean;
      for(uint j = 0; j < length; j++) {
          mean += data[j];
      }
      mean /=  int(length);
      for(uint k = 0; k < length; k++) {
          meanAbsoluteDeviation += abs(data[k] - mean);
      }
      meanAbsoluteDeviation /= length;
  }

  function getFinalScore(int[] data, uint MAD) returns(int largestClusterScore, uint largestClusterSize) {
      //get largest Cluster and its score
      uint largestClusterMAD;
      for(uint i=0; i < data.length; i++) {
            uint clusterSize = 0;
            int clusterSum = 0;
            int[] memory scores = new int[](data.length);
            uint idx = 0;
            for (uint j = 0; j < data.length; j++){
                if(abs(data[i] - data[j]) <= MAD ){
                    clusterSum += data[j];
                    clusterSize++;
                    scores[idx] = data[j];
                    idx++;
                }
            }
            uint clusterMAD = calculateMAD(scores, clusterSize);
            int clusterScore = clusterSum/int(clusterSize);
            // save new cluster as finalCluster if it is bigger
            // in case of a draw, tiebreakers are
            // 1) smaller mean average distance within the cluster (~consensus)
            // 2) a lower score (~rigor)
            if (clusterSize > largestClusterSize ||
                (clusterSize == largestClusterSize &&
                 ((clusterMAD < largestClusterMAD) || (clusterMAD == largestClusterMAD && clusterScore < largestClusterScore)))) {
                largestClusterSize = clusterSize;
                largestClusterScore = clusterScore;
                largestClusterMAD = clusterMAD;
            }
        }
   }

  function getPayout(uint distance, uint mad, uint stake, uint q) returns(uint payout){
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

