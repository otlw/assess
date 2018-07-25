pragma solidity ^0.4.23;

import './Assessment.sol';
import './Concept.sol';
import './AssessmentProxy.sol';
import './ConceptProxy.sol';

contract ProxyFactory {
    address private masterConceptCopy;
    address private masterAssessmentCopy;

    constructor(address _masterConcept, address _masterAssessment) public {
        masterConceptCopy = _masterConcept;
        masterAssessmentCopy = _masterAssessment;
    }

    function createAssessment(address assessee, uint cost, uint size, uint _waitTime, uint _timeLimit)
        public
        returns (Assessment)
    {
      return Assessment(new AssessmentProxy(masterAssessmentCopy, msg.sender, assessee, cost, size, _waitTime, _timeLimit));
    }

    function createConcept(address[] _parents, uint[] _propagationRates, uint _lifetime, bytes _data, address _owner)
      public
      returns (Concept)
    {
      return Concept(new ConceptProxy(masterConceptCopy, msg.sender, _parents, _propagationRates, _lifetime, _data, _owner));
    }

}
