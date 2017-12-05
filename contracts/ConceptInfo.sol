pragma solidity ^0.4.11;

contract ConceptInfo {

    function getDescription(address _concept) returns(bytes32);
}

// Registry-contract for concepts whose descriptions shall be unchangeable
contract ImmutableInfo is ConceptInfo{

    mapping (address => bytes32) public descriptions;

    struct Info {
        bool initialized;
        bytes32 data;
    }

    function getDescription(address _concept) public view returns(bytes32){
        return conceptInfo[_concept].data;
    }

    function registerConcept(address _concept, bytes32 _data) public {
        require(conceptInfo[_concept].initialized == false);
        conceptInfo[_concept] = Info({initialzed: true, data: _data});
    }
}

// Registry-contract for concepts whose descriptions shall be changeable by any two persons
// of a set of trusted owners
contract GroupOwnedConceptInfo is ConceptInfo {

    mapping (address => bool) memberStatus;

    struct NewDescProposal {
        bytes32 _newDesc;
        uint voteCount;
    }

    NewDescProposal[] proposals;

    function PersonalConceptInfo(address[] _members) public {
        for (uint i; i< _members.length; i++){
            memberStatus[_members[i]] = true;
        }
    }

    function changeDescription(bytes32 _newDesc) onlyOwner public {
        descriptions[]
        description = _newDesc;
    }
}

