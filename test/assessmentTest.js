var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

var abi = require('ethjs-abi'); //used to encode/decode function args to bytecode
var ethereumjsABI = require('ethereumjs-abi');  //used to create the sha3()-equivalent of solidity's sha3() (tight packing etc)

contract('Assessment', function(accounts) {
    let UserRegistryInstance;
    let conceptReg;
    let assessmentAdress;
    let ConceptInstance;
    let assessmentContract;
    let makeAssessmentLogs;
    let parentConcept;
    let cost = 2;
    let size = 5;
    let calledAssessors = [];
    let assessee = accounts[1];
    let assessor = accounts[0];
    let otherUsersInitialBalance = 50;
    let user0InitialBalance;
    let nOthers=5; //should not be more than testrpc accounts -1
    let salt = "123";
    let score = 10;

    describe('Before the assessment', function(){
        it('A new concept should be registered', function() {
            return ConceptRegistry.deployed().then(function(instance) {
                conceptReg = instance
                return conceptReg.makeConcept([])
            }).then(function(result) {
                createdConceptAddress = result.logs[0].args["_concept"]
                return conceptReg.conceptExists(createdConceptAddress)
            }).then(function(exists) {
                assert.equal(exists, true, "concept did not get registered")
            })
        })

        it("users should have enough tokens", function() {
            return UserRegistry.deployed().then().then(function(instance) {
                UserRegistryInstance = instance;
                return UserRegistryInstance.balances.call(assessee)
            }).then(function(balance){
                assesseeInitialBalance = balance
                assert.isAbove(assesseeInitialBalance.toNumber(), cost*size)
            }).then(function(){
                return UserRegistryInstance.balances.call(assessor)
            }).then(function(balance){
                assessorInitialBalance = balance
                assert.isAbove(assessorInitialBalance.toNumber(), cost)
            })
        })
    })

    describe('Concept', function() {
        it("should initiate an assessment", function() { //TODO refactor into multiple it(...)'s
            return Concept.at(createdConceptAddress).then(function(instance){
                ConceptInstance = instance
                return ConceptInstance.makeAssessment(cost,size, {from: assessee})
            }).then(function(result) {
                makeAssessmentLogs = result.receipt.logs
                const output = abi.decodeEvent(UserRegistry.abi[15], makeAssessmentLogs[0].data)
                assessmentAddress = output.sender
                return ConceptInstance.assessmentExists.call(assessmentAddress)
            }).then(function(exists){
                assert.isTrue(exists, "the assessment has been created")
            })
        })

        it("should charge the assessee", function() {
            return UserRegistryInstance.balances.call(assessee).then(function(balance){
                assert.equal(balance.toNumber(), assesseeInitialBalance - cost*size, "the assessee did not get charged correctly" )
            })
        })
    })

    describe('In assessment stage', function() {
        let receiptFromLastReveal;
        describe('Called', function() {
            it("should call the assessor", function() {
                return Assessment.at(assessmentAddress).then(function(instance){
                    assessmentContract = instance
                    return assessmentContract.assessorPoolLength.call().then(function(numAssessors){
                        assert.equal(numAssessors.toNumber(), 1, "the assesssor did not get added to the pool")
                    })
                })
            })

            describe("When assessors confirm", function(){
                let receiptFromConfirm;
                it("they should be rejected if they have not been called", function(){
                    return UserRegistryInstance.balances.call(accounts[2]).then(function(balance){
                        balanceBefore = balance.toNumber()
                    }).then(function(){
                        return assessmentContract.confirmAssessor( {from: accounts[2]} )
                    }).then(function(result){
                        return UserRegistryInstance.balances.call(accounts[2])
                    }).then(function(balance){
                        balanceAfter = balance.toNumber()
                        assert.equal(balanceBefore, balanceAfter, "an uncalled assessor could place a stake")
                    })
                })

                it("they should be charged", function(){
                    return assessmentContract.confirmAssessor( {from: assessor} ).then(function(){
                        return UserRegistryInstance.balances.call(assessor).then(function(balance){
                            balanceAfter = balance.toNumber()
                            assert.equal(balanceAfter, balanceBefore-cost, "assessor did not get charged")
                        })
                    })
                })

                it("should move to the called stage if enough confirmed", function(){
                    return assessmentContract.assessmentStage.call().then(function(stage){
                        assert.equal(stage.toNumber(), 2, "the assessment did not enter called stage")
                    })
                })

            })
        })

        describe("Confirmed", function() {
            let receiptFromLastCommit;
            let doneBefore;
            let doneAfter;

            it("commits from non-assessors should be rejected", function(){
                return assessmentContract.done.call().then(function(done){
                    doneBefore = done.toNumber()
                    return assessmentContract.commit(web3.sha3("random"), {from: accounts[4]})
                }).then(function(){
                    return assessmentContract.done.call()
                }).then(function(done){
                    doneAfter = done.toNumber()
                    assert.equal(doneBefore, doneAfter, "an unconfirmed assessor could commit a score")
                    assert.equal(doneBefore, 0, "done was not zero")
                })
            })

            it("should accept commits from confirmed assessors", function() {
                var hash0 = "0x" + hashScoreAndSalt(score, salt)
                return assessmentContract.commit(hash0, {from: assessor}).then(function() {
                    return assessmentContract.done.call()
                }).then(function(done){
                    doneAfter = done.toNumber()
                    assert.equal(doneAfter, 1, "a confirmed assessor could not commit her score")
                })
            })

            it("should move to committed stage when all commited", function(){
                return assessmentContract.commit(web3.sha3("random"), {from: accounts[4]}).then(function(result) {
                    receiptFromLastCommit = result.receipt
                    return assessmentContract.assessmentStage.call()
                }).then(function(aState){
                    assert.equal(aState.toNumber(), 3, "assessment did not enter commit stage" )
                    return assessmentContract.done.call()
                }).then(function(done){
                    assert.equal(done.toNumber(), 0, "done did not get reset")
                })
            })
        })

        describe("Committed", function() {
            it("a committed assessor can reveal their score", function() {
                return assessmentContract.reveal(score, salt, assessor, {from: assessor}).then(function(result){
                    receiptFromLastReveal = result.receipt
                    return assessmentContract.done.call()
                }).then(function(done) {
                    assert.equal(done, 1, "the assessor couldn't reveal")
                })

            })

            it("should move to the done stage when all assessors have revealed", function(){
                return assessmentContract.assessmentStage.call().then(function(stage){
                    assert.equal(stage.toNumber(), 4, "assessment did not enter done stage")
                })
            })
        })

        describe("Done", function() {
            it("should calculate the assesee's score", function(){
                return assessmentContract.finalScore.call().then(function(finalScore) {
                    assert.equal(finalScore.toNumber(), finalScore, "score not calculated correctly")
                })
            })

            describe("The assessee", function(){
                let weight;

                it("is added to the concept", function(){
                    return ConceptInstance.weights.call(assessee).then(function(weightInConcept){
                        weight = weightInConcept.toNumber()
                        assert.isAbove(weightInConcept.toNumber(), 0, "the assesee doesn't have a weight in the concept")
                    })
                })

                it("is added to the parent at half weight", function() {
                    return ConceptInstance.parents.call(0).then(function(parentAddress) {
                        return Concept.at(parentAddress)
                    }).then(function(parentConceptInstance) {
                        return parentConceptInstance.weights.call(assessee)
                    }).then(function(weightInParent) {
                        assert.isAbove(weightInParent.toNumber(), 0, "the assesse doesn't have a weight in the parent")
                        assert.equal(weight/2, weightInParent.toNumber(), "the assessee didn't have half weight in parent")
                    })
                })
            })

            describe("The Assessor", function(){
                it("should be paid", function() {
                    return UserRegistryInstance.balances.call(assessor).then(function(balance){
                        assert.isAbove(balance.toNumber(), assessorInitialBalance, "assessor didn't get paid")
                    })
                })
            })
        })
    })
})

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
