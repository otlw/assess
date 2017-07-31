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
    address public conceptRegistry;
    uint public maxWeight;
    uint public lifetime;
    mapping (address => bool) public assessmentExists;

    uint[] propagationRates;

    address[] public members;
    mapping (address => MemberData) memberData;

    struct MemberData {
        address recentAssessment;
        bool isMember;
        mapping(address => uint) approval;
        ComponentWeight[] weights;
        mapping(address => uint) componentWeightIndex;
    }

    struct ComponentWeight {
        uint weight;
        uint date;
    } 

    modifier onlyConceptRegistry() {
        require(msg.sender == conceptRegistry);
        _;
    }

    modifier onlyConcept() {
        require(ConceptRegistry(conceptRegistry).conceptExists(msg.sender));
        _;
    }

    event setAssessorIndex (address member, uint index);

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

    function setAvailability(uint _index) {
        if(members[_index] == msg.sender) {
            memberData[msg.sender].isMember = false;
            setAssessorIndex(members[members.length -1], _index);
            members[_index] = members[members.length - 1];
            members.length = members.length - 1;
        }

        else {
            if(getWeight(msg.sender) > 0 && !memberData[msg.sender].isMember){
                members.push(msg.sender);
                memberData[msg.sender].isMember = true;
            }
        }
    }

    //@purpose: returns a random member of the Concept.
    //Users with high weights are more likely to be called
    //@returns the address of the member (0x0 if there is no member)
    function getRandomWinner(uint seed) returns(address winner) {
        uint weight1;
        (weight1, winner) = getRandomMemberWeight(seed);
        if (winner == address(0x0)){
            return winner;
        }
        address randomMember2;
        uint weight2;
        (weight2, randomMember2) = getRandomMemberWeight(seed*3);
        if (randomMember2 == address(0x0) || weight1 >= weight2) {
            return winner;
        } else {
            return address(0x0);
        }
    }

    /*
      @purpose: function to lookup the weight of the member at the listindex,
      which will also remove looked up members from the list if these are no longer
      eligible for being an assessor because the expiration date has passed
      @returns a random members weight and address, (0 and 0x0 if there are no members)
    */
    function getRandomMemberWeight(uint seed) returns(uint weight, address memberAddress){
        uint index = Math.getRandom(seed, members.length - 1);
        memberAddress = members[index];
        while (weight == 0) {
            weight = getWeight(memberAddress);
            if (weight > 0) {
                return (weight, memberAddress);
            } else {
                //remove from member list
                memberData[memberAddress].isMember = false;
                setAssessorIndex(members[members.length -1], index);
                members[index] = members[members.length - 1]; //THIS NEEDS TO BE TESTED!
                /* members.length = members.length - 1; */
                //if there still is a member left
                if (--members.length > 0) {
                    // try another index
                    index = Math.getRandom(seed*2, members.length - 1);
                    memberAddress = members[index];
                } else {
                    //otherwise return zeroAddress
                    return (0, address(0x0));
                }
            }
        }
    }

    function getWeight(address _assessee) returns(uint){
        uint weight = 0;

        for (uint i=0; i < memberData[_assessee].weights.length; i++) {
            if (memberData[_assessee].weights[i].date > now){
                weight += memberData[_assessee].weights[i].weight;
            }
        }
        return weight;
    }

    /*
      @purpose: To make a new assessment
      @param: uint cost = the cost per assessor
      @param: uint size = the number of assessors
    */
    function makeAssessment(uint cost, uint size, uint _waitTime, uint _timeLimit) returns(bool) {
        if (size >= 5 && this.subtractBalance(msg.sender, cost*size)) {
            Assessment newAssessment = new Assessment(msg.sender, size, cost, _waitTime, _timeLimit);
            assessmentExists[address(newAssessment)] = true;
            if (Concept(ConceptRegistry(conceptRegistry).mewAddress()).getMemberLength()<size*5) { //changed from 20 to 5
                newAssessment.setAssessorPoolFromMew(); // simply use all members of mew (Bootstrap phase)
            }
            else{//changed from 20 to 5
                newAssessment.setAssessorPool(block.number, address(this), size*5); //assemble the assessorPool by relevance
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
            Assessment newAssessment = new Assessment(_assessee, _size, _cost, _waitTime, _timeLimit);
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
            memberData[_assessee].isMember = true;
            this.addWeight(_assessee, _weight);
        }
    }
    function addWeight(address _assessee, uint _weight) onlyConcept() {
        if (!memberData[_assessee].isMember) {
            members.push(_assessee);
            memberData[_assessee].isMember = true;
        }

        uint idx = memberData[_assessee].componentWeightIndex[msg.sender];
        if (idx > 0) {
            memberData[_assessee].weights[idx-1] = ComponentWeight(_weight, now + lifetime); //shoudl be now +lifetime
        } else {
            memberData[_assessee].weights.push(ComponentWeight(_weight, now + lifetime));
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
