import "userRegistry.sol";
import "assessment.sol";
import "user.sol";
import "math.sol";

/*
@type: contract
@name: Concept
@purpose: To store concept data and create and store information about assessments of this concept
*/
contract Concept
{
  address[] public parentConcepts; //The concepts that this concept is child to (ie: Calculus is child to Math)
  address[] public childConcepts; //The concepts that this concept is parent to (ie: Math is parent to Calculus)
  address userRegistryAddress; //The address of the userRegistry contract
  address conceptRegistryAddress; //The address of the conceptRegistry contract
  uint public maxWeight; //The current highest weight for this assessment
  address[] public owners; //Those who have earned the concept
  address math = 0x90B66E80448eb60938FAed4A738dE0D5b630B2Fd;
  address mew;
  mapping (address => int) public currentScores; //The most recent score of a user
  mapping (address => uint) public assessmentSizes; //The most recent size of an assessment taken by a user
  mapping (address => bool) public assessmentExists; //All existing assessments
  mapping (address => uint) public weights; //The weighting used by the assessor selection algorhitm for each owner

  /*
  @type: modifier
  @name: onlyUserRegistry
  @purpose: to only allow the UserRegistry contract to call a function to which this modifier is applied
  */
  modifier onlyUserRegistry()
  {
    if(msg.sender != userRegistryAddress) //checks if msg.sender has the same address as userRegistry
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
    if(msg.sender != conceptRegistryAddress) //checks if msg.sender has the same address as conceptRegistry
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
  @param: address conceptRegistryAddress = the address of the ConceptRegistry that spawned this user
  @returns: nothing
  */
  function Concept(address[] parents, address _userRegistryAddress, address _conceptRegistryAddress)
  {
    parentConcepts = parents; //sets the value of parentConcepts to that of parents
    userRegistryAddress = _userRegistryAddress; //sets the value of userRegistry to that of userRegistryAddress
    conceptRegistryAddress = _conceptRegistryAddress; //sets the vale of conceptRegistry to that of conceptRegistryAddress
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
  function addUser(address user) onlyUserRegistry()
  {
    if(mew == address(0x0))
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
  function addParent(address parentAddress) onlyConceptRegistry()
  {
    parentConcepts.push(parentAddress);
  }

  /*
  @type: function
  @purpose: To add a child to the concept
  @param: address childAddress = the address of the new child concept
  @returns: nothing
  */
  function addChild(address childAddress) onlyConceptRegistry()
  {
    childConcepts.push(childAddress);
  }

  function getAssessors(uint num, uint seed, address assessment) //TODO: This needs to be only able to be called by other concepts or assessments
  {
    if(num > owners.length)
    {
      for(uint i=0; i<parentConcepts.length; i++)
      {
        Concept(parentConcepts[i]).getAssessors(num/parentConcepts.length, seed, assessment);
      }
    }
    else
    {
      uint j = 0;
      while(j < num)
      {

        address randomUser = owners[Math(math).getRandom(seed + j, owners.length-1)]; //gets a random owner of the concept
        if(User(randomUser).availability() == true && weights[randomUser] > now%(maxWeight)) //Checks if the randomly drawn is available and then puts it through a random check that it has a higher chance of passing if it has had a higher score and a larger assessment
        {
          Assessment(assessment).addAssessorToPool(randomUser);
        }
        j++;
      }
    }
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
    if(size >= 5 && UserRegistry(userRegistryAddress).getBalance(msg.sender) >= cost*size) //Checks if the assessment has a size of at least 5
    {
      Assessment newAssessment = new Assessment(msg.sender, userRegistryAddress, conceptRegistryAddress, size, cost); //Makes a new assessment with the given parameters
      assessmentExists[address(newAssessment)] = true; //Sets the assessment's existance to true
      setBalance(msg.sender, UserRegistry(userRegistryAddress).getBalance(msg.sender) - cost*size);
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
        User(assessee).setConceptPassed(true);
      }
      User(assessee).mapHistory(assessment); //Maps the assessee to the assessment in the user master as part of the assessee's history
      currentScores[assessee] = score; //Maps the assessee to their score
      assessmentSizes[assessee] = Assessment(assessment).size(); //Maps the assessee to the assessment size
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
    for(uint i = 0; i < parentConcepts.length; i++)
    {
      Concept(parentConcepts[i]).addOwner(assessee, weight/2); //recursively adds owner to all parent concepts but with half the weight
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
      UserRegistry(userRegistryAddress).mapBalance(user, amount); //Changes the user's token balance
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
