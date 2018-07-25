pragma solidity ^0.4.23;

import "./FathomToken.sol";
import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./Math.sol";
import "./ConceptData.sol";

//@purpose: To store concept data and create and manage assessments and members
contract Concept is ConceptData {
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyConcept() {
      require(conceptRegistry.conceptExists(msg.sender));
      _;
    }

    function transferOwnership(address _newOwner) onlyOwner() public {
        owner = _newOwner;
    }

    function changeLifetime(uint _newLifetime) onlyOwner() public {
        lifetime = _newLifetime;
    }

    function getAvailableMemberLength() public constant returns(uint) {
        return availableMembers.length;
    }

    function getParentsLength() public view returns(uint) {
        return parents.length;
    }

    /*
      @purpose: To add the firstUser to Mew
    */
    function addInitialMember(address _user, uint _weight) public {
        if (conceptRegistry.distributorAddress() == msg.sender)
            {
                this.addWeight(_user, _weight);
                availableMembers.push(_user);
                memberData[_user].index = availableMembers.length;
            }
    }

    /*
      @purpose: add the caller of this function to the arrays of potential assessors
      if they still have a weight in the concept
      @returns true if they are available as assessor
    */
    function toggleAvailability() public returns(bool success){
        if (getWeightAndUpdate(msg.sender) > 0) {
            if (memberData[msg.sender].index == 0) {
                availableMembers.push(msg.sender);
                memberData[msg.sender].index = availableMembers.length;
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
    function getWeightedRandomMember(uint seed) public returns(address){
        uint weight1;
        uint weight2;
        address randomMember1;
        while (availableMembers.length > 1 && weight1 == 0) {
            uint index1 = Math.getRandom(seed, availableMembers.length - 1);
            randomMember1 = availableMembers[index1];
            weight1 = getWeightAndUpdate(randomMember1);
            seed++;
        }
        while (availableMembers.length > 1 && weight2 == 0) {
                uint index2 = Math.getRandom(seed * 2, availableMembers.length - 1);
                address randomMember2 = availableMembers[index2];
                weight2 = getWeightAndUpdate(randomMember2);
                seed += 10;
        }
        if (weight1 > weight2) {
            return randomMember1;
        }
    }

    /*
      @purpose: get the weight of a given member, also removes that member from the array
      if there legitimating assessment is expired
    */
    function getWeight(address _member) view public returns(uint weight){
        for (uint i=0; i < memberData[_member].weights.length; i++) {
            if (memberData[_member].weights[i].date > now){
                weight += memberData[_member].weights[i].weight;
            }
        }
    }

    //@purpose: check weight and update availableMembers array
    function getWeightAndUpdate(address _member) public returns(uint weight) {
        weight = getWeight(_member);
        if (weight == 0) {
            removeMember(_member);
        }
    }

    /*
      @purpose: removes member at a given index from the availableMembers array by substituting they with
      the last member and then decreasing the size of the availableMembers array
      @returns the updated number of availableMembers in the concept
    */
    function removeMember(address _member) private returns(uint){
        uint index = memberData[_member].index;
        if (index > 0){
            availableMembers[index] = availableMembers[availableMembers.length - 1]; //THIS NEEDS TO BE TESTED!
            memberData[_member].index = 0;
            availableMembers.length--;
        }
        return availableMembers.length;
    }

    /*
      @purpose: To make a new assessment
      NOTE: While there are less than 200 members in network, all members of mew will
      be called as assessors for any concept
      @param: uint cost = the cost per assessor
      @param: uint size = the number of assessors
    */
    event fb(address x); //TODO remove those
    event fbConcept(address concept);
    function makeAssessment(uint cost, uint size, uint _waitTime, uint _timeLimit) public returns(bool) {
      require(size >= 5 && fathomToken.balanceOf(msg.sender)>= cost*size);

      Assessment newAssessment = conceptRegistry.proxyFactory().createAssessment(msg.sender, size, cost, _waitTime, _timeLimit);
      assessmentExists[address(newAssessment)] = true;
      fathomToken.takeBalance(msg.sender, address(newAssessment), cost*size, address(this));

      // get membernumber of mew to see whether there are more than 200 users in the system:
      address mewAddress = conceptRegistry.mewAddress();
      uint nMemberInMew = Concept(mewAddress).getAvailableMemberLength();
      if (nMemberInMew < size * 5) {
        newAssessment.callAllFromMew(nMemberInMew, mewAddress);
      } else {
        newAssessment.setAssessorPool(uint(blockhash(block.number)), address(this), size*5);
      }
      return true;
    }

    /*
      @purpose: To add a member to a concept and to recursively add  a member to parent concept
      @param: address assessee = the address of the assessee
      @param: uint weight = the weight for the member
      @returns: nothing
    */
    function addMember(address _assessee, uint _weight) public {
        if (assessmentExists[msg.sender]) {
            memberData[_assessee].recentAssessment = msg.sender;
            this.addWeight(_assessee, _weight);
        }
    }

    function addWeight(address _assessee, uint _weight) public onlyConcept() {
        uint idx = memberData[_assessee].componentWeightIndex[msg.sender];
        if (idx > 0) {
            memberData[_assessee].weights[idx-1] = ComponentWeight(_weight, now + lifetime);
        } else {
            memberData[_assessee].weights.push(ComponentWeight(_weight, now + lifetime));
            memberData[_assessee].componentWeightIndex[msg.sender] = memberData[_assessee].weights.length;
        }

        for(uint i = 0; i < parents.length; i++) {
            if((_weight*propagationRates[i])/1000 > 0) {
                Concept(parents[i]).addWeight(_assessee, (_weight*propagationRates[i])/1000);
            }
        }
    }
}
