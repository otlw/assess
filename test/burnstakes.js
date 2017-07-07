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

contract("Burning Stakes:", function(accounts){
    let conceptReg;
    let userReg;
    let distributor;
    let assessedConceptID = 2;
    let assessedConcept;
    let assessmentContract;

    let cost = 150000;
    let size = 5;

    let calledAssessors;
    let assessee = accounts[nInitialUsers + 1];

    let lateAssessorIdx = nInitialUsers - 1;
    let earlyAssessorIdx = 1;
    let failingAssessorIdx = 0;

    let initialBalanceAssessors;
    let assessorPayouts;

    let scores = [];
    let salts = [];
    let hashes = [];

    for (i=0; i<nInitialUsers; i++){
        scores.push(10)
        salts.push(i.toString())
        hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
    }

    let timeUntilHalfCommits = 1*60*60 //1hour
    describe("Initially", function(){
        it("an assessment is created and user are called to be assessors.", async () =>{
            distributor  = await Distributor.deployed()
            assessedConceptAddress = await distributor.conceptLookup.call(assessedConceptID)
            assessedConcept = Concept.at(assessedConceptAddress)
            userReg = await UserRegistry.deployed()

            //initiate assessment, save assessors and their initial balance
            result = await assessedConcept.makeAssessment(cost, size, {from: assessee})
            calledAssessors = utils.getCalledAssessors(result.receipt)
            assessmentContract = utils.getAssessment(result.receipt)
            assert.isAbove(calledAssessors.length, size -1, "not enough assessors were called")
        })

        it("called assessors stake to confirm.", async () =>{
            initialBalanceAssessors = await utils.getBalances(calledAssessors, userReg)
            await chain.confirmAssessors(calledAssessors, assessmentContract)
            balancesAfter = await utils.getBalances(calledAssessors, userReg)
            assert.equal(balancesAfter[0] , initialBalanceAssessors[0] - cost, "stake did not get taken")
        })
    })

    describe("Next, assessors can" , function(){
        it("can commit their hashed scores during thrice the time needed by the first half of them.", async () => {
            // let time pass so that the grace period is meaningful
            await utils.evmIncreaseTime(timeUntilHalfCommits)
            await chain.commitAssessors(calledAssessors.slice(earlyAssessorIdx,lateAssessorIdx),
                                        hashes.slice(earlyAssessorIdx, lateAssessorIdx),
                                        assessmentContract)

            // let time pass so that the grace period is over (+10%)
            await utils.evmIncreaseTime(timeUntilHalfCommits + timeUntilHalfCommits/10)
            await assessmentContract.commit(hashes[lateAssessorIdx], {from:calledAssessors[lateAssessorIdx]})

            // let a lot of time pass so that the grace period is over twice and their stake will be burned entirely
            await utils.evmIncreaseTime(timeUntilHalfCommits + timeUntilHalfCommits)
            await assessmentContract.commit(hashes[earlyAssessorIdx], {from:calledAssessors[earlyAssessorIdx]})

            stage = await assessmentContract.assessmentStage.call()
            assert.equal(stage.toNumber(), 3, "assessment did not move to stage reveal")
        })

        it ("reveal their score to finish the assessment.", async () => {
            // let all assessors reveal
            try {await chain.revealAssessors(calledAssessors, scores, salts, assessmentContract)}
            catch(e){ console.log("At least one assessor could not reveal") }
            stage = await assessmentContract.assessmentStage.call()
            assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
        })
    })

    describe("Finally, assessors are payed out their stake", function() {
        it("entirely if they committed among the first half of assessors.", async () => {
            assessorPayouts = await utils.getBalances(calledAssessors, userReg)
            assert.equal(assessorPayouts[earlyAssessorIdx],
                         initialBalanceAssessors[earlyAssessorIdx] + cost,
                         "assessors did not get payed out correctly")
        })

        it("entirely if they committed during the grace period afterwards", async () =>{
            assert.equal(assessorPayouts[lateAssessorIdx-1],
                         initialBalanceAssessors[lateAssessorIdx-1] + cost,
                         "graceAssessor's stake did get burned")
        })

        it("partially if they were late", async () =>{
            assert.isAbove(assessorPayouts[earlyAssessorIdx],
                           assessorPayouts[lateAssessorIdx],
                           "late assessor's stake did not get burned")

            assert.isAbove(assessorPayouts[lateAssessorIdx],
                           initialBalanceAssessors[lateAssessorIdx],
                           "late assessor's stake got entirely burned")
        })

        it("not at all if they were much too late", async () =>{
            assert.equal(assessorPayouts[failingAssessorIdx],
                         initialBalanceAssessors[failingAssessorIdx] - cost,
                         "the failed assessor's stake did not get entirely burned")
        })
    })
})

