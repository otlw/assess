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
    describe("Assessors that confirm", function(){
        it("should be charged and notified if they have been called", function() {
            return userReg.balances.call(accounts[assessee]).then(function(balance){
                balanceBefore = balance.toNumber()
            }).then(function(){
                // console.log(assessmentContract.address)
                // console.log(assessmentAddress)
                return assessmentContract.confirmAssessor( {from: accounts[assessor]} )
            }).then(function(result){
                console.log(result)
                logsFromConfirm = result
                return userReg.balances.call(accounts[assessee])
            }).then(function(balance){
                balanceAfter = balance.toNumber()
                assert.equal(balanceBefore-cost, balanceAfter, "assessor did not get charged")
            }).then(function(){
                assert.equal(0,1,"")
            })
        })
        it("should be rejected if they have not been called", function(){
            
        })
    })
                //return assessment.confirmAssessors({from: accounts[0]})
            //}).then(function(){
                
})

function getNotificationArgsFromReceipt(receipt, _topic){
    //basically that's how it it used now
   /* 
    return assessedConcept.makeAssessment(cost,size, {from: accounts[assessee]})
}).then(function(result) {
    //console.log(result.receipt.logs[0].data)
    const output = abi.decodeEvent(UserRegistry.abi[15], result.receipt.logs[0].data)
    //console.log(output)
    assessmentAddress = output.sender
    */
    //returns [ [user, sender, topic] for all logs in receipt with topic == _topic ]
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


