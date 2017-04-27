pragma solidity ^0.4.0;

contract AbstractUser
{
  
  function User(address _user, address _userRegistry, address _conceptRegistry)
  {
  }

  function setAvailability(bool _availability) 
  {
  }
  function availability() returns(bool)
  {
  }

  function mapHistory(address assessment) 
  {
  }

    function confirmAssessment(address assessment) 
  {
  }

    function setAssessmentData(address assessment, string data) 
  {
  }

  function commit(address assessment, bytes32 hash) 
  {
  }

    function reveal(address assessment, int8 score, bytes16 salt, address assessor) 
  {
  }

    function notification(address concept, uint code)
  {
  }

    function setUserData(string hash) 
  {
  }

  function transferTokens(address user, uint amount)  returns(bool)
  {
  }

  function extTransferTokens(address user, uint amount) returns(bool)
  {
  }

  function setConceptPassed(bool passed) 
  {
  }

  function extMakeAssessment(address concept, uint cost, uint size) returns(bool)
  {
    
  }
}
