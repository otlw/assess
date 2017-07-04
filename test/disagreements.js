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

contract("Assessment", function(accounts){
    let conceptReg;
    let userReg;
    let distributor;
    let assessedConceptID = 2;
    let assessedConcept;
    let assessmentContract;
    let cost = 15;
    let size = 5;
    let calledAssessors;
    let assessee = accounts[nInitialUsers + 1];
    let outsideUser = accounts[nInitialUsers + 2];
    describe("When not enough assessors can be found for an assessment",  function(){
        let initialBalanceAssessee;
        let initialBalanceAssessor;
        it("the assessment can be cancelled by anyone", function(){
            // get ContractInstances of Concept, ConceptRegistry, Distributor and UserRegistry
            return Distributor.deployed().then(function(instance) {
                distributor = instance
                return distributor.conceptLookup.call(assessedConceptID)
            }).then(function(assessedConceptAddress) {
                assessedConcept = Concept.at(assessedConceptAddress)
                return UserRegistry.deployed()
            }).then(function(instance){
                userReg = instance
                //check initial balance of assessee
                return userReg.balances.call(assessee)
            }).then(function(balance){
                initialBalanceAssessee = balance.toNumber()
                //initiate assessment, save assessors and their initial balance
                return assessedConcept.makeAssessment(cost, size, {from: assessee})
            }).then(function(result){
                calledAssessors = utils.getCalledAssessors(result.receipt)
                assessmentContract = utils.getAssessment(result.receipt)
                return userReg.balances.call(calledAssessors[0])
            }).then(function(balance){
                initialBalanceAssessor = balance.toNumber()
                // confirm, wait and cancel (by calling confirm again)
                return assessmentContract.confirmAssessor({from:calledAssessors[0]})
            }).then(function(result){
                //print blocknumber
                //wait 25hours
                seconds2wait = 30*60*60
                return chain.evmIncreaseTime(seconds2wait)
            }).then(function(){
                return assessmentContract.confirmAssessor({from:calledAssessors[1]})
                // there should be no notification
            }).then(function(result){
                // there should be no notification
                cancelAssessmentNotification = utils.getNotificationArgsFromReceipt(result.receipt, 3)
                assert.isAbove(cancelAssessmentNotification.length, 0, "No cancel-Notification got send")
            })
        })
        it("and everyone with a stake in it is refunded", function(){
            return userReg.balances.call(assessee).then(function(balanceAfter){
                assert.equal(balanceAfter.toNumber(), initialBalanceAssessee, "assesse did not get refunded")
                return userReg.balances.call(calledAssessors[0])
            }).then(function(balanceAfter){
                assert.equal(balanceAfter.toNumber(), initialBalanceAssessor, "assessor did not get refunded")
            })
        })
    })

    describe("When assessors fail to make an assessment", function(){
        let lateAssessorIdx;
        let initialBalanceAssessor;
        let nAssessors;
        let scores = [];
        let salts = [];
        let hashes = [];
        for (i=0; i<nInitialUsers; i++){
            scores.push(10)
            salts.push(i.toString())
            hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
        }
        let timeUntilHalfCommits = 1*60*60 //1hour
        it("their stake is burned according to time passed after a grace period", function(){
            //initiate assessment, save assessors and have them confirm
            return assessedConcept.makeAssessment(cost, size, {from: assessee}).then(function(result){
                calledAssessors = utils.getCalledAssessors(result.receipt)
                console.log(calledAssessors.length)
                nAssessors = calledAssessors.length 
                lateAssessorIdx = nAssessors -1 //last one
                return utils.getAssessment(result.receipt)
            }).then(function(instance){
                assessmentContract = instance
                return chain.confirmAssessors(calledAssessors, assessmentContract)
            }).then(function(){
                // save initial balance of assessors how is gonna be late
                return userReg.balances.call(calledAssessors[lateAssessorIdx])
            }).then(function(balance){
                initialBalanceLateAssessor = balance.toNumber()
                //let time pass so that the grace period is meaningful
                return chain.evmIncreaseTime(timeUntilHalfCommits)
            }).then(function(){
                //have more than first half of assessors commit their score to initiate grace period
                //note: assessor[nAssessors/2 + 1] will initiate the grace period, so that all others
                // until assessor[nAssessors - 2 ] will commit during it
                return chain.commitAssessors(calledAssessors.slice(0, lateAssessorIdx),
                                             hashes.slice(0, lateAssessorIdx),
                                             assessmentContract)
            }).then(function(){
                console.log(calledAssessors.length)
                // let time pass so that the grace period is over and then 10% more
                return chain.evmIncreaseTime(timeUntilHalfCommits + timeUntilHalfCommits/10)
            }).then(function(){
                // have the last assessor commit
                return assessmentContract.commit(hashes[lateAssessorIdx], {from:calledAssessors[lateAssessorIdx]})
            }).then(function(){
                //and one more to trigger the reveal phase
                return assessmentContract.commit(web3.sha3("random"), {from:assessee})
            }).then(function(){
                // have all assessors reveal, which triggers payout
                return chain.revealAssessors(calledAssessors, scores, salts, assessmentContract)
            }).then(function(){
                //check balances of first commiters, gracecommiters and latecommiter
                return userReg.balances.call(calledAssessors[lateAssessorIdx])
            }).then(function(balance){
                lateAssessorBalance = balance.toNumber()
                return userReg.balances.call(calledAssessors[lateAssessorIdx-1])
            }).then(function(balance){
                graceAssessorBalance = balance.toNumber()
                return userReg.balances.call(calledAssessors[0])
            }).then(function(balance){
                firstAssessorBalance = balance.toNumber()
                assert.isAbove(firstAssessorBalance, lateAssessorBalance, "late assessor's stake did not get burned")
                assert.equal(firstAssessorBalance, graceAssessorBalance, "graceAssessor's stake did get burned")
                assert.equal(false)
            })
        })


        // it("and the assessment eventually starts without him", function(){
        // })
    })
   /* 
    describe("When an assessor fails to keep his score a secret", function(){
        it("someone else can steal his stake by revealing his score", function(){
        })
        it("and he is removed from the assessment", function(){
        })
    })

    describe("When Assessors disagree on the result of asssessment, they are paid", function(){
        it("their stake plus a proportion if they are in the in the schelling cluster", function(){
        })
        it("their stake minus a proportion if they are outside of it", function(){
        })
    })
    */
})
