pragma solidity ^0.4.23;

import "./Math.sol";
import "./Concept.sol";
import "./FathomToken.sol";
import "./Proxy.sol";

contract AssessmentHeader {
  event DataChanged(address user, bytes oldData, bytes newData);
}

contract AssessmentData is ProxyData, AssessmentHeader {
    address public assessee;
    address[] assessors;

    mapping (address => State) public assessorState;
    State public assessmentStage;
    enum State {
        None,
        Called,
        Confirmed,
        Committed,
        Done,
        Burned,
        Dissent
    }

    Concept public concept;
    FathomToken fathomToken;

    uint public endTime;
    // will keep track of timelimits for 1) latest possible time to confirm and
    // 2) earliest time to reveal
    uint public checkpoint;
    uint public size;
    uint public cost;

    mapping(address => bytes32) commits;
    uint public done; //counter how many assessors have committed/revealed their score
    mapping(address => int128) scores;
    int public finalScore;
    bytes32 public salt; //used for token distribution
    mapping (address => bytes) public data;
}

// same as assessmentData but with all variables internal, so as to not produce getter methods on the Assessment-Proxy
contract AssessmentDataInternal is ProxyData, AssessmentHeader {
  address internal assessee;
  address[] internal assessors;

  mapping (address => State) internal assessorState;
  State internal assessmentStage;
  enum State {
    None,
    Called,
    Confirmed,
    Committed,
    Done,
    Burned
  }

  Concept internal concept;
  FathomToken internal fathomToken;

  uint internal endTime;
  // will keep track of timelimits for 1) latest possible time to confirm and
  // 2) earliest time to reveal
  uint internal checkpoint;
  uint internal size;
  uint internal cost;

  mapping(address => bytes32) internal commits;
  uint internal done; //counter how many assessors have committed/revealed their score
  mapping(address => int128) internal scores;
  int internal finalScore;
  bytes32 internal salt; //used for token distribution
  mapping (address => bytes) internal data;
}
