function sortaRandomGen() { // function to hash a bunch o' blocks to get a "sorta" random number (SECURITY UNTESTED)

  uint[10] blockHashes;

  uint currentBlock = block.number;
  uint kindaRandom; // integer to hold the final random variable
  uint sumHash; // integer to hold the sum of the hashes

  for(uint i = 0; i <= 10; i++) { // for loop to fill the blockHashes array


      blockHashes[i] = uint(block.blockhash(currentBlock)); // adds the integer of the current blocks's hash to the array
      currentBlock -= 1; // grabs the previous block

  }

  for(uint j = 0; j <= 10; j++) { // for loop to sum the hashes

      sumHash += blockHashes[j];
      sumHash = uint(sha3(sumHash));

  }

  uint kindaRandom = uint(sha3(sumHash));
  return kindaRandom;
