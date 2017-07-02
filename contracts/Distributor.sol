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
        address[] memberAddresses;
        uint[] memberWeights;
    }

    function Distributor(uint _NInitialConcepts, address _conceptRegistry){
        NInitialConcepts = _NInitialConcepts;
        conceptRegistry = _conceptRegistry;
        conceptIndex = 0;
    }

    function addNextConcept(uint _id, uint[] _parents, address[] _initialMembers, uint[] _weights ){
        if (conceptIndex == NInitialConcepts) { throw; }
        ConceptInfo memory conceptToAdd = ConceptInfo( _id, _parents, _initialMembers, _weights);
        setup.push(conceptToAdd);
        address[] memory conceptParents = new address[] (_parents.length);
        for (uint i=0; i < conceptToAdd.parents.length; i++){
            conceptParents[i] = conceptLookup[conceptToAdd.parents[i]];
        }
        address createdConceptAddress = ConceptRegistry(conceptRegistry).makeConcept(conceptParents);
        conceptLookup[conceptIndex] = createdConceptAddress;
        //add initial Members 
        for (uint j=0; j < conceptToAdd.memberAddresses.length; j++){
            Concept(createdConceptAddress).addInitialMember(
                                                            conceptToAdd.memberAddresses[j],
                                                            conceptToAdd.memberWeights[j]
                                                            );
        }
        conceptIndex++;
    }

    function addedConcepts() returns(uint){
        return setup.length;
    }

    function addedConceptParents(uint id) returns(uint[]){ 
        return setup[id].parents;
    }

    function addedConceptMembers(uint id) returns(address[]){
        return setup[id].memberAddresses;
    }

    function addedConceptWeights(uint id) returns(uint[]){
        return setup[id].memberWeights;
    }


}
