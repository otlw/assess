pragma solidity ^0.4.0;

import "./Concept.sol";
import "./ConceptRegistry.sol";

contract Distributor{
    mapping (uint => address) public conceptLookup;
    uint NInitialConcepts;
    uint public conceptIndex;
    ConceptInfo[] setup;
    address conceptRegistry;

    struct Member {
        address memberAddress;
        uint weight;
    }

    struct ConceptInfo {
        uint id;
        uint[] parents;
        uint lifetime;
        bytes data;
        address[] memberAddresses;
        uint[] memberWeights;
    }

    function Distributor(uint _NInitialConcepts, address _conceptRegistry){
        NInitialConcepts = _NInitialConcepts;
        conceptRegistry = _conceptRegistry;
        conceptIndex = 0;
    }

    function addNextConcept(uint _id,
                            uint[] _parents,
                            uint[] _propagationRates,
                            uint _lifetime,
                            bytes _data,
                            address[] _initialMembers,
                            uint[] _weights){
        require(conceptIndex < NInitialConcepts);
        ConceptInfo memory conceptToAdd = ConceptInfo( _id, _parents, _lifetime, _data, _initialMembers, _weights);
        setup.push(conceptToAdd);
        address[] memory conceptParents = new address[] (_parents.length);
        for (uint i=0; i < conceptToAdd.parents.length; i++){
            conceptParents[i] = conceptLookup[conceptToAdd.parents[i]];
        }
        address createdConceptAddress = ConceptRegistry(conceptRegistry).makeConcept(conceptParents,
                                                                                     _propagationRates,
                                                                                     _lifetime,
                                                                                     _data);
        conceptLookup[conceptIndex] = createdConceptAddress;
        //add initial Members //this shoudl happen in an extra function
        for (uint j=0; j < conceptToAdd.memberAddresses.length; j++){
            Concept(createdConceptAddress).addInitialMember(
                                                            conceptToAdd.memberAddresses[j],
                                                            conceptToAdd.memberWeights[j]
                                                            );
        }
        conceptIndex++;
    }

    function addInitialMembers(uint _id) {
        ConceptInfo conceptToAddTo = setup[_id];
        /* require(_id < conceptIndex && conceptToAddTo.id == _id); */ //prevent calls to nonexistsing concepts
        address createdConceptAddress = conceptLookup[_id];
        for (uint j=0; j < conceptToAddTo.memberAddresses.length; j++) {
            Concept(createdConceptAddress).addInitialMember(
                                                            conceptToAddTo.memberAddresses[j],
                                                            conceptToAddTo.memberWeights[j]
                                                            );
        }
    }

    function addedConceptsLength() returns(uint){
        return setup.length;
    }

    function addedConceptParentsLength(uint id) returns(uint){
        return setup[id].parents.length;
    }

    function addedConceptParent(uint id, uint _pIdx) returns(uint){
        require(_pIdx < setup[id].parents.length);
        return setup[id].parents[_pIdx];
    }

    function addedConceptMembersLength(uint id) returns(uint){
        return setup[id].memberAddresses.length;
    }

    function addedConceptMemberAddress(uint id, uint _mIdx) returns(address){
        require(_mIdx < setup[id].memberAddresses.length);
        return setup[id].memberAddresses[_mIdx];
    }

    function addedConceptWeightsLength(uint id) returns(uint){
        return setup[id].memberWeights.length;
    }

    function addedConceptMemberWeight(uint id, uint _mIdx) returns(uint){
        require(_mIdx < setup[id].memberWeights.length);
        return setup[id].memberWeights[_mIdx];
    }


}
