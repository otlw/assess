var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var UserRegistryInstance;

/*
 The migration file xxx.js
    - distributes all tokens equally amongst all accounts
    - and creates 3 concepts as children of the mew-concepts

                       concept12
                      /
mewConcept - concept1
                      \
                       concept11

note: accounts[0] is the only member of mew
 */

contract("Assessment", function(accounts) {
    let userReg;
    let conceptReg;
    let assessorsOfConcept1 = [5,6,7,8,9];
    let mewMembers = [0];
    let assessees = [];
    let mewConcept;
    let concept1;
    let concept11;
    let concept12;
    let initialBalance;
    describe("Initially,", function(){
        it("fetch addresses of already-deployed concepts", function(){
            return Concept.deployed().then(function(instance){
                mewConcept = instance
                return mewConcept.children.call(0)
            }).then(function(child1Address){
                concept1 = Concept.at(child1Address)
                return concept1.children.call(0)
            }).then(function(child11Address){
                concept11 = Concept.at(child1Address)
                return concept1.children.call(1)
            }).then(function(child12Address){
                concept12 = Concept.at(child1Address)
                //now check whether the children know their parents
                return concept1.parents.call(0)
            }).then(function(parentOf1Address){
                assert.equal(parentOf1Address, mewConcept.address, "concept1 is not linked")
                return concept11.parents.call(0)
            }).then(function(parentOf11Address){
                assert.equal(parentOf11Address, concept1.address, "concept11 is not linked")
                return concept12.parents.call(0)
            }).then(function(parentOf12Address){
                assert.equal(parentOf12Address, concept1.address, "concept12 is not linked")
            })
        })
        it("check whether account 0 is the first assessor", function(){
                return mewConcept.weights.call(accounts[0]).then(function(user0isMemberOfMew){
                    assert.equal(user0isMemberOfMew, true, "the first accounts is not a member of mew")
                })
        })
        it("and check whether all accounts are funded", function() {
            return UserRegistry.deployed().then(function(instance){
                userReg = instance
                return userReg.balances.call(0)
            }).then(function(balance0){
                initialBalance = balance0.toNumber()
                assert.isAbove(initialBalance, 0, "account 0 does not have any money left")
                return userReg.balances.call(7)
            }).then(function(balance7){
                assert.isAbove(balance7.toNumber(), 0, "account 7 did not get funded")
            })
        })
    })
    /*describe("More users", function(){
        it("pass the assessment for Concept1", function() {
            // for (var i=0; i<assessorsOfConcept1.length; i++){
            var i = assessorsOfConcept1[0]
            var assessment;
            var cost = 1;
            var size = 5;
            var calledAssessors =[];
            var score1 = 5;
            var scores = [];
            var salts = []
            return Concept1.makeAssessment(cost, size, {from:accounts[i]}).then(function(result){
                tmp = getNotificationArgsFromReceipt(result.receipt, 0) // "assessment creation"
                assessment = Assessment.at(tmp[0].sender)
                //fetch all called assessors from the fired notifications
                potentialAssessorCalls = getNotificationArgsFromReceipt(result.receipt, 1) // called as assessor
                for (var a=0; a < potentialAssessorCalls.length; a++) {
                    calledAssessors.push(potentialAssessorCalls[a].user)
                    scores.push(score1) //all add the same score for now
                    salts.push(a.toString())
                }
            }).then(function(){
                //all called assessors confirm to move to the next stage
                for (var j = 0; j < calledAssessors.length; j++){
                    return assessment.confirmAssessor({from:calledAssessors[j]})
                }
            }).then(function(){
                return assessment.assessmentStage.call()

            }).then(function(stage){
                assert.equal(stage.toNumber(),10, "assessment did not move to stage x")
            })
        })
    })*/
})
                        // //all confirmed assessors should commit in a score
                        // for (var j = 0; j < calledAssessors.length; j++){
                        //     hash = hashScoreAndSalt(scores[j], salts[j])
                        //     return assessment.commit(hash, {from:calledAssessors[j]}).then(function(){
                        //         // all committed assessors reveal their score

/*
 function to filter out all notification events in a receipt of a transaction by their topic.
 If _topic is -1, all events will be returned.
 Attention: hard coded: abi index and signature of Notification-Event
 */
function getNotificationArgsFromReceipt(_receipt, _topic, log = false){
    var events = [];
    for (i=0; i < _receipt.logs.length; i++) {
        if (_receipt.logs[i].topics[0] == "0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876"){
            let event = abi.decodeEvent(UserRegistry.abi[15], _receipt.logs[i].data)
            if (_topic == -1){
                events.push({user: event.user, sender: event.sender, topic: event.topic.toNumber()})
            } else if (event.topic.toNumber() == _topic) {
                events.push({user: event.user, sender: event.sender, topic: event.topic.toNumber()})
            }
        }
    }
    if (log) { console.log(events) }
    return events
}
/*
function to create the sha3-hash equivalent to solidity 
*/
function hashScoreAndSalt(_score, _salt){
    return ethereumjsABI.soliditySHA3(
        ["int8", "string"],
        [_score, _salt]
    ).toString('hex')
}


