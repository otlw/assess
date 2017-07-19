pragma solidity ^0.4.0;

import "./Math.sol";
import "./Concept.sol";
import "./ConceptRegistry.sol";
import "./UserRegistry.sol";

contract Assessment {
    address assessee;
    address[] assessors;
    mapping (address => State) assessorState;
    mapping(uint => int[]) clusters;
    State public assessmentStage;
    enum State {
        None,
        Called,
        Confirmed,
        Committed,
        Done,
        Burned
    }

    uint public assessorPoolLength;
    address concept;
    address userRegistry;
    address conceptRegistry;
    uint public endTime;
    uint public latestConfirmTime;
    uint burnRate;
    uint public size;
    uint cost;
    mapping(address => string[]) public data;
    mapping(address => bytes32) commits;
    mapping(address => uint) stake;
    uint public done; //counter how many assessors have committed/revealed their score
    mapping(address => int8) scores;
    mapping(int => bool) inRewardCluster;
    int public finalScore;
    event DataSet(address _dataSetter, uint _index);

    modifier onlyAssessorAssessee() {
        require(msg.sender == assessee || assessorState[msg.sender] != State.None);
        _;
    }

    modifier onlyConceptAssessment() {
        require(msg.sender == address(this) || msg.sender == concept);
        _;
    }

    modifier onlyConcept() {
        require(msg.sender == concept);
        _;
    }

    modifier onlyInStage(State _stage) {
        require(assessmentStage == _stage);
        _;
    }

    function Assessment(address _assessee,
                        address _userRegistry,
                        address _conceptRegistry,
                        uint _size,
                        uint _cost,
                        uint _confirmTime,
                        uint _timeLimit) {
        assessee = _assessee;
        concept = msg.sender;
        userRegistry = _userRegistry;
        conceptRegistry = _conceptRegistry;

        endTime = now + _timeLimit;
        latestConfirmTime = now + _confirmTime;
        assert(latestConfirmTime < endTime);

        size = _size;
        cost = _cost;

        UserRegistry(userRegistry).notification(assessee, 0); // assesse has started an assessment
        assessorPoolLength = 0;
        done = 0;
    }

    function cancelAssessment() onlyConceptAssessment() {
        Concept(concept).addBalance(assessee, cost*size);
        UserRegistry(userRegistry).notification(assessee, 3); //Assessment Cancled and you have been refunded
        for (uint i = 0; i < assessors.length; i++) {
            Concept(concept).addBalance(assessors[i], cost);
            UserRegistry(userRegistry).notification(assessors[i], 3); //Assessment Cancled and you have been refunded
        }
        suicide(conceptRegistry);
    }

    //@purpose: adds a user to the pool eligible to accept an assessment
    function addAssessorToPool(address assessor) onlyConcept() returns(bool) {
        if (assessorState[assessor] == State.None) {
            UserRegistry(userRegistry).notification(assessor, 1); //Called As A Potential Assessor
            assessorState[assessor] = State.Called;
            assessorPoolLength++;
            return true;
        }
        else {
            return false;
        }
    }

    /*
      @purpose: To recursively set the pool to draw assessors from in the assessment
      stops when the pool of potential assessors is 20 times the size of the assessment2
      @param: uint seed = the seed number for random number generation
      @param: address _concept = the concept being called from
      @param: uint num = the number of assessors to be called
    */
    function setAssessorPool(uint seed, address _concept, uint num) onlyConceptAssessment() {
        uint numCalled = 0;
        for (uint k=0; k < num; k++) {
            if (assessorPoolLength == size*20) { return; } //
            address randomUser = Concept(_concept).getRandomMember(seed + k);
            if (randomUser != address(0x0) && addAssessorToPool(randomUser)) {
                numCalled++;
            }
        }
        uint remaining = num - numCalled;
        if (remaining > 0) {
            for (uint i = 0; i < Concept(_concept).getParentsLength(); i++) {
                setAssessorPool(seed + assessorPoolLength, Concept(_concept).parents(i), remaining/Concept(_concept).getParentsLength() + 1); //Calls the remaining users from the parent concepts proportional to their size
            }
        }
        assessmentStage = State.Called;
    }

    /*
      @purpose: To set the pool of assessors when there are so few users in the system that
      assembling them at random is not meaningful. This will use all members of mew instead
    */
    function setAssessorPoolFromMew() onlyConcept() {
        Concept mew = Concept(ConceptRegistry(conceptRegistry).mewAddress()); //TODO: can this be more elegant and/or in one line?
        for (uint i=0; i<mew.getMemberLength(); i++) {
            addAssessorToPool(mew.members(i));
        }
        size = mew.getMemberLength();
        assessmentStage = State.Called;
    }

    //@purpose: called by an assessor to confirm and stake
    function confirmAssessor() onlyInStage(State.Called) {
        // cancel if the assessment is older than 12 hours or already past its timelimit
        if (now > latestConfirmTime){
            this.cancelAssessment();
            return;
        }
        if (assessorState[msg.sender] == State.Called &&
            assessors.length < size &&
            Concept(concept).subtractBalance(msg.sender, cost)
            ) {
            assessors.push(msg.sender);
            assessorState[msg.sender] = State.Confirmed;
            stake[msg.sender] = cost;
            UserRegistry(userRegistry).notification(msg.sender, 2); //Confirmed for assessing, stake has been taken
        }
        if (assessors.length == size) {
            notifyAssessors(uint(State.Confirmed), 4);
            UserRegistry(userRegistry).notification(assessee, 4);
            assessmentStage = State.Confirmed;
        }
    }

    function setData(string _data) onlyAssessorAssessee() {
        data[msg.sender].push(_data);
        DataSet(msg.sender, data[msg.sender].length - 1);
    }

    //@purpose: called by an assessor to commit a hash of their score //TODO explain in more detail what's happening
    function commit(bytes32 _hash) onlyInStage(State.Confirmed) {
        if (now > endTime) {
            burnStakes();
        }
        if (assessorState[msg.sender] == State.Confirmed) {
                commits[msg.sender] = _hash;
                assessorState[msg.sender] = State.Committed;
                done++; //Increases done by 1 to help progress to the next assessment stage.
        }
        if (done == size) {
            notifyAssessors(uint(State.Committed), 5);
            done = 0; //Resets the done counter
            assessmentStage = State.Committed;
        }
    }


    function steal(int8 _score, string _salt, address assessor) {
        if(assessorState[assessor] == State.Committed && msg.sender != assessor) {
            if(commits[assessor] == sha3(_score, _salt)) {
                Concept(concept).addBalance(msg.sender, stake[assessor]);
                stake[assessor] = 0;
                assessorState[assessor] = State.Burned;
                size--;
            }
        }
    }

    //@purpose: called by assessors to reveal their own commits or others
    function reveal(int8 _score, string _salt) onlyInStage(State.Committed) {
        if (now > endTime + 12 hours) { //add bigger zerocheck
            for (uint i = 0; i < assessors.length; i++) {
                if (assessorState[assessors[i]] == State.Committed) { //If the assessor has not revealed their score
                    stake[assessors[i]] = 0;
                    assessorState[assessors[i]] = State.Burned;
                    size--;
                }
            }
        }

        if(assessorState[msg.sender] == State.Committed &&
           commits[msg.sender] == sha3(_score, _salt)) {
                    scores[msg.sender] = _score;
                    assessorState[msg.sender] = State.Done;
                    done++;
        }

        if (done == size) {
            assessmentStage = State.Done;
            calculateResult();
        }
    }

    //@purpose: burns stakes as a function of how much time has passed since half of the assessors commited
    function burnStakes() internal {
        for (uint i = 0; i < assessors.length; i++) {
            if (assessorState[assessors[i]] == State.Confirmed) {
                stake[assessors[i]] = 0;
                assessorState[assessors[i]] = State.Burned;
                size--; //decrease size to help progress to the next assessment stage
           }
        }
    }

    function notifyAssessors(uint _state, uint _topic) private {
        for (uint i=0; i < assessors.length; i++) {
            if (uint(assessorState[assessors[i]]) == _state) {
                UserRegistry(userRegistry).notification(assessors[i], _topic);
            }
        }
    }

    function calculateResult() onlyInStage(State.Done) private {
        int[] memory finalScores = new int[] (done);
        uint idx =0;
        for (uint j = 0; j < assessors.length; j++) {
            if (assessorState[assessors[j]] == State.Done) {
                finalScores[idx] = scores[assessors[j]];
                idx++;
            }
        }
        uint finalClusterLength;
        bool[200] memory finalClusterMask;
        (finalClusterMask, finalClusterLength) = Math.getLargestCluster(finalScores);

        for (uint i=0; i<done; i++) {
            if (finalClusterMask[i]) {
                finalScore += finalScores[i];
            }
        }
        finalScore /= int(finalClusterLength);
        payout(finalClusterMask);
       if (finalScore > 0){
            Concept(concept).addMember(assessee, uint(finalScore) * finalClusterLength);
        }
       UserRegistry(userRegistry).notification(assessee, 7);
   }

    function payout(bool[200] finalClusterMask) onlyInStage(State.Done) internal {
        uint index=0;
        uint q = 1; //INFLATION
        for (uint i = 0; i < assessors.length; i++) {
            if (assessorState[assessors[i]] == State.Done) {
                uint payoutValue;
                int score = scores[assessors[i]];
                int scoreDistance = Math.abs(((score - finalScore)*100)/finalScore);

                if(finalClusterMask[index]) {
                    payoutValue = (q*cost*((100 - uint(scoreDistance))/100)) + stake[assessors[i]];
                }
                else {
                    payoutValue = stake[assessors[i]]*((200 - uint(scoreDistance))/200);
                }
                Concept(concept).addBalance(assessors[i], payoutValue);
                UserRegistry(userRegistry).notification(assessors[i], 6); //You  got paid!
                index++;
            }
        }
    }
}
