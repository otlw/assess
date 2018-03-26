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
  uint public MIN_ASSESSMENT_SIZE = 5;
  uint public CHALLENGE_COMMIT_PERIOD = 12 hours;
  uint public ASSESSORPOOL_SIZE_FACTOR = 5;

  function setMinAssessmentSize(uint newSize) public {
    MIN_ASSESSMENT_SIZE = newSize;
  }

  function setChallengeCommitPeriod(uint newTime) public {
    MIN_ASSESSMENT_SIZE = newTime;
  }

  function setAssessorpoolSizeFactor(uint newFactor) public {
    MIN_ASSESSMENT_SIZE = newFactor;
  }

}
