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
var gasPrice = deploymentScript.gasPrice
var etherPrice = deploymentScript.etherPrice

contract('Assessment', function(accounts) {
    let UserRegistryInstance;
    let conceptReg;
    let distributor;

    let assessedConceptID = 2;
    let assessedConcept;
    let ConceptInstance;
    let assessmentContract;

    let cost = 10000000;
    let size = 5;
    let timeLimit = 100000000;
    let waitTime = 100;

    let calledAssessors = [];
    let assesseeIdx = nInitialUsers + 1
    let assessee = accounts[assesseeIdx];
    let outsideUser = accounts[nInitialUsers + 2];

    let score = 1000;
    let scores = [];
    let salts = [];
    let hashes = [];

    for (i=0; i<nInitialUsers; i++){
        scores.push(score)
        salts.push(i.toString())
        hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
    }
    let receiptFromMakeAssessment;
    var ethBalancesBefore;
    var ethBalancesAfter;
    var gasCosts = [];
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
            })
        })
    })

    describe('Concept', function() {
        it("should initiate an assessment", function() {
            ethBalancesBefore = utils.getEthBalances(accounts.slice(0,nInitialUsers + 2))
            return assessedConcept.makeAssessment(cost,size, waitTime, timeLimit, {from: assessee}).then(function(result) {
                receiptFromMakeAssessment = result.receipt
                gasCosts.push({function: "makeAssessment",
                               cost: {
                                   ether:web3.fromWei(receiptFromMakeAssessment.gasUsed * gasPrice, "ether"),
                                   $: utils.weiToDollar(receiptFromMakeAssessment.gasUsed * gasPrice, etherPrice)
                               }
                              })
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
                it("should wait some time", function(){
                    return utils.evmIncreaseTime(2000)
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
                    assert.equal(doneBefore, 0, "done was falsely increased")
                })
            })

            it("should accept commits from confirmed assessors", function() {
                return chain.commitAssessors(calledAssessors.slice(1), hashes.slice(1), assessmentContract).then(function(){
                    return assessmentContract.done.call()
                }).then(function(done){
                    doneAfter = done.toNumber()
                    assert.equal(doneAfter, calledAssessors.length - 1, "a confirmed assessor could not commit her score")
                })
            })

            it("should move to committed stage when all commited", function(){
                return assessmentContract.commit(hashes[0], {from: calledAssessors[0]}).then(function(result) {
                    receiptFromLastCommit = result.receipt
                    gasCosts.push({function: "commit",
                                   cost: {
                                       ether:web3.fromWei(receiptFromLastCommit.gasUsed * gasPrice, "ether"),
                                       $: utils.weiToDollar(receiptFromLastCommit.gasUsed * gasPrice, etherPrice)
                                   }
                                  })
 
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
            it("committed assessors can reveal their scores", function() {
                nAssessors = calledAssessors.length
                return chain.revealAssessors(calledAssessors.slice(1, nAssessors),
                                             scores.slice(1, nAssessors),
                                             salts.slice(1, nAssessors),
                                             assessmentContract)
                    .then(function(){
                        return assessmentContract.done.call()
                    }).then(function(done) {
                        assert.equal(done.toNumber(), nAssessors-1, "at least one assessors couldn't reveal")
                })
            })

            it("should move to the done stage when all assessors have revealed", function(){
                return assessmentContract.reveal(scores[0],
                                                salts[0],
                                                 {from: calledAssessors[0]})
                    .then(function(result){
                        receiptFromLastReveal = result.receipt
                        gasCosts.push({function: "last Reveal + calculate + payout",
                                       cost: {
                                           ether:web3.fromWei(receiptFromLastReveal.gasUsed * gasPrice, "ether"),
                                           $: utils.weiToDollar(receiptFromLastReveal.gasUsed * gasPrice, etherPrice)
                                       }
                                      })
                        ethBalancesAfter = utils.getEthBalances(accounts.slice(0,nInitialUsers + 2))
                        return assessmentContract.assessmentStage.call()
                    }).then(function(stage){
                        assert.equal(stage.toNumber(), 4, "assessment did not enter done stage")
                    })
            })
        })
        
        describe("Done", function() {
            it("should calculate the assessee's score", function(){
                return assessmentContract.finalScore.call().then(function(finalScore) {
                    assert.equal(finalScore.toNumber(), score, "score not calculated correctly")
                })
            })

            describe("The assessee", function(){
                let weight;

                it("is added to the concept", async () => {
                    weightInConcept = await assessedConcept.getWeight.call(assessee)
                    weight = weightInConcept.toNumber()
                    assert.isAbove(weight, 0, "the assesee doesn't have a weight in the concept")
                })

                it("is added to the parent at half weight", async () => {
                    parentConcept = await Concept.at( await assessedConcept.parents.call(0))
                    weightInParent = await parentConcept.getWeight.call(assessee)
                    await parentConcept.getWeight(assessee)
                    assert.isAbove(weightInParent.toNumber(), 0, "the assesse doesn't have a weight in the parent")
                    assert.equal(weight/2, weightInParent.toNumber(), "the assessee didn't have half weight in parent")
                })
            })

            describe("The Assessor", function(){
                it("should be paid", function() {
                    return UserRegistryInstance.balances.call(calledAssessors[0]).then(function(balance){
                        assert.equal(balance.toNumber(), assessorInitialBalance + cost, "assessor didn't get paid")
                    })
                })
            })

            describe("Gast costs", function() {
                it("Analysis:", async () => {
                    stage = await assessmentContract.assessmentStage.call()
                    assert.equal(stage.toNumber(), 4, "gas measured before assessment is done")
                    console.log('Assuming GasPrice: ' + gasPrice + "  and 1 ether = $" + etherPrice);
                    console.log(gasCosts)
            })
            })
        })
    })
})
