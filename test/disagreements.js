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
    let cost = 2;
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
                assert(false)
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
    /*
    describe("When assessors fail to make an assessment", function(){
        it("their stake is burned according to time passed", function(){
        })
        it("and the assessment eventually starts without him", function(){
        })
    })
    
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
