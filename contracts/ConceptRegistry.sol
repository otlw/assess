pragma solidity ^0.4.0;

import "./Concept.sol";


//@purpose: To create and store the concept ontology
contract ConceptRegistry {
  mapping (address => bool) public conceptExists; //Maps concepts to a bool
  address userRegistry; //The address of the userRegistry contract
  bool initialized = false; // for locking the init function
  address public mewAddress; // a manually created contract with no parents

  event ConceptCreation (address _concept);

  //@purpose: give this contract the address of a UserRegistry and mew Concept
  function init(address _userRegistry, address mew) returns(bool){
    if(initialized == false) { //Checks if the function has already been called
      userRegistry = _userRegistry;
      mewAddress = mew;
      conceptExists[mewAddress] = true;
      initialized = true; //locks this function
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

    if(parentList.length == 0) { // if no parents specified make it a child of the Mew concept
      Concept(mewAddress).addChild(newConceptAddress);
      newConcept.addParent(mewAddress);
    }
    for(uint j=0; j < parentList.length; j++) { // Iterates parents to add this concept as a child
      Concept(parentList[j]).addChild(newConceptAddress);
    }
    ConceptCreation(newConceptAddress);
  }
}
