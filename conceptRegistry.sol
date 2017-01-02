pragma solidity ^0.4.0;

import "concept.sol";
import "assessment.sol";

/*
@type: contract
@name: ConceptRegistry
@purpose: To create concepts and store some concept data
*/
contract ConceptRegistry
{
  mapping (address => bool) public conceptExists; //Maps concept addresses to a bool to confirm their existance
  address userRegistry; //The address of the userRegistry contract
  bool locked = false; //Keeps track of whether or not the function to set the userRegistry variable is locked yet or not
  address public mewAddress;

  /*
  @type: modifier
  @name: onlyThis
  @purpose: to only allow the this contract to call a function to which this modifier is applied
  */
  modifier onlyThis()
  {
    if(msg.sender != address(this)) //Checks if msg.sender is this contract
    {
      throw; //Throws out the function call if it isn't
    }
    _;
  }

  /*
  @type: event
  @name: ConceptCreation
  @occasion: When a concept is created
  @purpose: To help build a data store of concepts
  @stores: string _conceptName
  @stores: address _conceptAddress
  @stores: address[] _parents
  */
  event ConceptCreation (address _concept); //the address of the concept that was created

  /*
  @type: constructor function
  @purpose: To initialize the conceptRegistry contract
  @returns: nothing
  */
  function ConceptRegistry()
  {
  }

  /*
  @type: function
  @purpose: To set the userRegistry address
  @param: address userRegistry = the address of the userRegistry contract
  @returns: nothing
  */
  function init(address _userRegistry, address mew)
  {
    if(locked == false) //Checks if the function has already been called
    {
      userRegistry = _userRegistry; //Sets the userRegistry address
      mewAddress = mew;
      locked = true; //Makes it so this function cannot be called again
    }
  }

  /*
  @type: function
  @purpose: To make a concept
  @param: string name = the name of the concept to be made
  @param: address[] parentList = an array of addresses containing the addresses of the concepts parents
  @returns: nothing
  */
  function makeConcept(address[] parentList)
  {
    Concept newConcept = new Concept(parentList, userRegistry, address(this)); //Makes a new concept with the provided data
    address newConceptAddress = address(newConcept); //initializes an address variable and sets it equal to the address of the newly created concept
    conceptExists[newConceptAddress] = true; //Maps the concept address to true to show that it exists
    if(parentList.length == 0)
    {
      Concept(mewAddress).addChild(newConceptAddress);
    }
    for(uint j=0; j < parentList.length; j++) //Iterates of the parents array in memory
    {
      Concept(parentList[j]).addChild(newConceptAddress); //Adds the newly created concept to each of the parents as a child
    }
    ConceptCreation(newConceptAddress); //Makes ConceptCreation event with provided data
  }
}
