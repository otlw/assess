pragma solidity ^0.4.11;

import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./FathomToken.sol";

contract Minter {
    bool initialized;
    uint public reward;

    uint public epochTime;
    uint public epochHash;
    uint public epochLength;

    FathomToken public fathomToken;
    ConceptRegistry public conceptRegistry;

    address public winner;
    uint public closestDistance = 2**256 - 1;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event NewOwner(address oldOwner, address newOwner);
    event NewReward(uint oldReward, uint newReward);
    event NewEpochLength(uint oldLength, uint newLength);
    event TokensMinted(address recipient, uint amount);

    function Minter(address _conceptRegistry, uint _epochLength, uint _reward) public {
        conceptRegistry = ConceptRegistry(_conceptRegistry);
        epochLength = _epochLength;
        epochTime = now;
        epochHash = uint(block.blockhash(block.number - 1));
        reward = _reward;
        owner = msg.sender;
    }

    function init(address _fathomToken) public {
        if (!initialized) {
            fathomToken = FathomToken(_fathomToken);
            initialized = true;
        }
    }

    function submitBid (address _assessor, address _assessment, uint _tokenSalt) public {
        Assessment assessment = Assessment(_assessment);
        require(conceptRegistry.conceptExists(assessment.concept()) &&
                Concept(assessment.concept()).assessmentExists(_assessment) &&
                assessment.endTime() < epochTime + epochLength &&
                uint(assessment.assessmentStage()) == 4 &&
                uint(assessment.assessorState(_assessor)) == 4 &&
                _tokenSalt <= assessment.cost());

        uint distance = getTicketDistance(_assessor, assessment, _tokenSalt, assessment.salt());
        if( distance < closestDistance ){
            closestDistance = distance;
            winner = _assessor;
        }
    }

    function getTicketDistance(address _assessor, address _assessment, uint _tokenSalt, bytes32 _assessmentSalt) public  returns(uint distance) {
        uint hash = uint(keccak256(_assessor, assessment, _tokenSalt, assessmentSalt));
        distance = epochHash > hash ? epochHash - hash : hash - epochHash;
    }

    function endEpoch() public {
        if(now > (epochTime + epochLength)){
            if(fathomToken.mint(winner, reward)){
                epochTime = now;
                epochHash = uint(block.blockhash(block.number -1));
                closestDistance = 2**256 -1;
            }
        }
    }

    function setOwner(address _owner) public onlyOwner() {
        owner = _owner;
    }

    function setReward(uint _reward) public onlyOwner() {
        reward = _reward;
    }

    function setEpochLength (uint _length) public onlyOwner() {
        epochLength = _length;
    }
}
