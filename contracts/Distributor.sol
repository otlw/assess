pragma solidity ^0.4.0;

import "./Concept.sol";
import "./ConceptRegistry.sol";

contract Distributor{
    mapping (uint => address) public conceptLookup;
    uint NInitialConcepts;
    uint public conceptIndex;
    ConceptInfo[] setup;
    address conceptRegistry;

    bool initialized;

    struct Member {
        address memberAddress;
        uint weight;
    }

    struct ConceptInfo {
        uint id;
        bytes data;
        uint[] parents;
        uint lifetime;
        uint initialMembersToBeAdded;
        address[] memberAddresses;
        uint[] memberWeights;
    }

    function Distributor(uint _NInitialConcepts, address _conceptRegistry){
        NInitialConcepts = _NInitialConcepts + 1;
        conceptRegistry = _conceptRegistry;
    }

    function init () {
        require(!initialized);
        conceptLookup[0] = ConceptRegistry(conceptRegistry).mewAddress();
        conceptIndex = 1;
        initialized = false;
    }

    function addNextConcept(uint _id,
                            bytes _data,
                            uint[] _parents,
                            uint[] _propagationRates,
                            uint _lifetime,
                            uint _nInitialMembers) {
        require(conceptIndex < NInitialConcepts);
        ConceptInfo memory conceptToAdd = ConceptInfo( _id, _data, _parents, _lifetime, _nInitialMembers, new address[](0), new uint[](0));
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
        conceptIndex++;
    }

    function addInitialMember(uint _id, address _memberAddress, uint _memberWeight) {
        ConceptInfo conceptToAddTo = setup[_id];
        require(_id < conceptIndex && conceptToAddTo.id == _id);// prevent calls to nonexistsing concepts
        if (conceptToAddTo.initialMembersToBeAdded > 0){
            address createdConceptAddress = conceptLookup[_id];
            Concept(createdConceptAddress).addInitialMember(_memberAddress, _memberWeight);
            conceptToAddTo.memberAddresses.push(_memberAddress);
            conceptToAddTo.memberWeights.push(_memberWeight);
            conceptToAddTo.initialMembersToBeAdded--;
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

    function addedConceptAddableMembers(uint id) returns(uint){
        return setup[id].initialMembersToBeAdded;
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
