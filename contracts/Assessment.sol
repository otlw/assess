pragma solidity ^0.4.11;

import "./Math.sol";
import "./Concept.sol";
import "./UserRegistry.sol";

contract Assessment {
    address assessee;
    address[] assessors;

    mapping (address => State) assessorState;
    State public assessmentStage;
    enum State {
        None,
        Called,
        Confirmed,
        Committed,
        Done,
        Burned
    }

    address concept;
    address userRegistry;

    uint public endTime;
    uint public latestConfirmTime;

    uint public size;
    uint cost;

    mapping(address => bytes32) commits;
    uint public done; //counter how many assessors have committed/revealed their score
    mapping(address => int128) scores;
    int public finalScore;

    modifier onlyConcept() {
        require(msg.sender == concept);
        _;
    }

    modifier onlyInStage(State _stage) {
        require(assessmentStage == _stage);
        _;
    }

    function Assessment(address _assessee,
                        uint _size,
                        uint _cost,
                        uint _confirmTime,
                        uint _timeLimit) {
        assessee = _assessee;
        concept = msg.sender;
        userRegistry = Concept(concept).userRegistry();

        endTime = now + _timeLimit;
        latestConfirmTime = now + _confirmTime;
        assert(latestConfirmTime < endTime);

        size = _size;
        cost = _cost;

        UserRegistry(userRegistry).notification(assessee, 0); // assesse has started an assessment
        done = 0;
    }

    function cancelAssessment() internal {
        UserRegistry(userRegistry).addBalance(assessee, cost*size, concept);
        UserRegistry(userRegistry).notification(assessee, 3); //Assessment Cancled and you have been refunded
        for (uint i = 0; i < assessors.length; i++) {
            UserRegistry(userRegistry).addBalance(assessors[i], cost, concept);
            UserRegistry(userRegistry).notification(assessors[i], 3); //Assessment Cancled and you have been refunded
        }
        suicide(concept);
    }

    //@purpose: adds a user to the pool eligible to accept an assessment
    function addAssessorToPool(address assessor) onlyConcept() returns(bool) {
        if (assessorState[assessor] == State.None) {
            UserRegistry(userRegistry).notification(assessor, 1); //Called As A Potential Assessor
            assessorState[assessor] = State.Called;
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
      @param: uint num = the total number of assessors to be called
    */
    function setAssessorPool(uint seed, address _concept, uint num) onlyConcept() {
        uint numCalled = 0;
        uint membersOfConcept = Concept(_concept).getMemberLength();
        //we want to call at most half of the members of each concept
        uint maxFromThisPool = num > membersOfConcept/2 ? membersOfConcept/2 : num;
        for (uint k=0; k < maxFromThisPool; k++) {
            address randomUser = Concept(_concept).getWeightedRandomMember(seed + k);
            if (randomUser != address(0x0) && addAssessorToPool(randomUser)) {
                numCalled++;
            }
        }
        uint remaining = num - numCalled;
        if (remaining > 0) {
            for (uint i = 0; i < Concept(_concept).getParentsLength(); i++) {
                setAssessorPool(seed + numCalled + i, Concept(_concept).parents(i), remaining/Concept(_concept).getParentsLength() + 1); //Calls the remaining users from the parent concepts proportional to their size
            }
        }
        assessmentStage = State.Called;
    }

    //@purpose: called by an assessor to confirm and stake
    function confirmAssessor() onlyInStage(State.Called) {
        // cancel if the assessment is older than 12 hours or already past its timelimit
        if (now > latestConfirmTime){
            cancelAssessment();
            return;
        }
        if (assessorState[msg.sender] == State.Called &&
            assessors.length < size &&
            Concept(concept).subtractBalance(msg.sender, cost)
            ) {
            assessors.push(msg.sender);
            assessorState[msg.sender] = State.Confirmed;
            UserRegistry(userRegistry).notification(msg.sender, 2); //Confirmed for assessing, stake has been taken
        }
        if (assessors.length == size) {
            notifyAssessors(uint(State.Confirmed), 4);
            UserRegistry(userRegistry).notification(assessee, 4);
            assessmentStage = State.Confirmed;
        }
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


    function steal(int128 _score, string _salt, address assessor) {
        if(assessorState[assessor] == State.Committed) {
            if(commits[assessor] == sha3(_score, _salt)) {
                UserRegistry(userRegistry).addBalance(msg.sender, cost/2, concept);
                assessorState[assessor] = State.Burned;
                size--;
            }
        }
    }

    //@purpose: called by assessors to reveal their own commits or others
    function reveal(int128 _score, string _salt) onlyInStage(State.Committed) {
        if (now > endTime + 12 hours) { //add bigger zerocheck
            for (uint i = 0; i < assessors.length; i++) {
                if (assessorState[assessors[i]] == State.Committed) { //If the assessor has not revealed their score
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
        uint mad = Math.calculateMAD(finalScores);
        uint finalClusterLength;
        (finalScore, finalClusterLength) = Math.getFinalScore(finalScores, mad);
        payout(mad);
        if (finalScore > 0) {
            Concept(concept).addMember(assessee, uint(finalScore) * finalClusterLength);
        }
        UserRegistry(userRegistry).notification(assessee, 7);
   }

    function payout(uint mad) onlyInStage(State.Done) internal {
        uint q = 1; //INFLATION RATE
        for (uint i = 0; i < assessors.length; i++) {
            if (assessorState[assessors[i]] == State.Done) {
                uint payoutValue = Math.getPayout(Math.abs(scores[assessors[i]] - finalScore), mad, cost, q);
                UserRegistry(userRegistry).addBalance(assessors[i], payoutValue, concept);
                UserRegistry(userRegistry).notification(assessors[i], 6); //You  got paid!
            }
        }
    }
}
