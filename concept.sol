import "lib/math.sol";
import "userMaster.sol";
import "assessment.sol";
import "user.sol";
import "conceptMaster.sol";

/*
@type: contract
@name: Concept
@purpose: To store concept data and create and store information about assessments of this concept
*/
contract Concept
{
  address[] public parentConcepts; //The concepts that this concept is child to (ie: Calculus is child to Math)
  address[] public childConcepts; //The concepts that this concept is parent to (ie: Math is parent to Calculus)
  address userMaster; //The address of the userMaster contract
  address conceptMaster; //The address of the conceptMaster contract
  address math; //The address of the math contract
  string public name; //The name of the concept
  int public maxScore = 0; //The highest score acheived for this concept
  uint public maxSize = 5; //The largest assessment taken for this concept
  address[] public owners; //Those who have earned the concept
  address mew;
  mapping (address => address[]) public assessmentHistory; //All assessments completed
  mapping (address => int) public currentScores; //The most recent score of a user
  mapping (address => uint) public assessmentSizes; //The most recent size of an assessment taken by a user
  mapping(address => bool) public assessmentExists; //All existing assessments

  /*
  @type: modifier
  @name: onlyUserMaster
  @purpose: to only allow the UserMaster contract to call a function to which this modifier is applied
  */
  modifier onlyUserMaster()
  {
    if(msg.sender != userMaster) //checks if msg.sender has the same address as userMaster
    {
      throw; //throws the function call if not
    }
    _;
  }

  /*
  @type: modifier
  @name: onlyConceptMaster
  @purpose: to only allow the ConceptMaster contract to call a function to which this modifier is applied
  */
  modifier onlyConceptMaster()
  {
    if(msg.sender != conceptMaster) //checks if msg.sender has the same address as conceptMaster
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
  @param: address userMasterAddress = the address of the UserMaster contract
  @param: address conceptMasterAddress = the address of the ConceptMaster that spawned this user
  @param: address mathAddress = the address of the ransom contract
  @returns: nothing
  */
  function Concept(address[] parents, address userMasterAddress, address conceptMasterAddress, address mathAddress)
  {
    parentConcepts = parents; //sets the value of parentConcepts to that of parents
    userMaster = userMasterAddress; //sets the value of userMaster to that of userMasterAddress
    math = mathAddress; //sets the value of math to that of mathAddress
    conceptMaster = conceptMasterAddress; //sets the vale of conceptMaster to that of conceptMasterAddress
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
    return parentConcepts.length;
  }

  /*
  @type: function
  @purpose: To get the number of children of this concept
  @returns: The number of children of this concept in the form of an uint
  */
  function getChildrenLength() constant returns(uint)
  {
    return childConcepts.length;
  }

  /*
  @type: function
  @purpose: To set the first user for this concept
  @param: address firstUser = the address of the first user to own the concept
  @returns: nothing
  */
  function addUser(address user) onlyUserMaster()
  {
    if(address(this) == mew)
    {
      owners.push(user); //If there aren't then firstUser is made to be an owner of this concept
    }
  }

  function setMew(address mewAddress) onlyConceptMaster()
  {
    mew = mewAddress;
    if(parentConcepts.length == 0)
    {
      parentConcepts.push(mew);
    }
  }

  /*
  @type: function
  @purpose: To add a parent to the concept
  @param: address parentAddress = the address of the new parent concept
  @returns: nothing
  */
  function addParent(address parentAddress) onlyConceptMaster()
  {
    parentConcepts.push(parentAddress);
  }

  /*
  @type: function
  @purpose: To add a child to the concept
  @param: address childAddress = the address of the new child concept
  @returns: nothing
  */
  function addChild(address childAddress) onlyConceptMaster()
  {
    childConcepts.push(childAddress);
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
    if(size >= 5 && UserMaster(userMaster).getBalance(msg.sender) >= cost*size) //Checks if the assessment has a size of at least 5
    {
      Assessment newAssessment = new Assessment(msg.sender, userMaster, conceptMaster, math, size, cost); //Makes a new assessment with the given parameters
      assessmentExists[address(newAssessment)] = true; //Sets the assessment's existance to true
      setBalance(msg.sender, UserMaster(userMaster).getBalance(msg.sender) - cost*size);
      User(msg.sender).notification(address(this), 19); //You have been charged for your assessment
      return true;
    }
    else
    {
      return false;
    }
  }

  /*
  @type: function
  @purpose: To start the assessment process
  @param: address assessment = the address of the assessment
  @returns: nothing
  */
  function startAssessment(address assessment)
  {
    if(block.number - Assessment(assessment).startTime() <= 10) //Checks if this function is being called 4 to 6 blocks after the block in which the assessment was created
    {
      Assessment(assessment).setAssessorPool(address(this), block.number); //Calls thge function to set the assessor pool
    }
    else
    {
      Assessment(assessment).cancelAssessment(); //If this function is called too early or too late the assessment is cancelled
    }
  }

  /*
  @type: function
  @purpose: To finish the assessment processc
  @param: bool pass = whether or not the assessee passed the assessment
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
        User(assessee).setConceptPassed(true);
      }
      UserMaster(userMaster).mapHistory(assessee,assessment); //Maps the assessee to the assessment in the user master as part of the assessee's history
      assessmentHistory[assessee].push(assessment); //Adds the assessment to the assessment history array
      currentScores[assessee] = score; //Maps the assessee to their score
      assessmentSizes[assessee] = Assessment(assessment).size(); //Maps the assessee to the assessment size
      if(score > maxScore)
      {
        maxScore = score; //If this assessment's score is higher that the current highest score than the maxScore variable is updated with this score
      }
      if(Assessment(assessment).size() > maxSize)
      {
        maxSize = Assessment(assessment).size(); //If this assessment's size is larger that the current largest assessment size than the maxSize variable is updated with this size
      }
      CompletedAssessment(assessee, score, assessment); //Makes an event with this assessment's data
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
    if(assessmentExists[msg.sender] = true) //Checks if msg.sender is an existing assessment
    {
      UserMaster(userMaster).mapBalance(user, amount); //Changes the user's token balance
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
