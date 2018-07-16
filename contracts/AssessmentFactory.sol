pragma solidity ^0.4.23;

import './Assessment.sol';
import './AssessmentProxy.sol';

contract AssessmentFactory {
    address private masterCopy;
    event fbFA(address x);

    constructor(address _masterCopy) public {
        masterCopy = _masterCopy;
    }

    function createAssessment(address assessee, uint cost, uint size, uint _waitTime, uint _timeLimit)
        public
        returns (Assessment)
    {
      fbFA(msg.sender);
      return Assessment(new AssessmentProxy(masterCopy, msg.sender, assessee, cost, size, _waitTime, _timeLimit));
    }
}
