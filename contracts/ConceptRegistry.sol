pragma solidity ^0.4.0;

import "./Concept.sol";


//@purpose: To create and store the concept ontology
contract ConceptRegistry {
  mapping (address => bool) public conceptExists;
  address userRegistry;
  bool initialized = false;
  address public mewAddress; //a manually created contract with no parents

  event ConceptCreation (address _concept);

  //@purpose: give this contract the address of a UserRegistry and mew Concept
  function init(address _userRegistry, address mew) returns(bool){
    if(initialized == false) {
      userRegistry = _userRegistry;
      mewAddress = mew;
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
  function makeConcept(address[] parentList) {
    Concept newConcept = new Concept(parentList, userRegistry);
    address newConceptAddress = address(newConcept);
    conceptExists[newConceptAddress] = true;

    if(parentList.length == 0) {
      Concept(mewAddress).addChild(newConceptAddress);
      newConcept.addParent(mewAddress);
    }
    for(uint j=0; j < parentList.length; j++) {
      if(!conceptExists[parentList[j]]){
        throw;
      }
      Concept(parentList[j]).addChild(newConceptAddress);
    }
    ConceptCreation(newConceptAddress);
  }
}
