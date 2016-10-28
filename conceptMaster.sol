import "lib/random.sol";
import "userMaster.sol";
import "concept.sol";
import "assessment.sol";
import "user.sol";

/*
@type: contract
@name: ConceptMaster
@purpose: To create concepts and store some concept data
*/
contract ConceptMaster
{
  mapping (address => bool) public conceptExists; //Maps concept addresses to a bool to confirm their existance
  mapping (address => string) public names; //Maps the concept address to its name
  mapping (string => address) addresses; //Maps the concept name to its address
  address userMasterAddress; //The address of the userMaster contract
  bool locked = false; //Keeps track of whether or not the function to set the userMasterAddress variable is locked yet or not
  address randomAddress; //The address of the random contract
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
  event ConceptCreation
  ( uint _response, //the error code of the procedure
    string _conceptName, //the name of the concept that was created
    address _conceptAddress, //the address of the concept that was created
    address[] _parents); //the addresses of the parents of the concept that as created

  /*
  @type: constructor function
  @purpose: To initialize the conceptMaster contract and have it make the random contract
  @returns: nothing
  */
  function ConceptMaster()
  {
  }


  function getAddress(string name) constant returns(address)
  {
    return addresses[name];
  }

  /*
  @type: function
  @purpose: To set the userMasterAddress
  @param: address userMaster = the address of the userMaster contract
  @returns: nothing
  */
  function init(address userMaster, address random, address mew)
  {
    if(locked == false) //Checks if the function has already been called
    {
      userMasterAddress = userMaster; //Sets the userMasterAddress to the value of userMaster
      randomAddress = random;
      mewAddress = mew;
      Concept(mewAddress).setMew(mewAddress);
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
  function makeConcept(string name, address[] parentList)
  {
    uint response = 0; //initializes the error code
    address[] memory parents = new address[] (parentList.length);
    for(uint i=0; i < parentList.length; i++) //iterates over the parentList
    {
      if(checkConcept(parentList[i])==false) //checks if the parents exist
      {
        response += (10**i); //modifies the error code to reflect any nonexistant parents
      }
      else
      {
        parents[i] = parentList[i]; //adds the parents that exist to the array in memory of parents
      }
    }
    if(response==0) //Checks if there were no errors so far
    {
      Concept newConcept = new Concept(name, parents, userMasterAddress, address(this), randomAddress); //Makes a new concept with the provided data
      newConcept.setMew(mewAddress);
      address newConceptAddress = address(newConcept); //initializes an address variable and sets it equal to the address of the newly created concept
      conceptExists[newConceptAddress] = true; //Maps the concept address to true to show that it exists
      names[newConceptAddress] = name;
      addresses[name] = newConceptAddress;
      if(parents.length == 0)
      {
        Concept(mewAddress).addChild(newConceptAddress);
      }
      for(uint j=0; j < parents.length; j++) //Iterates of the parents array in memory
      {
        Concept(parents[j]).addChild(newConceptAddress); //Adds the newly created concept to each of the parents as a child
      }
    }
    ConceptCreation(response, name, newConceptAddress, parents); //Makes ConceptCreation event with provided data
  }
}
