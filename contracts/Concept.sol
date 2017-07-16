pragma solidity ^0.4.0;

import "./UserRegistry.sol";
import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./Math.sol";

//@purpose: To store concept data and create and manage assessments and members
contract Concept {
    address[] public parents; //The concepts that this concept is child to (ie: Calculus is child to Math)
    bytes data;
    address userRegistry;
    address conceptRegistry;
    uint public maxWeight;
    uint public lifetime;
    mapping (address => bool) public assessmentExists;
    mapping (address => mapping (address => uint)) public approval;
    mapping (address => address) recentAssessment;
    mapping (address => ComponentWeight[]) weights;
    mapping (address => mapping(address => uint)) componentWeightIndex;
    address[] public members;
    mapping (address => bool) hasWeight;

    struct ComponentWeight {
        uint weight;
        uint date;
    }

    modifier onlyUserRegistry() {
        require(msg.sender == userRegistry);
        _;
    }

    modifier onlyConceptRegistry() {
        require(msg.sender == conceptRegistry);
        _;
    }

    modifier onlyConcept() {
        require(ConceptRegistry(conceptRegistry).conceptExists(msg.sender));
        _;
    }

    /*
      @type: event
      @name: CompletedAssessment
      @purpose: To build a database of completed assessments
    */
    event CompletedAssessment (
                               address _assessee,
                               int _score,
                               address _assessment
                               );

    function Concept(address[] _parents, uint _lifetime, bytes _data) {
        parents = _parents;
        data = _data;
        conceptRegistry = msg.sender;
        lifetime = _lifetime;
        userRegistry = ConceptRegistry(conceptRegistry).userRegistry();
    }

    function getMemberLength() constant returns(uint) {
        return members.length;
    }

    function getParentsLength() constant returns(uint) {
        return parents.length;
    }

    /*
      @purpose: To add the firstUser to Mew
    */
    function addInitialMember(address _user, uint _weight) {
        if (ConceptRegistry(conceptRegistry).distributorAddress() == msg.sender)
            {
                this.addWeight(_user, _weight);
            }
    }

    function addParent(address _parent) onlyConceptRegistry() {
        parents.push(_parent);
    }

    //@purpose: returns a random member of the Concept. Users with high weights are more likely to be called
    function getRandomMember(uint seed) returns(address) {
        uint index = Math.getRandom(seed, members.length - 1);
        address randomMember = members[index];
        uint weight = getWeight(randomMember);
        if (weight > 0) {
            if ( weight > now % maxWeight &&
                 UserRegistry(userRegistry).availability(randomMember)) {
                return randomMember;
            }
            else {
                return address(0x0);
            }
        }
        else {
            //remove from list
            hasWeight[randomMember] = false;
            members[index] = members[members.length - 1];
            members.length = members.length - 1;
            return getRandomMember(seed*2);
        }
    }

    function getWeight(address _assessee) returns(uint){
        uint weight = 0;
        for (uint i=0; i<weights[_assessee].length; i++){
            if (weights[_assessee][i].date + lifetime > now){
                uint timefactor = (weights[_assessee][i].weight * 100 years) / lifetime;
                weight += (weights[_assessee][i].weight * 100 years - timefactor * (now - weights[_assessee][i].date));
            }
        }
        return weight / 100 years;
    }

    /*
      @purpose: To make a new assessment
      @param: uint cost = the cost per assessor
      @param: uint size = the number of assessors
    */
    function makeAssessment(uint cost, uint size, uint _waitTime, uint _timeLimit) returns(bool) {
        if (size >= 5 && this.subtractBalance(msg.sender, cost*size)) {
            Assessment newAssessment = new Assessment(msg.sender, userRegistry, conceptRegistry, size, cost, _waitTime, _timeLimit);
            assessmentExists[address(newAssessment)] = true;
            if (Concept(ConceptRegistry(conceptRegistry).mewAddress()).getMemberLength()<size*20) {
                newAssessment.setAssessorPoolFromMew(); // simply use all members of mew (Bootstrap phase)
            }
            else{
                newAssessment.setAssessorPool(block.number, address(this), size*20); //assemble the assessorPool by relevance
            }

            return true;
        }
        else {
            return false;
        }
    }

    /*
      @purpose: To approve addresses to create assessments for users on this concept
      @param: _from = the address approved to create assessments
      @param: _amount = the maximum value of Tokens they are allowed to spend
    */
    function approve(address _from, uint _amount) returns(bool) {
        approval[msg.sender][_from] = _amount;
        return true;
    }

    //@purpose: allow approved address to create assessments for users on this concept
    function makeAssessmentFrom(address _assessee, uint _cost, uint _size, uint _waitTime, uint _timeLimit) returns(bool) {
        if (approval[_assessee][msg.sender] >= _cost * _size &&
           _size >= 5 &&
           this.subtractBalance(_assessee, _cost*_size)) {
            Assessment newAssessment = new Assessment(_assessee, userRegistry, conceptRegistry, _size, _cost, _waitTime, _timeLimit);
            assessmentExists[address(newAssessment)] = true;
            newAssessment.setAssessorPool(block.number, address(this), _size*20);
            approval[_assessee][msg.sender] -= _cost*_size;
            return true;
        }
        else {
            return false;
        }
    }

    /*
      @purpose: To add a member to a concept and to recursively add  a member to parent concept, thereby halving the added weight with each generation and changing the maxWeight of each concept if necessary
      @param: address assessee = the address of the assessee
      @param: uint weight = the weight for the member
      @returns: nothing
    */
    function addMember(address _assessee, uint _weight) {
        if (assessmentExists[msg.sender]) {
            recentAssessment[_assessee] = msg.sender;
            this.addWeight(_assessee, _weight);
        }
    }
    function addWeight(address _assessee, uint _weight) onlyConcept() {
        if (!hasWeight[_assessee]) {
            members.push(_assessee);
            hasWeight[_assessee] = true;
        }

        uint idx = componentWeightIndex[_assessee][msg.sender];
        if (idx > 0) {
            weights[_assessee][idx-1] = ComponentWeight(_weight, now);
        } else {
            weights[_assessee].push(ComponentWeight(_weight, now));
            componentWeightIndex[_assessee][msg.sender] = weights[_assessee].length;
        }

        if (_weight > maxWeight) {
            maxWeight = _weight;
        }

        if(_weight/2 > 0) {
            for(uint i = 0; i < parents.length; i++) {
                Concept(parents[i]).addWeight(_assessee, _weight/2);
            }
        }
    }

    function subtractBalance(address _from, uint _amount) returns(bool) {
        if (assessmentExists[msg.sender] || msg.sender == address(this)) {
            return UserRegistry(userRegistry).subtractBalance(_from, _amount);
        }
        return false;
    }
    
    function addBalance(address _to, uint _amount)  returns(bool) {
        if (assessmentExists[msg.sender]) {
            return UserRegistry(userRegistry).addBalance(_to, _amount);
        }
    }
}
