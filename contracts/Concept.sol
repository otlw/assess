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
        uint index;
        mapping(address => uint) approval;
        ComponentWeight[] weights;
        mapping(address => uint) componentWeightIndex;
    }

    struct ComponentWeight {
        uint weight;
        uint date;
    }

    modifier onlyConcept() {
        require(ConceptRegistry(conceptRegistry).conceptExists(msg.sender));
        _;
    }

    event setAssessorIndex (address member, uint index);

    function Concept(address[] _parents, uint[] _propagationRates, uint _lifetime, bytes _data) {
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

    /*
      @purpose: add the caller of this function to the arrays of potential assessors
      if they still have a weight in the concept
      @returns true if they are available as assessor
    */
    function setAvailability() returns(bool success){
        if (getWeight(msg.sender) > 0) {
            if (memberData[msg.sender].index == 0) {
                members.push(msg.sender);
                memberData[msg.sender].index = members.length;
                success = true;
            }
            else {
                removeMember(msg.sender);
            }
        }
   }

    /*
      //@purpose: returns a random member of the Concept or the zero address (both with approx. 50%)
      //Users with high weights are more likely to be called
      //@returns the address of the member (0x0 if there is no member)
    */
    function getWeightedRandomMember(uint seed) returns(address){
        uint weight1;
        uint weight2;
        address randomMember1;
        while (members.length > 1 && weight1 == 0) {
            uint index1 = Math.getRandom(seed, members.length - 1);
            randomMember1 = members[index1];
            weight1 = getWeight(randomMember1);
        }
        while (members.length > 1 && weight2 == 0) {
                uint index2 = Math.getRandom(seed * 2, members.length - 1);
                address randomMember2 = members[index2];
                weight2 = getWeight(randomMember2);
        }
        if (weight1 > weight2) {
            return randomMember1;
        }
    }

    /*
      @purpose: get the weight of a given member, also removes that member from the array
      if there legitimating assessment is expired
    */
    function getWeight(address _member) returns(uint weight){
        for (uint i=0; i < memberData[_member].weights.length; i++) {
            if (memberData[_member].weights[i].date > now){
                weight += memberData[_member].weights[i].weight;
            }
        }
        if (weight == 0) {
            removeMember(_member);
        }
    }
    /*
      @purpose: removes member at a given index from the members array by substituting they with
      the last member and then decreasing the size of the members array
      @returns the updated number of members in the concept
    */
    function removeMember(address _member) internal returns(uint){
        uint index = memberData[_member].index;
        if (index > 0){
            members[index] = members[members.length - 1]; //THIS NEEDS TO BE TESTED!
            memberData[_member].index = 0;
            members.length--;
        }
        return members.length;
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
            newAssessment.setAssessorPool(block.number, address(this), size*5); //assemble the assessorPool by relevance
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
            newAssessment.setAssessorPool(block.number, address(this), _size*20); //assemble the assessorPool by relevance
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
            memberData[_assessee].index = 0;
            this.addWeight(_assessee, _weight);
        }
    }
    function addWeight(address _assessee, uint _weight) onlyConcept() {
        if (memberData[_assessee].index == 0) {
            members.push(_assessee);
            memberData[_assessee].index = members.length;
        }

        uint idx = memberData[_assessee].componentWeightIndex[msg.sender];
        if (idx > 0) {
            memberData[_assessee].weights[idx-1] = ComponentWeight(_weight, now + lifetime);
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
