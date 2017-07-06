pragma solidity ^0.4.0;

/*
@type: contract
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
  @purpose: To generate a weak random number between a specified minimum and the specified maximum
  @param: uint seed = seed number for the generation of a random number
  @param: uint max = the max for the range of random numbers that can be made
  @param: uint min = the min for the range of random numbers that can be made
  @returns: The random number
  */
  function getRandom(uint seed, uint min, uint max) constant returns(uint) {
    return(uint(sha3(block.blockhash(block.number-1), seed))%(max-min+1) + min); //Hashes the seed number with the last blockhash to generate a random number and shifts it into the desired range by using a modulus and addition
  }

  function calculateMAD(int[] data) constant returns(int) {
    int mean;
    int totalRelativeDistance;
    int meanAbsoluteDeviation;
    for(uint j = 0; j < data.length; j++) {
      mean += data[j];
    }
    mean /=  int(data.length);
    for(uint k = 0; k < data.length; k++) {
      int distanceFromMean = data[k] - mean;
      if(distanceFromMean < 0) {
        distanceFromMean *= -1;
      }
      totalRelativeDistance += distanceFromMean;
    }
    meanAbsoluteDeviation = totalRelativeDistance/int(data.length);
    return meanAbsoluteDeviation;
  }

  function getLargestCluster(int[] data) constant returns(int[]){
      uint largestClusterSize = 0;
      bool[] memory largestCluster = new bool[] (data.length);

      int MAD = calculateMAD(data);

      for(uint i=0; i < data.length; i++) {
          for (uint j = 0; j < data.length; j++){
              bool[] memory cluster = new bool[] (data.length);
              uint clusterSize;
              if(abs(data[i] - data[j]) <= MAD ){
                  cluster[j] = true;
                  clusterSize++;
              }
              if(clusterSize > largestClusterSize) {
                  largestCluster = cluster;
                  largestClusterSize = clusterSize;
              }
          }
      }

      int[] memory finalCluster = new int[] (largestClusterSize);
      for(uint k =0; k < largestCluster.length; k++) {
          uint index = 0;
          if(largestCluster[k]) {
              finalCluster[index] = data[k];
              index++;
          }
      }
      return finalCluster;
  }

  function abs(int x) returns (int256){
      if( x < 0 ) { return -1*x;}
      else { return x;}
  }
}

