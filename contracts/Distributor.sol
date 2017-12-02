pragma solidity ^0.4.0;

import "./Concept.sol";
import "./ConceptRegistry.sol";

contract Distributor{

    // specify many concepts can be added below the mew-concept
    uint nInitialConcepts;

    // counter to keep track of how many concepts have been added
    // mew will be created while initialization so it will start at 1
    uint public nextConceptIndex;

    mapping (uint => ConceptInfo) setup;
    address conceptRegistry;
    bool public initialized;

    struct ConceptInfo {
        bytes data;
        uint[] parents;
        uint lifetime;
        uint initialMembersToBeAdded;
        address[] memberAddresses;
        uint[] memberWeights;
        address livesAt;
    }

    function Distributor(uint _nInitialConcepts, address _conceptRegistry){
        nInitialConcepts = _nInitialConcepts;
        conceptRegistry = _conceptRegistry;
    }

    function init() public {
        require(!initialized);
        // creating mew
        setup[0] = ConceptInfo("", new uint[](0), 0, 0, new address[](0), new uint[](0), ConceptRegistry(conceptRegistry).mewAddress());
        nextConceptIndex = 1;
        initialized = true;
    }
    function addNextConcept(bytes _data,
                            uint[] _parents,
                            uint[] _propagationRates,
                            uint _lifetime,
                            uint _nInitialMembers) public {
        require(initialized && nextConceptIndex <= nInitialConcepts);
        address[] memory conceptParents = new address[] (_parents.length);
        for (uint i=0; i < _parents.length; i++){
            address parentAddress = setup[_parents[i]].livesAt;
            require(parentAddress != address(0x0));
            conceptParents[i] = parentAddress;
        }
        address createdConceptAddress = ConceptRegistry(conceptRegistry).makeConcept(conceptParents,
                                                                                     _propagationRates,
                                                                                     _lifetime,
                                                                                     _data);
        setup[nextConceptIndex] = ConceptInfo(_data, _parents, _lifetime, _nInitialMembers, new address[](0), new uint[](0), createdConceptAddress);
        nextConceptIndex++;
    }

    function addInitialMember(uint _id, address _memberAddress, uint _memberWeight) public {
        // before adding members we require that
        // - the distributor has been initialized,
        // - the concept already exists and
        // - it still has space for members
        require(initialized && setup[_id].livesAt != address(0x0) && setup[_id].initialMembersToBeAdded > 0 );
        address createdConceptAddress = setup[_id].livesAt;
        Concept(createdConceptAddress).addInitialMember(_memberAddress, _memberWeight);
        setup[_id].memberAddresses.push(_memberAddress);
        setup[_id].memberWeights.push(_memberWeight);
        setup[_id].initialMembersToBeAdded--;
    }

    function conceptLookup(uint _id) public returns(address) {
        return setup[_id].livesAt;
    }

    function addedConceptsLength() public returns(uint){
        return nextConceptIndex -1 ; //excluding mew
    }

    function addedConceptParentsLength(uint id) public returns(uint){
        return setup[id].parents.length;
    }

    function addedConceptParent(uint id, uint _pIdx) public returns(uint){
        require(_pIdx < setup[id].parents.length);
        return setup[id].parents[_pIdx];
    }

    function addedConceptMembersLength(uint id) public returns(uint){
        return setup[id].memberAddresses.length;
    }

    function addedConceptAddableMembers(uint id) public returns(uint){
        return setup[id].initialMembersToBeAdded;
    }

    function addedConceptMemberAddress(uint id, uint _mIdx) public returns(address){
        require(_mIdx < setup[id].memberAddresses.length);
        return setup[id].memberAddresses[_mIdx];
    }

    function addedConceptWeightsLength(uint id) public returns(uint){
        return setup[id].memberWeights.length;
    }

    function addedConceptMemberWeight(uint id, uint _mIdx) public returns(uint){
        require(_mIdx < setup[id].memberWeights.length);
        return setup[id].memberWeights[_mIdx];
    }
}
