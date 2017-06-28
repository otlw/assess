var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var UserRegistryInstance;

var abi = require('ethjs-abi');

contract('Assessment', function(accounts) {
    function decodeNotificationFromLog(log){ //TODO where to put this?
        output = abi.decodeEvent(UserRegistry.abi[15], log.data)
        return [ output.user, ouput.sender, output.topic]
    }
    let userReg;
    let conceptReg;
    let assessmentAdress;
    let assessedConcept;
    let assessmentContract;
    let outputOfMakeAssessment;
    let parentConcept;
    let cost = 2;
    let size = 5;
    let calledAssessors = [];
    let assessee = 1;
    let assessor = 0;
    let otherUsersInitialBalance = 50;
    let user0InitialBalance;
    let nOthers=5; //should not be more than testrpc accounts -1
    describe('Other users', function() {
        it('should receive tokens from the first user', function() {
            return UserRegistry.deployed().then(function(instance){
                userReg = instance
                return userReg.balances.call(accounts[0])
            }).then(function(balance){
                user0InitialBalance = balance
                for (i=1; i<nOthers+1; i++) {
                    userReg.transfer(accounts[i], otherUsersInitialBalance, {from: accounts[0]})
                }
            }).then(function(){
                return userReg.balances.call(accounts[2])
            }).then(function(balance2){
                assert.equal(balance2.toNumber(), otherUsersInitialBalance, "the other users did not receive tokens") //TODO
                return userReg.balances.call(accounts[0])
            }).then(function(balance){
                assert.equal(balance.toNumber(), user0InitialBalance-nOthers*otherUsersInitialBalance, "the other users did not receive tokens") //TODO
            })
        })
    })

   describe('A new concept', function(){
        it('should be registered', function() {
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
    })
    describe('Concept', function() {
       it("should initiate an assessment, charge the assessee and notify her", function() { //TODO refactor into multiple it(...)'s
            return userReg.balances.call(accounts[assessee]).then(function(balance){
                balanceBefore = balance
            }).then(function(){
                assessedConcept = Concept.at(createdConceptAddress)
                return assessedConcept.makeAssessment(cost,size, {from: accounts[assessee]})
            }).then(function(result) {
                //console.log(result.receipt.logs[0].data)
                const output = abi.decodeEvent(UserRegistry.abi[15], result.receipt.logs[0].data)
                //console.log(output)
                outputOfMakeAssessment = result.receipt.logs //save notifications for later tests
                assessmentAddress = output.sender
                assessedUser = output.user
                //check whether assessee has been notified
                assert.equal(assessedUser, accounts[assessee], "assessee has not been notified")
                //check whether assesse has been charged
                return userReg.balances.call(accounts[assessee])
            }).then(function(balance) {
                assert.equal(balance.toNumber(), balanceBefore - cost*size, "the assessee did not get charged correctly" )
                //check whether assessment is saved in the concept
                return assessedConcept.assessmentExists.call(assessmentAddress)
            }).then(function(exists) {
                assert.equal(exists, true, "Concept does not know about its assessment")
            })
       })
    })
    describe('Assessment', function() {
        it("should notify the assessor and set her in the pool of possible assessors", function() {
            return Assessment.at(assessmentAddress).then(function(instance){
                assessmentContract = instance
                return assessmentContract.assessorPoolLength.call().then(function(numAssessors){
                    assert.equal(numAssessors.toNumber(), 1, "the assesssor did not get added to the pool")
                    output = abi.decodeEvent(UserRegistry.abi[15], outputOfMakeAssessment[1].data)
                    notifiedAssessor = output.user
                    assert.equal(notifiedAssessor, accounts[assessor], "the assessor did not get notified")
                })
            })
        })
    })
    describe("When assessors confirm", function(){
        let receiptFromConfirm;
        it("they should be rejected if they have not been called", function(){
            return userReg.balances.call(accounts[2]).then(function(balance){
                balanceBefore = balance.toNumber()
            }).then(function(){
                return assessmentContract.confirmAssessor( {from: accounts[2]} )
            }).then(function(result){
                return userReg.balances.call(accounts[2])
            }).then(function(balance){
                balanceAfter = balance.toNumber()
                assert.equal(balanceBefore, balanceAfter, "an uncalled assessor could place a stake")
            })
        })
        it("they should be charged and notified if they have been called", function() {
            return userReg.balances.call(accounts[assessor]).then(function(balance){
                balanceBefore = balance.toNumber()
            }).then(function(){
                return assessmentContract.confirmAssessor( {from: accounts[assessor]} )
            }).then(function(result){
                receiptFromConfirm = result.receipt
                tmp = getNotificationArgsFromReceipt(receiptFromConfirm, 2)
                confirmedAssessor = tmp[0].user
                assert.equal(confirmedAssessor, accounts[assessor], "assessor did not get notified")
                return userReg.balances.call(accounts[assessor])
            }).then(function(balance){
                balanceAfter = balance.toNumber()
                assert.equal(balanceAfter, balanceBefore-cost, "assessor did not get charged")
            })
        })
        it("they (and the assesse) should be notified once the assessment starts", function() {
            tmp = getNotificationArgsFromReceipt(receiptFromConfirm, 4)
            assert.equal(tmp[0].user, accounts[assessor], "assessor did not get notified")
            assert.equal(tmp[1].user, accounts[assessee], "assessee did not get notified")
        })
    })
    describe("The assessment magic", function(){
        let salt0 = web3.sha3("123");
        let receiptFromLastCommit;
        let doneBefore;
        let doneAfter;
        it("should reject commits from unconfirmed assessors", function(){
            return assessmentContract.done.call().then(function(done){
                doneBefore = done.toNumber()
                return assessmentContract.commit(web3.sha3("random"), {from: accounts[4]})
            }).then(function(){
                return assessmentContract.done.call()
            }).then(function(done){
                doneAfter = done.toNumber()
                assert.equal(doneBefore, doneAfter, "an unconfirmed assessor could commit a score")
            })
        })
        it("should accept commits from confirmed assessors", function() {
            return assessmentContract.commit(salt0, {from: accounts[assessor]}).then(function() {
                return assessmentContract.done.call()
            }).then(function(done){
                doneAfter = done.toNumber()
                assert.equal(doneAfter, 1, "a confirmed assessor could not commit her score")
            })
        })
        it("should move to commit stage once all assessors have committed", function(){
            return assessmentContract.commit(web3.sha3("random"), {from: accounts[4]}).then(function(result) {
                receiptFromLastCommit = result.receipt
                return assessmentContract.assessmentStage.call()
            }).then(function(aState){
                assert.equal(aState.toNumber(), 3, "assessment did not move forward to commit stage" )
                return assessmentContract.done.call()
            }).then(function(done){
                assert.equal(done.toNumber(), 0, "done did not get reset")
            })
        })
        it("should notify all assessors to reveal their scores", function() {
            tmp = getNotificationArgsFromReceipt(receiptFromLastCommit, 5)
            assert.equal(tmp[0].user, accounts[assessor], "assessor did not get notified")
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

//usersNotifiedToBeAssessors = []
//return assessment.assessorPoolLength.call().then(function(numAssessors){
//code for looping over notification events
//for (i=0; i<outputOfMakeAssessment.length; i++){
//var output = decodeNotificationFromLog(outputOfMakeAssessment[i])
//if (output[2] == 1)
    //usersNotifiedToBeAssessors.push(output[1])
         // Assessment should notify firstUser that he is being called
         // firstUser should accept to be an assessor
         // assessment should notify both that it has started
         // firstUser commits a hashed score with salt
         // Assessment notifies users that commit phase is over /reveal phase begins
         // User0 reveals his score
         // Assessment calculates Result
         //   - Assessment pays out the winners
         //   - Assessment adds assesse to as new member to the concept


