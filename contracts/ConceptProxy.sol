pragma solidity ^0.4.23;

import './Proxy.sol';
import './ConceptData.sol';
import './ConceptRegistry.sol';

contract ConceptProxy is Proxy, ConceptDataInternal {
  event fbCP(address x);
  constructor(address proxied,
              address _conceptRegistry,
              address[] _parents,
              uint[] _propagationRates,
              uint _lifetime,
              bytes _data,
              address _owner) public Proxy(proxied) {
    require(_parents.length == _propagationRates.length);
    conceptRegistry = ConceptRegistry(_conceptRegistry);

    for (uint j=0; j < _parents.length; j++) {
      require(conceptRegistry.conceptExists(_parents[j]));
      require(_propagationRates[j] < 1000);
    }
    emit fbCP(msg.sender);

    propagationRates = _propagationRates;
    parents = _parents;
    data = _data;
    lifetime = _lifetime;
    owner = _owner;
    fathomToken = FathomToken(conceptRegistry.fathomToken());
  }
}

