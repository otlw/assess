pragma solidity ^0.4.11;

import "./Concept.sol";

//@purpose: To create and store the concept ontology
contract ConceptRegistry {
    mapping (address => bool) public conceptExists;
    address public userRegistry;
    bool initialized = false;
    address public mewAddress; //a manually created contract with no parents
    address public distributorAddress; //a manually created contract with no parents

    event ConceptCreation (address _concept);

    //@purpose: give this contract the address of a UserRegistry and mew Concept
    function init(address _userRegistry, address _distributor) returns(bool){
        if (initialized == false) {
            userRegistry = _userRegistry;
            distributorAddress = _distributor;
            Concept mew = new Concept(new address[] (0), new uint[] (0), uint(2**255), "");
            mewAddress = address(mew);
            conceptExists[mewAddress] = true;
            initialized = true;
        }
        else {
            return(false);
        }
    }

    /*
      @purpose: To make a concept
      @param: address[] parentList = an array of addresses containing the addresses of the concepts parents
    */
    function makeConcept(address[] parentList, uint[] _propagationRates, uint _lifetime, bytes _data) returns (address){
        for (uint j=0; j < parentList.length; j++) {
            require(conceptExists[parentList[j]]);
            require(_propagationRates[j] <= 1000);
        }

        if (parentList.length == 0) {
            parentList = new address[] (1);
            parentList[0] = mewAddress;
        }
        Concept newConcept = new Concept(parentList, _propagationRates, _lifetime, _data);

        conceptExists[address(newConcept)] = true;
        ConceptCreation(address(newConcept));
        return address(newConcept);
    }
}
