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
    address[] public members;
    mapping (address => bool) public assessmentExists;
    mapping (address => Member) public membersData;
    mapping (address => mapping (address => uint)) public approval;

    struct Member {
        Score[] assessments;
        uint weight;
    }

    struct Score {
        uint score;
        uint time;
    }

    modifier onlyUserRegistry() {
        if (msg.sender != userRegistry)
            {
                throw;
            }
        _;
    }

    modifier onlyConceptRegistry() {
        if (msg.sender != conceptRegistry) {
            throw;
        }
        _;
    }

    modifier onlyConcept() {
        if (!ConceptRegistry(conceptRegistry).conceptExists(msg.sender)) {
            throw;
        }
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

    function Concept(address[] _parents, bytes _data) {
        parents = _parents;
        data = _data;
        conceptRegistry = msg.sender;
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
                this.addMember(_user, _weight);
            }
    }

    function addParent(address _parent) onlyConceptRegistry() {
        parents.push(_parent);
    }

    //@purpose: returns a random member of the Concept. Users with high weights are more likely to be called
    function getRandomMember(uint seed) returns(address) {
        address randomUser = members[Math.getRandom(seed, members.length-1)];
        if (UserRegistry(userRegistry).availability(randomUser) && membersData[randomUser].weight > now % maxWeight) {
            return randomUser;
        }
        return address(0x0);
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
      @purpose: To finish the assessment process
      @param: int score = the assessee's score
      @param: address assessee = the address of the assessee
      @param: address assessment = the address of the assessment
      @returns: nothing
    */
    function finishAssessment(int _score, address _assessee) {
        if (assessmentExists[msg.sender]) {
            uint baseWeight = Assessment(msg.sender).size()*uint(_score);
            if (_score > 0) {
                this.addMember(_assessee, baseWeight);
            }
            UserRegistry(userRegistry).notification(_assessee, 7); //Assessment on Concept finished
        }
    }
    /*
      @purpose: To add a member to a concept and recursively add a member to parent concept, halving the added weight with each generation and chinging the macWeight for a concept if neccisairy
      @param: address assessee = the address of the assessee
      @param: uint weight = the weight for the member
      @returns: nothing
    */
    function addMember(address _assessee, uint _baseWeight) onlyConcept() {
        membersData[_assessee].assessments.push(Score(_baseWeight, now));
        members.push(_assessee);

        calculateWeight(_assessee);

        if (_baseWeight/2 > 0) {
            for(uint i = 0; i < parents.length; i++) {
                Concept(parents[i]).addMember(_assessee, _baseWeight/2); //recursively adds member to all parent concepts but with half the weight
            }
        }
    }

    function calculateWeight(address _assessee) private {
        uint newWeight;
        for(uint i = 0; i < membersData[_assessee].assessments.length; i++) {
            newWeight += membersData[_assessee].assessments[i].score * (now - membersData[_assessee].assessments[i].time + 1);
        }

        if (newWeight > maxWeight) {
            maxWeight = newWeight;
        }

        membersData[_assessee].weight = newWeight;
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
