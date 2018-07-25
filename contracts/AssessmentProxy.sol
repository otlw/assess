pragma solidity ^0.4.23;

import './Proxy.sol';
import './AssessmentData.sol';

contract AssessmentProxy is Proxy, AssessmentDataInternal {
    constructor(address proxied,
                address _concept,
                address _assessee,
                uint _size,
                uint _cost,
                uint _confirmTime,
                uint _timeLimit) public Proxy(proxied) {
        assessee = _assessee;
        concept = Concept(_concept);
        fathomToken = concept.fathomToken();

        endTime = now + _timeLimit;
        // set checkpoint to latest possible time to confirm
        checkpoint = now + _confirmTime;
        assert(checkpoint < endTime);

        size = _size;
        cost = _cost;

        fathomToken.notification(assessee, 0); // assessee has started an assessment
        done = 0;
    }
}

