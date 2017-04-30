pragma solidity ^0.4.0;

import "./abstract/AbstractUserRegistry.sol";
import "./abstract/AbstractUser.sol";
import "./abstract/AbstractConceptRegistry.sol";
import "./Assessment.sol";
import "./Math.sol";

/*
@type: contract
@name: Concept
@purpose: To store concept data and create and store information about assessments of this concept
*/
contract Concept
{
  address[] public parents; //The concepts that this concept is child to (ie: Calculus is child to Math)
  address[] public children; //The concepts that this concept is parent to (ie: Math is parent to Calculus)
  address userRegistry; //The address of the userRegistry contract
  address conceptRegistry; //The address of the conceptRegistry contract
  uint public maxWeight; //The current highest weight for this assessment
  address[] public owners; //Those who have earned the concept
  mapping (address => int) public currentScores; //The most recent score of a user
  mapping (address => bool) public assessmentExists; //All existing assessments
  mapping (address => uint) public weights; //The weighting used by the assessor selection algorhitm for each owner

  /*
  @type: modifier
  @name: onlyUserRegistry
  @purpose: to only allow the UserRegistry contract to call a function to which this modifier is applied
  */
  modifier onlyUserRegistry()
  {
    if(msg.sender != userRegistry) //checks if msg.sender has the same address as userRegistry
    {
      throw; //throws the function call if not
    }
    _;
  }

  /*
  @type: modifier
  @name: onlyConceptRegistry
  @purpose: to only allow the ConceptRegistry contract to call a function to which this modifier is applied
  */
  modifier onlyConceptRegistry()
  {
    if(msg.sender != conceptRegistry) //checks if msg.sender has the same address as conceptRegistry
    {
      throw; //throws the function call if not
    }
    _;
  }

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
  @name: CompletedAssessment
  @purpose: To build a database of completed assessments
  */
  event CompletedAssessment
  ( address _assessee, //The address of the user who took the assessment
    int _score, //The score of the assessee
    address _assessment); //The address of the assessment

  /*
  @type: constructor function
  @purpose: To initialize the Concept contract
  @param: string conceptName = the name of the conceptName
  @param: address[] parents = the addresses of the concept's parents
  @param: address userRegistryAddress = the address of the UserRegistry contract
  @param: address conceptRegistry = the address of the ConceptRegistry that spawned this user
  @returns: nothing
  */
  function Concept(address[] _parents, address _userRegistry, address _conceptRegistry)
  {
    parents = _parents; //sets the  parents array
    userRegistry = _userRegistry; //sets the userRegistry address
    conceptRegistry = _conceptRegistry; //sets the conceptRegistry address
  }

  /*
  @type: function
  @purpose: To get the number of owners of this concept
  @returns: The number of users that own this concept in the form of an uint
  */
  function getOwnerLength() constant returns(uint)
  {
    return owners.length;
  }

  /*
  @type: function
  @purpose: To get the number of parents for this concept
  @returns: The number of parents for this concept in the form of an uint
  */
  function getParentsLength() constant returns(uint)
  {
    return parents.length;
  }

  /*
  @type: function
  @purpose: To get the number of children of this concept
  @returns: The number of children of this concept in the form of an uint
  */
  function getChildrenLength() constant returns(uint)
  {
    return children.length;
  }

  /*
  @type: function
  @purpose: To set the first user for this concept
  @param: address firstUser = the address of the first user to own the concept
  @returns: nothing
  */
  function addUser(address user) onlyUserRegistry()
  {
    if(AbstractConceptRegistry(conceptRegistry).mew() == address(this))
    {
      owners.push(user); //If there aren't then firstUser is made to be an owner of this concept
    }
  }

  /*
  @type: function
  @purpose: To add a parent to the concept
  @param: address parentAddress = the address of the new parent concept
  @returns: nothing
  */
  function addParent(address _parent) onlyConceptRegistry()
  {
    parents.push(_parent);
  }

  /*
  @type: function
  @purpose: To add a child to the concept
  @param: address childAddress = the address of the new child concept
  @returns: nothing
  */
  function addChild(address _child) onlyConceptRegistry()
  {
    children.push(_child);
  }
  
  function getRandomMember(uint seed) returns(address)
  {
    address randomUser = owners[Math.getRandom(seed, owners.length-1)];
    if(AbstractUser(randomUser).availability() && weights[randomUser] > now % maxWeight)
     {
        return randomUser;
     }
    return address(0x0);
  }
  
  /*
  @type: function
  @purpose: To make a new assessment
  @param: uint time = the time that assessors will have to assess in this assessment
  @param: uint size = the size of the assessment
  @returns: nothing
  */
  function makeAssessment(uint cost, uint size) returns(bool)
  {
    if(size >= 5 && AbstractUserRegistry(userRegistry).balances(msg.sender) >= cost*size) //Checks if the assessment has a size of at least 5
    {
      Assessment newAssessment = new Assessment(msg.sender, userRegistry, conceptRegistry, size, cost); //Makes a new assessment with the given parameters
      assessmentExists[address(newAssessment)] = true; //Sets the assessment's existance to true
      setBalance(msg.sender, AbstractUserRegistry(userRegistry).balances(msg.sender) - cost*size);
      AbstractUser(msg.sender).notification(address(this), 19); //You have been charged for your assessment
      newAssessment.setAssessorPool(block.number, address(this), size*20); //Calls the function to set the assessor pool
      return true;
    }
    else
    {
      return false;
    }
  }

  /*
  @type: function
  @purpose: To finish the assessment process
  @param: int score = the assessee's score
  @param: address assessee = the address of the assessee
  @param: address assessment = the address of the assessment
  @returns: nothing
  */
  function finishAssessment(int score, address assessee, address assessment)
  {
    if(msg.sender == assessment) //Checks to make sure this function is being callled by the assessment
    {
      if(score > 0)
      {
        owners.push(assessee); //Makes the assessee an owner of this concept
        uint weight = Assessment(assessment).size()*uint(score);
        addOwner(assessee, weight);
        AbstractUser(assessee).setConceptPassed(true);
      }
      AbstractUser(assessee).mapHistory(assessment); //Maps the assessee to the assessment in the user master as part of the assessee's history
      currentScores[assessee] = score; //Maps the assessee to their score
      CompletedAssessment(assessee, score, assessment); //Makes an event with this assessment's data
    }
  }

  /*
  @type: function
  @purpose: To add an owner to a concept and recursively add an owner to parent concept, halving the added weight with each generation and chinging the macWeight for a concept if neccisairy
  @param: bool pass = whether or not the assessee passed the assessment
  @param: address assessee = the address of the assessee
  @param: uint weight = the weight for the owner
  @returns: nothing
  */
  function addOwner(address assessee, uint weight)
  {
    owners.push(assessee); //adds the owner to the array
    weights[assessee] += weight; //adds the weight to the current value in mapping
    if(weight > maxWeight) //checks if the weight is greater than the currant maxWeight
    {
      maxWeight = weight; //if so changes the maxWeight value
    }
    for(uint i = 0; i < parents.length; i++)
    {
      Concept(parents[i]).addOwner(assessee, weight/2); //recursively adds owner to all parent concepts but with half the weight
    }
  }

  /*
  @type: function
  @purpose: To pay/charge a user for an assessment
  @param: address user = the user to pay/charge
  @param: int amount = the user's new token balance
  */
  function setBalance(address user, uint amount)
  {
    if(assessmentExists[msg.sender] || msg.sender == address(this)) //Checks if msg.sender is an existing assessment
    {
      AbstractUserRegistry(userRegistry).setBalance(user, amount); //Changes the user's token balance
    }
  }

  /*
  @type: function
  @purpose: to remove this contract
  @param: address receiver = the address of the wallet that will receive of the ether
  @returns: nothing
  */
  function remove(address reciever) onlyThis()
  {
    suicide(reciever);
  }
}
