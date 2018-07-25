pragma solidity ^0.4.23;

contract AssessmentGetter is AssessmentDataInternal {

  // public functions (redoing the getter functions)
  function getAssessee() public returns(address) {
    return assessee;
  }

  function getConcept() public returns(address) {
    return concept;
  }

  function getFathomToken() public returns(address) {
    return fathomToken;
  }

  function getEndTime() public returns(uint) {
    return endTime;
  }


  function getCheckpoint() public returns(uint) {
    return checkpoint;
  }


  function getSize() public returns(uint) {
    return size;
  }


  function getCost() public returns(uint) {
    return cost;
  }


  function getDone() public returns(uint) {
    return done;
  }


  function getFinalScore() public returns(uint) {
    return finalScore;
  }


  function getSalt() public returns(bytes32) {
    return salt;
  }


  function getData(address owner) public returns(bytes) {
    return data[owner];
  }
}
