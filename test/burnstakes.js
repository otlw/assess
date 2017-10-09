var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
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
    let aha;
    let distributor;
    let assessedConceptID = 2;
    let assessedConcept;
    let assessmentContract;

    let cost = 150000;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;

    let calledAssessors;
    let confirmedAssessors;
    let assessee = accounts[nInitialUsers + 1];

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
            aha = await FathomToken.deployed()

            //initiate assessment, save assessors and their initial balance
            result = await assessedConcept.makeAssessment(cost, size, waitTime, timeLimit, {from: assessee})
            calledAssessors = utils.getCalledAssessors(result.receipt)
            assessmentContract = utils.getAssessment(result.receipt)
            assert.isAbove(calledAssessors.length, size -1, "not enough assessors were called")
        })

        it("called assessors stake to confirm.", async () =>{
            initialBalanceAssessors = await utils.getBalances(calledAssessors, aha)
            confirmedAssessors = calledAssessors.slice(0, size)
            await chain.confirmAssessors(confirmedAssessors, assessmentContract)
            balancesAfter = await utils.getBalances(confirmedAssessors , aha)
            assert.equal(balancesAfter[0] , initialBalanceAssessors[0] - cost, "stake did not get taken")
        })
    })

    describe("Next, assessors can" , function(){
        it("can commit their hashed scores during, iff they do so before the end of the assessment.", async () => {
            await chain.commitAssessors(confirmedAssessors.slice(0, 3),
                                        hashes.slice(0, 3),
                                        assessmentContract)

            // let a lot of time pass so that the timelimit is over
            await utils.evmIncreaseTime(timeLimit + 20)
            // call commmit() to burn all uncommitted assessors and move to next stage
            await assessmentContract.commit(hashes[0], {from:confirmedAssessors[0]})

            stage = await assessmentContract.assessmentStage.call()
            assert.equal(stage.toNumber(), 3, "assessment did not move to stage reveal")
        })

        it ("reveal their score to finish the assessment.", async () => {
            // let the 12h challenge period pass
            await utils.evmIncreaseTime(60*60*13)
            // let all assessors reveal
            await chain.revealAssessors(confirmedAssessors.slice(0,3),
                                        scores.slice(0,3),
                                        salts.slice(0,3),
                                        assessmentContract)

            stage = await assessmentContract.assessmentStage.call()
            assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
        })
    })

    describe("Finally, assessors are payed out their stake", function() {
        it("entirely if they committed in time.", async () => {
            assessorPayouts = await utils.getBalances(confirmedAssessors, aha)
            assert.equal(assessorPayouts[0],
                         initialBalanceAssessors[0] + cost,
                         "assessors did not get payed out correctly")
        })

        it("not at all if they were too late.", async () =>{
            assert.equal(assessorPayouts[4],
                         initialBalanceAssessors[4] - cost,
                         "the late assessor's stake did not get entirely burned")
       })
    })
})

