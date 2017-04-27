pragma solidity ^0.4.0;

contract AbstractConcept
{

  address[] public parents;

  function Concept(address[] _parents, address _userRegistry, address _conceptRegistry)
  {

  }


  function getOwnerLength() constant returns(uint)
  {
  }


  function getParentsLength() constant returns(uint)
  {

  }


  function getChildrenLength() constant returns(uint)
  {

  }


  function addUser(address user) 
  {
  }


  function addParent(address _parent) 
  {

  }

  function addChild(address _child) 
  {

  }
  
  function getRandomMember(uint seed) returns(address)
  {
   
  }
  
  
  function makeAssessment(uint cost, uint size) returns(bool)
  {

  }

  function finishAssessment(int score, address assessee, address assessment)
  {
    
  }

  function addOwner(address assessee, uint weight)
  {
    
  }


  function setBalance(address user, uint amount)
  {
    
  }

  function remove(address reciever) 
  {
    suicide(reciever);
  }
}
