pragma solidity ^0.4.17;

import "./ConceptInfo.sol"

//NOTE THIS IS A DRAFT, not sure whether the voting is secure!

// Registry-contract for concepts whose descriptions shall be changeable by any X persons
// of a set of trusted owners, adding and removing members to that the set of trusted owners
// requires X votes as well
contract GroupOwnedInfoWithVoting is ConceptInfo {

    mapping (address => bool) memberStatus;
    bytes32 public description;
    uint votesNeeded;

    struct Proposal {
        bytes32 newDesc;
        address member;
        uint voteCount;
        mapping (address => bool) voted;
    }

    // stores all proposals
    Proposal[] public proposals;

    modifier memberOnly() {
        require(memberStatus[msg.sender]);
        _;
    }

    function GroupOwnedInfoWithVoting(address[] _members, uint minApproval) public {
        for (uint i; i< _members.length; i++){
            memberStatus[_members[i]] = true;
            votesNeeded = minApproval;
        }
    }

    // add a new proposal; either a new description XOR a new member
    function addProposal(bytes32 _desc, address _member) memberOnly() public {
        require((members != address(0x0) && desc == 0x0) || (members == address(0x0) && desc != 0x0));
        proposals.push({member: _member, newDesc: _desc});

    }

    // vote for a proposal, realizes it if enough votes, clears storage
    function voteFor(uint propIndex) public memberOnly() {
        require(propIndex < proposals.length);
        Proposal p = proposals[propIndex];
        require(p.voted[msg.sender] == false);
        p.voteCount++;
        p.voted[msg.sender] = true;
        if (p.voteCount++ >= votesNeeded) {
            realizeProposal(propIndex);
            // reset storage to zero
            delete proposals[n];
        }
    }

    function realizeProposal(uint propIndex) private {
        if (proposals[propIndex].member != address(0x0)){
            toggleMember(proposals[propIndex].member);
        }
        else {
            changeDescription(proposals[propIndex].newDesc);
        }
    }

    function changeDescription(bytes32 _newDesc) private {
        description = _newDesc;
    }

    function toggleMember(address _member) private {
        require(msg.sender != _member);
        memberStatus[_member] = !memberStatus[_member];
    }

}
