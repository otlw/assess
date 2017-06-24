pragma solidity ^0.4.0;

import "./UserRegistry.sol";
import "./User.sol";
import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./Math.sol";

//@purpose: To store concept data and create and manage assessments and members
contract Concept {
  address[] public parents; //The concepts that this concept is child to (ie: Calculus is child to Math)
  address[] public children; //The concepts that this concept is parent to (ie: Math is parent to Calculus)
  address userRegistry;
  address conceptRegistry;
  uint public maxWeight; //The current highest weight for this assessment
  address[] public owners; //Those who have earned the concept
  mapping (address => int) public currentScores; //The most recent score of a user
  mapping (address => bool) public assessmentExists; //mapping valid assessments to a bool for permissioning
  mapping (address => uint) public weights; //The weight of a given user calculated by their score and number of assessors.

  modifier onlyUserRegistry() {
    if(msg.sender != userRegistry)
    {
      throw;
    }
    _;
  }

  modifier onlyConceptRegistry() {
    if(msg.sender != conceptRegistry) {
      throw;
    }
    _;
  }

  modifier onlyThis() {
    if(msg.sender != address(this)) {
      throw;
    }
    _;
  }

  //@purpose: To build a database of completed assessments
  event CompletedAssessment (
    address _assessee, //The address of the user who took the assessment
    int _score, //The score of the assessee
    address _assessment
  );

  function Concept(address[] _parents, address _userRegistry) {
    parents = _parents;
    userRegistry = _userRegistry;
    conceptRegistry = UserRegistry(userRegistry).conceptRegistry();
  }

  function getOwnerLength() constant returns(uint) {
    return owners.length;
  }

  function getParentsLength() constant returns(uint) {
    return parents.length;
  }

  function getChildrenLength() constant returns(uint) {
    return children.length;
  }

  /*
  @purpose: To add the firstUser to Mew
  */
  function addUser(address firstUser) onlyUserRegistry() {
    if(ConceptRegistry(conceptRegistry).mewAddress() == address(this))
    {
      owners.push(firstUser);
    }
  }

  function addParent(address _parent) onlyConceptRegistry() {
    parents.push(_parent);
  }

  function addChild(address _child) onlyConceptRegistry() {
    children.push(_child);
  }

  //@purpose: returns a random member of the Concept. Users with high weights are more likely to be called
  function getRandomMember(uint seed) returns(address) {
    address randomUser = owners[Math.getRandom(seed, owners.length-1)];
    if(User(randomUser).availability() && weights[randomUser] > now % maxWeight) {
        return randomUser;
     }
    return address(0x0);
  }

  /*
  @purpose: To make a new assessment
  @param: uint cost = the cost per assessor
  @param: uint size = the number of assessors
  */
  function makeAssessment(uint cost, uint size) returns(bool) {
    if(size >= 5 && subtractBalance(msg.sender, cost*size)) { //Checks if the assessment has a size of at least 5 and tries to subtract the neccesary tokens from the user
      Assessment newAssessment = new Assessment(msg.sender, userRegistry, conceptRegistry, size, cost);
      assessmentExists[address(newAssessment)] = true; //Sets the assessment's existance to true
      User(msg.sender).notification(address(this), 0); //You have been charged for your assessment
      newAssessment.setAssessorPool(block.number, address(this), size*20); //Calls the function to set the assessor pool
      return true;
    }
    else {
      return false;
    }
  }

  /*
  @purpose: To finish the assessment process
  @param: int score = the assessee's score
  @param: address assessee = the address of the assessee
  @param: address assessment = the address of the assessment
  @returns: nothing
  */
  function finishAssessment(int score, address assessee, address assessment) {
    if(msg.sender == assessment) {
      if(score > 0) {
        owners.push(assessee); //Makes the assessee an owner of this concept
        uint weight = Assessment(assessment).size()*uint(score);
        addOwner(assessee, weight);
        User(assessee).setConceptPassed(true);
      }
      currentScores[assessee] = score; //Maps the assessee to their score
      CompletedAssessment(assessee, score, assessment); //Makes an event with this assessment's data
    }
  }

  /*
  @purpose: To add an owner to a concept and recursively add an owner to parent concept, halving the added weight with each generation and chinging the macWeight for a concept if neccisairy
  @param: bool pass = whether or not the assessee passed the assessment
  @param: address assessee = the address of the assessee
  @param: uint weight = the weight for the owner
  @returns: nothing
  */
  function addOwner(address assessee, uint weight) onlyThis() {
    owners.push(assessee); //adds the owner to the array
    weights[assessee] += weight; //adds the weight to the current value in mapping
    if(weight > maxWeight) {//checks if the weight is greater than the currant maxWeight
      maxWeight = weight; //if so changes the maxWeight value
    }
    for(uint i = 0; i < parents.length; i++) {
      Concept(parents[i]).addOwner(assessee, weight/2); //recursively adds owner to all parent concepts but with half the weight
    }
  }

  function subtractBalance(address _from, uint _amount) returns(bool) {
    if(assessmentExists[msg.sender] || msg.sender == address(this)) { //Checks if msg.sender is an existing assessment or the concept
      return UserRegistry(userRegistry).subtractBalance(_from, _amount);
    }
  }

  function addBalance(address _to, uint _amount)  returns(bool) {
    if(assessmentExists[msg.sender]) { //Checks if msg.sender is an existing assessment
      return UserRegistry(userRegistry).addBalance(_to, _amount);
    }
  }

  function remove(address reciever) onlyThis() {
    suicide(reciever);
  }
}
