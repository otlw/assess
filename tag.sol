import "lib/random.sol";
import "userMaster.sol";
import "assessment.sol";
import "user.sol";
import "tagMaster.sol";

/*
@type: contract
@name: Tag
@purpose: To store tag data and create and store information about assessments of this tag
*/
contract Tag
{
  address[] parentTags; //The tags that this tag is child to (ie: Calculus is child to Math)
  address[] childTags; //The tags that this tag is parent to (ie: Math is parent to Calculus)
  address userMaster; //The address of the userMaster contract
  address tagMaster; //The address of the tagMaster contract
  address random; //The address of the random contract
  string name; //The name of the tag
  int maxScore = 0; //The highest score acheived for this tag
  uint maxSize = 5; //The largest assessment taken for this tag
  address[] owners; //Those who have earned the tag
  address mew;
  mapping (address => address[]) assessmentHistory; //All assessments completed
  mapping (address => int) currentScores; //The most recent score of a user
  mapping (address => uint) assessmentSizes; //The most recent size of an assessment taken by a user
  mapping(address => bool) assessmentExists; //All existing assessments

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
    _
  }

  /*
  @type: modifier
  @name: onlyTagMaster
  @purpose: to only allow the TagMaster contract to call a function to which this modifier is applied
  */
  modifier onlyTagMaster()
  {
    if(msg.sender != tagMaster) //checks if msg.sender has the same address as tagMaster
    {
      throw; //throws the function call if not
    }
    _
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
    _
  }

  /*
  @type: event
  @name: CompletedAssessment
  @purpose: To build a database of completed assessments
  */
  event CompletedAssessment
  ( address _assessee, //The address of the user who took the assessment
    bool _pass, //Whether or not the assessee passed the assessment
    int _score, //The score of the assessee
    address _assessment); //The address of the assessment

  /*
  @type: constructor function
  @purpose: To initialize the Tag contract
  @param: string tagName = the name of the tagName
  @param: address[] parents = the addresses of the tag's parents
  @param: address userMasterAddress = the address of the UserMaster contract
  @param: address tagMasterAddress = the address of the TagMaster that spawned this user
  @param: address randomAddress = the address of the ransom contract
  @returns: nothing
  */
  function Tag(string tagName, address[] parents, address userMasterAddress, address tagMasterAddress, address randomAddress)
  {
    name = tagName; //sets to value of name to that of tagName
    parentTags = parents; //sets the value of parentTags to that of parents
    userMaster = userMasterAddress; //sets the value of userMaster to that of userMasterAddress
    random = randomAddress; //sets the value of random to that of randomAddress
    tagMaster = tagMasterAddress; //sets the vale of tagMaster to that of tagMasterAddress
  }

  /*
  @type: function
  @purpose: To set the first user for this tag
  @param: address firstUser = the address of the first user to own the tag
  @returns: nothing
  */
  function addUser(address user) onlyUserMaster()
  {
    if(address(this) == mew)
    {
      owners.push(user); //If there aren't then firstUser is made to be an owner of this tag
    }
  }

  function setMew(address mewAddress) onlyTagMaster()
  {
    mew = mewAddress;
  }

  /*
  @type: function
  @purpose: To get the most recent score of a user
  @param: address user = the user whose score is to be checked
  @returns: The user's most recent score in the form of an int
  */
  function getCurrentScore(address user) constant returns(int)
  {
    return currentScores[user];
  }

  /*
  @type: function
  @purpose: To get the size of the most recent asssessment of a user
  @param: address user = the user whose assessment size is to be checked
  @returns: The user's most recent assessment size in the form of an uint
  */
  function getAssessmentSize(address user) constant returns(uint)
  {
    return assessmentSizes[user];
  }

  /*
  @type: function
  @purpose: To get the owners of this tag
  @returns: The users that own this tag in the form of an array of addresses
  */
  function getOwners() constant returns(address[])
  {
    return owners;
  }

  /*
  @type: function
  @purpose: To get the number of owners of this tag
  @returns: The number of users that own this tag in the form of an uint
  */
  function getOwnerLength() constant returns(uint)
  {
    return owners.length;
  }

  /*
  @type: function
  @purpose: To get a specific owner of this tag
  @param: uint index = the index of the user in the owners array
  @returns: The user that owns this tag with that index in the form of an address
  */
  function getOwner(uint index) constant returns(address)
  {
    return owners[index];
  }

  /*
  @type: function
  @purpose: To get the parents of this tag
  @returns: The parents of this tag in the form of an array of addresses
  */
  function getParents() constant returns(address[])
  {
    return parentTags;
  }

  /*
  @type: function
  @purpose: To get the number of parents for this tag
  @returns: The number of parents for this tag in the form of an uint
  */
  function getParentsLength() constant returns(uint)
  {
    return parentTags.length;
  }

  /*
  @type: function
  @purpose: To get a specific parent of this tag
  @param: uint index = the index of the tag in the parentTags array
  @returns: The tag that is parent to this tag with that index in the form of an address
  */
  function getParent(uint index) constant returns(address)
  {
    return parentTags[index];
  }

  /*
  @type: function
  @purpose: To add a parent to the tag
  @param: address parentAddress = the address of the new parent tag
  @returns: nothing
  */
  function addParent(address parentAddress) onlyTagMaster()
  {
    parentTags.push(parentAddress);
  }

  /*
  @type: function
  @purpose: To get the children of this tag
  @returns: The children of this tag in the form of an array of addresses
  */
  function getChildren() constant returns(address[])
  {
    return childTags;
  }

  /*
  @type: function
  @purpose: To get the number of children of this tag
  @returns: The number of children of this tag in the form of an uint
  */
  function getChildrenLength() constant returns(uint)
  {
    return childTags.length;
  }

  /*
  @type: function
  @purpose: To get a specific child of this tag
  @param: uint index = the index of the tag in the childTags array
  @returns: The tag that is child to this tag with that index in the form of an address
  */
  function getChild(uint index) constant returns(address)
  {
    return childTags[index];
  }

  /*
  @type: function
  @purpose: To add a child to the tag
  @param: address childAddress = the address of the new child tag
  @returns: nothing
  */
  function addChild(address childAddress) onlyTagMaster()
  {
    childTags.push(childAddress);
  }

  /*
  @type: function
  @purpose: To get the name of this tag
  @returns: The name of the tag in the form of a string
  */
  function getName() returns(string)
  {
    return name;
  }

  /*
  @type: function
  @purpose: To recursively set the pool to draw assessors from in the assessment
  @param: address tagAddress = the tag that assessors are currently being drawn from
  @param: address assessment = the address of the assessment that assessors are being drawn for
  @param: uint seed = the seed number for random number generation
  @param: uint size = the desired size of the assessment
  @returns: nothing
  */
  function setAssessorPool(address tagAddress, address assessment, uint seed, uint size) onlyThis()
  {
    if(Tag(mew).getOwnerLength() < Assessment(assessment).getAssessmentPoolSize()) //Checks if the requested pool size is greater than the number of users in the system
    {
      for(uint i = 0; i < Tag(mew).getOwnerLength(); i++) //If so, all users in the system are added to the pool
      {
        Assessment(assessment).addToAssessorPool(Tag(mew).getOwner(i));
      }
      Assessment(assessment).setAssessmentPoolSize(0); //Sets the remaining amount of user's desired in the pool to 0
      Assessment(assessment).setPotentialAssessor(size); //Has the assessment select random potential assessors (the amount is dictated by the size variable)
    }
    for(uint j = 0; j < Tag(tagAddress).getOwnerLength() && Assessment(assessment).getAssessmentPoolSize() > 0; j++) //Iterates through all the owners of the tag corresponding to tag address while the remaining amount of user's desired in the pool is greater than 0
    {
      uint numberSet = 0; //initializes a variable to keep track of how many assessors this tag has added to the pool
      if(numberSet < Tag(tagAddress).getOwnerLength()/10) //Checks if the number of assessors provided by this tag is less than 10% of the owners of the tag
      {
        address randomUser = Tag(tagAddress).getOwner(Random(random).getRandom(seed + j, Tag(tagAddress).getOwnerLength()-1)); //gets a random owner of the tag
        if(UserMaster(userMaster).getAvailability(randomUser) == true && (uint(Tag(tagAddress).getCurrentScore(randomUser))*Tag(tagAddress).getAssessmentSize(randomUser)) > (now%(uint(maxScore)*maxSize))) //Checks if the randomly drawn is available and then puts it through a random check that it has a higher chance of passing if it has had a higher score and a larger assessment
        {
          Assessment(assessment).addToAssessorPool(randomUser); //adds the randomly selected user to the assessor pool
          Assessment(assessment).setAssessmentPoolSize(Assessment(assessment).getAssessmentPoolSize() -1); //reduces desired amount of users to be added to the assessor bool by 1
          numberSet++; //increases numberSet by 1
        }
      }
      else
      {
        break; //exits this for loop if 10% or more of the tag owners are in the assessment pool
      }
    }
    if(Assessment(assessment).getAssessmentPoolSize() <= 0) //Checks if the number of desired users remaining for the assessment pool is no greater than 0
    {
      Assessment(assessment).setPotentialAssessor(size); //If so, the assessment selects random potential assessors (the amount is dictated by the size variable)
    }
    else //If not
    {
      for(uint l = 0; l < Tag(tagAddress).getParentsLength() || l < Tag(tagAddress).getChildrenLength(); l++) //Recursively calls this function in such a way that the parent and child tags' owners will be used to potentially populate the assessment pool
      {
        if(l < Tag(tagAddress).getParentsLength()) //Makes sure there are still parent tags left to call
        {
          setAssessorPool(Tag(tagAddress).getParent(l), assessment, Random(random).getRandom(seed + l, Tag(tagAddress).getOwnerLength()-1), size);
        }
        if(l < Tag(tagAddress).getChildrenLength()) //Makes sure there are still child tags left to call
        {
          setAssessorPool(Tag(tagAddress).getChild(l), assessment, Random(random).getRandom(seed + l, Tag(tagAddress).getOwnerLength()-1), size);
        }
      }
    }
  }

  /*
  @type: function
  @purpose: To make a new assessment
  @param: address assessee = the address of the assessee
  @param: uint time = the time that assessors will have to assess in this assessment
  @param: uint size = the size of the assessment
  @returns: nothing
  */
  function makeAssessment(address assessee, uint time, uint size)
  {
    if(size >= 5) //Checks if the assessment has a size of at least 5
    {
      Assessment newAssessment = new Assessment(assessee, address(this), userMaster, tagMaster, random, time); //Makes a new assessment with the given parameters
      assessmentExists[address(newAssessment)] = true; //Sets the assessment's existance to true
      newAssessment.setNumberOfAssessors(size); //Sets the number of assessors wanted in the assessment to equal size
      newAssessment.setAssessmentPoolSize(size*20); //Sets the number of users wanted to form the assessor pool to 20 times size
    }
    else
    {
      throw; //Throws out the function call if the size of the assessment is less than 5
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
    if(block.number - Assessment(assessment).getReferenceBlock() >= 4 && block.number - Assessment(assessment).getReferenceBlock() <= 6) //Checks if this function is being called 4 to 6 blocks after the block in which the assessment was created
    {
      setAssessorPool(address(this), assessment, Assessment(assessment).getNumberOfAssessors(), Assessment(assessment).getNumberOfAssessors()); //Calls thge function to set the assessor pool
    }
    else
    {
      Assessment(assessment).cancelAssessment(); //If this function is called too early or too late the assessment is cancelled
    }
  }

  /*
  @type: function
  @purpose: To finish the assessment process
  @param: bool pass = whether or not the assessee passed the assessment
  @param: int score = the assessee's score
  @param: address assessee = the address of the assessee
  @param: address assessment = the address of the assessment
  @returns: nothing
  */
  function finishAssessment(bool pass, int score, address assessee, address assessment)
  {
    if(msg.sender == assessment) //Checks to make sure this function is being callled by the assessment
    {
      if(pass == true) //If the assessee passed
      {
        owners.push(assessee); //Makes the assessee an owner of this tag
      }
      UserMaster(userMaster).mapHistory(assessee,assessment); //Maps the assessee to the assessment in the user master as part of the assessee's history
      assessmentHistory[assessee].push(assessment); //Adds the assessment to the assessment history array
      currentScores[assessee] = score; //Maps the assessee to their score
      assessmentSizes[assessee] = Assessment(assessment).getNumberOfAssessors(); //Maps the assessee to the assessment size
      if(score > maxScore)
      {
        maxScore = score; //If this assessment's score is higher that the current highest score than the maxScore variable is updated with this score
      }
      if(Assessment(assessment).getNumberOfAssessors() > maxSize)
      {
        maxSize = Assessment(assessment).getNumberOfAssessors(); //If this assessment's size is larger that the current largest assessment size than the maxSize variable is updated with this size
      }
      CompletedAssessment(assessee, pass, score, assessment); //Makes an event with this assessment's data
    }
  }

  /*
  @type: function
  @purpose: To pay/charge a user for an assessment
  @param: address user = the user to pay/charge
  @param: int amount = the user's new token balance
  */
  function pay(address user, int amount)
  {
    if(assessmentExists[msg.sender] = true) //Checks if msg.sender is an existing assessment
    {
      UserMaster(userMaster).mapTokenBalance(user, amount); //Changes the user's token balance
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
