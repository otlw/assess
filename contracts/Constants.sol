pragma solidity ^0.4.18;

/*
  @type: contract
  @name: Constants
  @purpose: To ease development-cyles and testing, all constants will be loaded
  from this contract, so that we can change them to our needs. NOTE: This is not
  supposed to be part of the final contract-design, but specifically for testing
  purposes
*/

contract Constants {
  uint public MIN_ASSESSMENT_SIZE; // 5
  uint public CHALLENGE_COMMIT_PERIOD; // 12 hours
  uint public ASSESSORPOOL_SIZE_FACTOR;  // originally 5

  function Constants(uint _minSize, uint _challengePeriod, uint _assessorpoolSize) public {
    MIN_ASSESSMENT_SIZE = _minSize;
    CHALLENGE_COMMIT_PERIOD = _challengePeriod;
    ASSESSORPOOL_SIZE_FACTOR = _assessorpoolSize;
  }

  function setMinAssessmentSize(uint newSize) public {
    MIN_ASSESSMENT_SIZE = newSize;
  }

  function setChallengeCommitPeriod(uint newTime) public {
    CHALLENGE_COMMIT_PERIOD = newTime;
  }

  function setAssessorpoolSizeFactor(uint newFactor) public {
    ASSESSORPOOL_SIZE_FACTOR = newFactor;
  }

}
