pragma solidity ^0.4.11;

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

    uint[] propagationRates;

    address[] public members;
    mapping (address => MemberData) memberData;

    struct MemberData {
        address recentAssessment;
        bool hasWeight;
        mapping(address => uint) approval;
        ComponentWeight[] weights;
        mapping(address => uint) componentWeightIndex;
    }

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

    function Concept(address[] _parents, uint[] _propagationRates, uint _lifetime, bytes _data) {
        for(uint i = 0; i < _propagationRates.length; i++) {
            require(_propagationRates[i] <= 1000);
        }
        propagationRates = _propagationRates;
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
            memberData[randomMember].hasWeight = false;
            members[index] = members[members.length - 1];
            members.length = members.length - 1;
            return getRandomMember(seed*2);
        }
    }

    function getWeight(address _assessee) returns(uint){
        uint weight = 0;
        for (uint i=0; i < memberData[_assessee].weights.length; i++){
            if (memberData[_assessee].weights[i].date + lifetime > now){
                uint timefactor = (memberData[_assessee].weights[i].weight * 100 years) / lifetime;
                weight += (memberData[_assessee].weights[i].weight * 100 years - timefactor * (now - memberData[_assessee].weights[i].date));
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
        memberData[msg.sender].approval[_from] = _amount;
        return true;
    }

    //@purpose: allow approved address to create assessments for users on this concept
    function makeAssessmentFrom(address _assessee, uint _cost, uint _size, uint _waitTime, uint _timeLimit) returns(bool) {
        if (memberData[_assessee].approval[msg.sender] >= _cost * _size &&
           _size >= 5 &&
           this.subtractBalance(_assessee, _cost*_size)) {
            Assessment newAssessment = new Assessment(_assessee, userRegistry, conceptRegistry, _size, _cost, _waitTime, _timeLimit);
            assessmentExists[address(newAssessment)] = true;

            if (Concept(ConceptRegistry(conceptRegistry).mewAddress()).getMemberLength()<_size*20) {
                newAssessment.setAssessorPoolFromMew(); // simply use all members of mew (Bootstrap phase)
            }
            else {
                newAssessment.setAssessorPool(block.number, address(this), _size*20); //assemble the assessorPool by relevance
            }
            memberData[_assessee].approval[msg.sender] -= _cost*_size;
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
            memberData[_assessee].recentAssessment = msg.sender;
            memberData[_assessee].hasWeight = true;
            this.addWeight(_assessee, _weight);
        }
    }
    function addWeight(address _assessee, uint _weight) onlyConcept() {
        if (!memberData[_assessee].hasWeight) {
            members.push(_assessee);
            memberData[_assessee].hasWeight = true;
        }

        uint idx = memberData[_assessee].componentWeightIndex[msg.sender];
        if (idx > 0) {
            memberData[_assessee].weights[idx-1] = ComponentWeight(_weight, now);
        } else {
            memberData[_assessee].weights.push(ComponentWeight(_weight, now));
            memberData[_assessee].componentWeightIndex[msg.sender] = memberData[_assessee].weights.length;
        }

        if (_weight > maxWeight) {
            maxWeight = _weight;
        }

        for(uint i = 0; i < parents.length; i++) {
            if((_weight*propagationRates[i])/1000 > 0) {
                Concept(parents[i]).addWeight(_assessee, (_weight*propagationRates[i])/1000);
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
