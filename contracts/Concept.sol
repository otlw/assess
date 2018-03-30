pragma solidity ^0.4.11;

import "./FathomToken.sol";
import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./Math.sol";

//@purpose: To store concept data and create and manage assessments and members
contract Concept {
    address[] public parents; //The concepts that this concept is child to (ie: Calculus is child to Math)
    bytes public data;
    address public owner;
    FathomToken public fathomToken;
    ConceptRegistry public conceptRegistry;
    uint public lifetime;

    mapping (address => bool) public assessmentExists;
    mapping (address => uint) public conceptRel;


    modifier onlyConcept() {
        require(conceptRegistry.conceptExists(msg.sender));
        _;
    }

    function Concept(address[] _parents, uint[] _propagationRates, uint _lifetime, bytes _data, address _owner) public {
        require(_parents.length == _propagationRates.length);
        conceptRegistry = ConceptRegistry(msg.sender);

        for (uint j=0; j < _parents.length; j++) {
            require(conceptRegistry.conceptExists(_parents[j]));
            require(_propagationRates[j] < 1000 && _propagationRates[j] > 0);
            conceptRel[_parents[j]] = _propagationRates[j];
            Concept(_parents[j]).setChildRel();
        }

        parents = _parents;
        data = _data;
        lifetime = _lifetime;
        owner = _owner;
        fathomToken = FathomToken(conceptRegistry.fathomToken());
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    function setChildRel() public {
      require(conceptRegistry.conceptExists(msg.sender));
      conceptRel[msg.sender] = 1000;
    }

    function transferOwnership(address _newOwner) onlyOwner() public {
        owner = _newOwner;
    }

    function changeLifetime(uint _newLifetime) onlyOwner() public {
        lifetime = _newLifetime;
    }

    function getParentsLength() public view returns(uint) {
        return parents.length;
    }

    /*
      @purpose: To make a new assessment
      NOTE: While there are less than 200 members in network, all members of mew will
      be called as assessors for any concept
      @param: uint cost = the cost per assessor
      @param: uint size = the number of assessors
    */
    function makeAssessment(uint cost, uint size, uint _waitTime, uint _timeLimit) public returns(bool) {
        if (size >= 5 && fathomToken.balanceOf(msg.sender)>= cost*size) {
            Assessment newAssessment = new Assessment(msg.sender, size, cost, _waitTime, _timeLimit);
            assessmentExists[address(newAssessment)] = true;
            fathomToken.takeBalance(msg.sender, address(newAssessment), cost*size, address(this));

            // get membernumber of mew to see whether there are more than 200 users in the system:
            return true;
        }
    }
}
