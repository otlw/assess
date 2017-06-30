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
        Member[] members;
    }

    function Distributor(uint _NInitialConcepts, address _conceptRegistry){
        NInitialConcepts = _NInitialConcepts;
        conceptRegistry = _conceptRegistry;
        conceptIndex = 0;
    }

    function addNextConcept(uint _id, uint[] _parents, address[] _initialMembers, uint[] _weights ){
        Member[] memory conceptMembers = new Member[] (_initialMembers.length);
        for (uint m=0; m< _initialMembers.length; m++){
            conceptMembers[m] = Member(_initialMembers[m], _weights[m]);
        }
        ConceptInfo memory conceptToAdd = ConceptInfo( _id, _parents, conceptMembers);
        setup.push(conceptToAdd);
        address[] memory conceptParents = new address[] (_parents.length);
        for (uint i=0; i < conceptToAdd.parents.length; i++){
            conceptParents[i] = conceptLookup(conceptToAdd.parents[i]);
        }
        address createdConceptAddress = ConceptRegistry(conceptRegistry).makeConcept(conceptParents);
        conceptLookup[conceptIndex] = createdConceptAddress;
        //add initial Members 
        for (uint j=0; i < conceptToAdd.members.length; i++){
            Concept(createdConceptAddress).addInitialMember(
                                                            conceptToAdd.members[j].memberAddress,
                                                            conceptToAdd.members[j].weight
                                                            );
        }
        conceptIndex++;
    }

}
