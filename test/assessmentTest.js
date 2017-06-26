var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");
var UserRegistryInstance;

var abi = require('ethjs-abi');

contract('Assessment', function(accounts) {
    let userReg;
    let conceptReg;
    let assessmentAdress;
    let assessedConcept;
    let assessment;
    let logsOfmakeAssessment;
    let parentConcept;
    let cost = 2;
    let size = 5;
    let calledAssessors = [];
    let assessee = 1;
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
                outputOfmakeAssessment = output //save notifications for later tests
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
    /*describe('Assessment', function() {
        it("should notify potential assessors and charge them if they accept", function() {
            usersNotifiedToBeAssessors = []
            for (i=0; i<logsOfmakeAssessment.length; i++){
                if (logsOfmakeAssessment[i].args["topic"] == 1)
                    usersNotifiedToBeAssessors.push(logsOfmakeAssessment[i].args["user"])
            }
            return assessment.assessorPoolLength.call()
        }).then(function(numAssessors){
            assert.equal(numAssessors.toNumber(), usersNotifiedToBeAssessors.length, "not all potential assessors got notified")

        })
    })*/
})

         // Assessment should notify firstUser that he is being called
         // firstUser should accept to be an assessor
         // assessment should notify both that it has started
         // firstUser commits a hashed score with salt
         // Assessment notifies users that commit phase is over /reveal phase begins
         // User0 reveals his score
         // Assessment calculates Result
         //   - Assessment pays out the winners
         //   - Assessment adds assesse to as new member to the concept

//listen to created events to get the assessment-address with web3
//create web3 contract object
//            var userRegWeb3Object = web3.eth.contract(userReg.abi)
//           var userRegWeb3Instance = userRegWeb3Object.at(userReg.address)
//          var assessCreationEvent = userRegWeb3Instance.Notification({user:accounts[1], sender: assessedConcept})
//assessCreationEvent.watch(function(err, result){
//   if (!err){
//      console.log("caugt event:")
//     console.log(result)
//assessmentAdress = 
//}
// })

//assessCreationEvent.stopWatching();

