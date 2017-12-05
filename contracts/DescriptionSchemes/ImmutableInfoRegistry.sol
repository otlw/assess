pragma solidity ^0.4.17;

import "./ConceptInfo.sol";

// Registry-contract for concepts whose descriptions shall be unchangeable
contract ImmutableInfoRegistry is ConceptInfo{

    mapping (address => Info) public descriptions;

    struct Info {
        bool initialized;
        bytes32 data;
    }

    function getDescription(address _concept) public view returns(bytes32){
        return descriptions[_concept].data;
    }

    function registerConcept(address _concept, bytes32 _data) public {
        require(descriptions[_concept].initialized == false);
        descriptions[_concept] = Info({initialized: true, data: _data});
    }
}
