pragma solidity ^0.4.11;

import "./ConceptInfo.sol";

// Registry contract for concepts whose description shall be changeable by a group of trusted members
// each of these members will have the right to rename the concept and add/remove members from the group
// a history of all descriptions is maintained
contract GroupOwnedInfoRegistry is ConceptInfo {
    mapping (address => bytes32) public descriptions;
    mapping (address => GroupInfo) public groups;

    struct GroupInfo {
        bool initialized;
        mapping (address => bool) memberStatus;
        Log[] history;
    }

    struct Log {
        bytes32 desc;
        uint replaced;
    }

    function getDescription(address _concept) public view returns(bytes32){
        return descriptions[_concept];
    }

    function registerGroup(address _concept, address[] _members) public {
        require(!groups[_concept].initialized);
        for (uint i; i< _members.length; i++){
            groups[_concept].memberStatus[_members[i]] = true;
        }
        groups[_concept].initialized = true;
    }

    function toggleMember(address _concept, address _member) public {
        require(msg.sender != _member);
        require(groups[_concept].memberStatus[msg.sender] == true);
        groups[_concept].memberStatus[_member] = !groups[_concept].memberStatus[_member];
    }

    function changeDescription(address _concept, bytes32 _newDesc) public {
        require(groups[_concept].memberStatus[msg.sender] == true);
        groups[_concept].history.push( Log({desc: descriptions[_concept], replaced: now}) );
        descriptions[_concept] = _newDesc;
    }
}
