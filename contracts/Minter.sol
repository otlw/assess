pragma solidity 0.4.18;

import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./FathomToken.sol";


contract Minter {


    bool public initialized;
    uint public reward;

    uint public epochStart;
    uint public epochHash;
    uint public epochLength;

    FathomToken public fathomToken;
    ConceptRegistry public conceptRegistry;

    address public winner;
    uint public closestDistance = 2**256 - 1;

    address public owner;

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
        epochStart = now;
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
    /*
      function to be called by an assessor to submit a ticket to the lottery if
      the assessor has revealed their score in an assessment whose commit-phase
      will end before the end of the epoch.
      @param _assessor: address of the assessor
      @param _assessment: address of the assessment
      @param _tokenSalt: a number smaller or equal to amount of tokens the assessor staked in the assessment
    */

    function submitBid (address _assessor, address _assessment, uint _tokenSalt) public {
        Assessment assessment = Assessment(_assessment);
        require(conceptRegistry.conceptExists(assessment.concept()) &&
                Concept(assessment.concept()).assessmentExists(_assessment) &&
                assessment.endTime() < epochStart + epochLength &&
                uint(assessment.assessorState(_assessor)) == 4 &&
                _tokenSalt <= assessment.cost());

        uint distance = getTicketDistance(_assessor, assessment, _tokenSalt, assessment.salt());
        if (distance < closestDistance) {
            closestDistance = distance;
            winner = _assessor;
        }
    }

    function getTicketDistance(
        address _assessor,
        address _assessment,
        uint _tokenSalt,
        bytes32 _assessmentSalt
    )
        public view returns(uint distance)
    {
        uint hash = uint(keccak256(_assessor, _assessment, _tokenSalt, _assessmentSalt));
        distance = epochHash > hash ? epochHash - hash : hash - epochHash;
    }

    function endEpoch() public {
        if (now > (epochStart + epochLength)) {
            if (fathomToken.mint(winner, reward)) {
                TokensMinted(winner, reward);
                epochStart = epochStart + epochLength;
                epochHash = uint(block.blockhash(block.number - 1));
                closestDistance = 2**256-1;
                winner = address(0x0);
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
