pragma solidity ^0.4.0;

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
    if(initialized == false) {
      userRegistry = _userRegistry;
      distributorAddress = _distributor;
      Concept mew = new Concept(new address[] (0));
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
  function makeConcept(address[] parentList) returns (address){
    Concept newConcept = new Concept(parentList);
    address newConceptAddress = address(newConcept);
    conceptExists[newConceptAddress] = true;

    if(parentList.length == 0) {
      newConcept.addParent(mewAddress);
    }
    for(uint j=0; j < parentList.length; j++) {
      if(!conceptExists[parentList[j]]){
        throw;
      }
    }
    ConceptCreation(newConceptAddress);
    return newConceptAddress;
  }
}
