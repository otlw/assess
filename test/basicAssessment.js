var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")
chain = require("../js/assessmentFunctions.js")

var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable
var nInitialUsers = deploymentScript.nInitialUsers

contract('Assessment', function(accounts) {
    let UserRegistryInstance;
    let conceptReg;
    let distributor;
    let assessedConceptID = 2;
    let assessedConcept;
    let ConceptInstance;
    let assessmentContract;
    let cost = 2;
    let size = 5;
    let calledAssessors = [];
    let assessee = accounts[nInitialUsers + 1];
    let outsideUser = accounts[nInitialUsers + 2];
    let scores = [];
    let salts = [];
    let hashes = [];
    for (i=0; i<nInitialUsers; i++){
        scores.push(10)
        salts.push(i.toString())
        hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
    }
    let receiptFromMakeAssessment;
    describe('Before the assessment', function(){
        it('A concept should be registered', function() {
            return Distributor.deployed().then(function(instance) {
                distributor = instance
                return distributor.conceptLookup.call(assessedConceptID)
            }).then(function(assessedConceptAddress) {
                assessedConcept = Concept.at(assessedConceptAddress)
                return ConceptRegistry.deployed()
            }).then(function(instance){
                conceptReg = instance
                return conceptReg.conceptExists.call(assessedConcept.address)
            }).then(function(exists) {
                assert.equal(exists, true, "concept to be assessed does not exist")
            })
        })
        it("users should have enough tokens", function() {
            return UserRegistry.deployed().then().then(function(instance) {
                UserRegistryInstance = instance;
                return UserRegistryInstance.balances.call(assessee)
            }).then(function(balance){
                assesseeInitialBalance = balance
                assert.isAbove(assesseeInitialBalance.toNumber(), cost*size)
            /*}).then(function(){
                return UserRegistryInstance.balances.call(assessor)
            }).then(function(balance){
                assessorInitialBalance = balance
                assert.isAbove(assessorInitialBalance.toNumber(), cost)*/
            })
        })
    })

    describe('Concept', function() {
        it("should initiate an assessment", function() { //TODO refactor into multiple it(...)'s
            return assessedConcept.makeAssessment(cost,size, {from: assessee}).then(function(result) {
                receiptFromMakeAssessment = result.receipt
                // makeAssessmentLogs = result.receipt.logs
                const eventLogs = utils.getNotificationArgsFromReceipt(result.receipt, 0)
                assessmentAddress = eventLogs[0].sender
                return assessedConcept.assessmentExists.call(assessmentAddress)
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
            it("should call the assessors", function() {
                callsToAssessors = utils.getNotificationArgsFromReceipt(receiptFromMakeAssessment, 1)
                for (a=0; a<callsToAssessors.length; a++){
                    calledAssessors.push(callsToAssessors[a].user)
                }
                return Assessment.at(assessmentAddress).then(function(instance){
                    assessmentContract = instance
                    return assessmentContract.assessorPoolLength.call().then(function(numAssessors){
                        assert.equal(numAssessors.toNumber(), nInitialUsers , "the assesssors did not get added to the pool")
                    })
                })
            })
            
            describe("When assessors confirm", function(){
                let receiptFromConfirm;
                it("they should be rejected if they have not been called", function(){
                    return UserRegistryInstance.balances.call(outsideUser).then(function(balance){
                        balanceBefore = balance.toNumber()
                    }).then(function(){
                        return assessmentContract.confirmAssessor( {from: outsideUser} )
                    }).then(function(result){
                        return UserRegistryInstance.balances.call(outsideUser)
                    }).then(function(balance){
                        balanceAfter = balance.toNumber()
                        assert.equal(balanceBefore, balanceAfter, "an uncalled assessor could place a stake")
                    })
                })

                it("they should be charged", function(){
                    return UserRegistryInstance.balances.call(calledAssessors[0]).then(function(balance){
                        assessorInitialBalance = balance.toNumber()
                        return chain.confirmAssessors(calledAssessors, assessmentContract)
                    }).then(function(){
                        return UserRegistryInstance.balances.call(calledAssessors[0])
                    }).then(function(balance){
                        balanceAfter = balance.toNumber()
                        assert.equal(balanceAfter, assessorInitialBalance-cost, "assessor did not get charged")
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
                    return assessmentContract.commit(web3.sha3("random"), {from: outsideUser}) 
                }).then(function(){
                    return assessmentContract.done.call()
                }).then(function(done){
                    doneAfter = done.toNumber()
                    assert.equal(doneBefore, doneAfter, "an unconfirmed assessor could commit a score")
                    assert.equal(doneBefore, 0, "done was not zero")
                })
            })

            it("should accept commits from confirmed assessors", function() {
                return chain.commitAssessors(calledAssessors, hashes, assessmentContract).then(function(){
                    return assessmentContract.done.call()
                }).then(function(done){
                    doneAfter = done.toNumber()
                    assert.equal(doneAfter, calledAssessors.length, "a confirmed assessor could not commit her score")
                })
            })

            it("should move to committed stage when all commited", function(){
                return assessmentContract.commit(web3.sha3("random"), {from: outsideUser}).then(function(result) {
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
        //NOTWORKING:->
        describe("Committed", function() {
            
            it("committed assessors can reveal their scores", function() {
                nAssessors = calledAssessors.length
                // console.log(calledAssessors.slice(1, nAssessors))
                // console.log(scores.slice(1, nAssessors))
                // console.log(salts.slice(1, nAssessors))
                return chain.revealAssessors(calledAssessors.slice(1, nAssessors),
                                             scores.slice(1, nAssessors),
                                             salts.slice(1, nAssessors),
                                             assessmentContract)
                    .then(function(){
                        return assessmentContract.done.call()
                    }).then(function(done) {
                        console.log(done.toNumber())
                        assert.equal(done.toNumber(), nAssessors-1, "at least one assessors couldn't reveal")
                })
            })

            it("should move to the done stage when all assessors have revealed", function(){
                return assessmentContract.reveal(scores[0],
                                                salts[0],
                                                calledAssessors[0],
                                                 {from: calledAssessors[0]})
                    .then(function(result){
                        receiptFromLastReveal = result.receipt
                        return assessmentContract.assessmentStage.call()
                    }).then(function(stage){
                        assert.equal(stage.toNumber(), 4, "assessment did not enter done stage") 
                    })
            })
        })

        describe("Done", function() {
            it("should calculate the assesee's score", function(){
                return assessmentContract.finalScore.call().then(function(finalScore) {
                    assert.equal(finalScore.toNumber(), 10, "score not calculated correctly") //TODO write a javascript function that calculates a score
                })
            })

            describe("The assessee", function(){
                let weight;

                it("is added to the concept", function(){
                    return assessedConcept.weights.call(assessee).then(function(weightInConcept){
                        weight = weightInConcept.toNumber()
                        assert.isAbove(weightInConcept.toNumber(), 0, "the assesee doesn't have a weight in the concept")
                    })
                })

                it("is added to the parent at half weight", function() {
                    return assessedConcept.parents.call(0).then(function(parentAddress) {
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
                    return UserRegistryInstance.balances.call(calledAssessors[0]).then(function(balance){
                        assert.isAbove(balance.toNumber(), assessorInitialBalance, "assessor didn't get paid")
                    })
                })
            })
        })
    })
})
