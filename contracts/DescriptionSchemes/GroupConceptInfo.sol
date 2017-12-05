pragma solidity ^0.4.17;

import "./ConceptInfo.sol";

contract GroupOwnedInfo is ConceptInfo {

    mapping (address => bool) public memberStatus;
    bytes32 public description;

    modifier memberOnly() {
        require(memberStatus[msg.sender]);
        _;
    }

    function getDescription(address _concept) public view returns(bytes32){
        return description;
    }

    function changeDescription(bytes32 _newDesc) public memberOnly() {
        description = _newDesc;
    }

    function toggleMember(address _member) public memberOnly() {
        require(msg.sender != _member);
        memberStatus[_member] = !memberStatus[_member];
    }

}

