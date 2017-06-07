pragma solidity ^0.4.0;

import "./Concept.sol";

/*
@type: contract
@name: ConceptRegistry
@purpose: To create concepts and store some concept data
*/
contract ConceptRegistry {
  mapping (address => bool) public conceptExists; //Maps concept addresses to a bool to confirm their existance
  address userRegistry; //The address of the userRegistry contract
  bool initialized = false; //Keeps track of whether or not the function to set the userRegistry variable is locked yet or not
  address public mewAddress;

  /*
  @occasion: When a concept is created
  @purpose: To help build a data store of concepts
  */
  event ConceptCreation (address _concept); //the address of the concept that was created

  /*
  @type: function
  @purpose: To set the userRegistry address
  @param: address userRegistry = the address of the userRegistry contract
  @returns: nothing
  */
  function init(address _userRegistry, address mew) returns(bool){
    if(initialized == false) { //Checks if the function has already been called
      userRegistry = _userRegistry; //Sets the userRegistry address
      mewAddress = mew;
      initialized = true; //Makes it so this function cannot be called again
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
    Concept newConcept = new Concept(parentList, userRegistry, address(this)); //Makes a new concept with the provided data
    address newConceptAddress = address(newConcept); //initializes an address variable and sets it equal to the address of the newly created concept
    conceptExists[newConceptAddress] = true; //Maps the concept address to true to show that it exists
    if(parentList.length == 0) {
      Concept(mewAddress).addChild(newConceptAddress);
    }
    for(uint j=0; j < parentList.length; j++) { //Iterates of the parents array in memory
      Concept(parentList[j]).addChild(newConceptAddress); //Adds the newly created concept to each of the parents as a child
    }
    ConceptCreation(newConceptAddress); //Makes ConceptCreation event with provided data
  }
}
