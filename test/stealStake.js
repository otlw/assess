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

contract("Steal Stake:", function(accounts){
    let conceptReg;
    let userReg;

    let assessedConceptID = 2;
    let assessedConcept;
    let assessmentContract;

    let cost = 1500;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 10;

    let calledAssessors;
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

    it("An assessment is created and users are called to be assessors.", async () =>{
        assessedConceptAddress = await (await Distributor.deployed()).conceptLookup.call(assessedConceptID)
        assessedConcept = Concept.at(assessedConceptAddress)
        userReg = await UserRegistry.deployed()

        //initiate assessment, save assessors and their initial balance
        result = await assessedConcept.makeAssessment(cost, size, waitTime, timeLimit, {from: assessee})
        calledAssessors = utils.getCalledAssessors(result.receipt)
        assessmentContract = utils.getAssessment(result.receipt)
        assert.isAbove(calledAssessors.length, size - 1, "not enough assessors were called")
    })

    it("Called assessors stake to confirm.", async () =>{
        initialBalanceAssessors = await utils.getBalances(calledAssessors, userReg)
        await chain.confirmAssessors(calledAssessors, assessmentContract)
        balancesAfter = await utils.getBalances(calledAssessors, userReg)
        assert.equal(balancesAfter[0] , initialBalanceAssessors[0] - cost, "stake did not get taken")

        stage = await assessmentContract.assessmentStage.call()
        assert.equal(stage.toNumber(), 2, "assessment did not move to stage confirmed")
    })

    it ("Assessors commit their hashed scores and the assessment advances.", async () => {
        await utils.evmIncreaseTime(60) 
        await chain.commitAssessors(calledAssessors,
                                     hashes,
                                     assessmentContract)
        stage = await assessmentContract.assessmentStage.call()
        assert.equal(stage.toNumber(), 3, "assessment did not move to stage reveal")
    })

    describe("If assessors reveal their own score", function() {
        it ("they are marked as done, and the assessment progresses.", async () => {
            doneBefore = await assessmentContract.done.call()
            await assessmentContract.reveal(scores[0], salts[0], calledAssessors[0], {from:calledAssessors[0]})
            doneAfter = await assessmentContract.done.call()
            assert.equal(doneAfter.toNumber(), doneBefore.toNumber() + 1, "the assessment did not progress")
        })
    })

    describe("If someone else reveals an assessor's score", function() {
        var balanceBeforeSteal;
        it("the assessor is burned and the size of the assessment reduced.", async () => {
            balanceBeforeSteal = await userReg.balances.call(outsideUser)

            sizeBeforeSteal = await assessmentContract.size.call()
            await  assessmentContract.reveal(scores[1], salts[1], calledAssessors[1], {from:outsideUser})
            sizeAfterSteal = await assessmentContract.size.call()
            assert.equal(sizeAfterSteal.toNumber(),
                         sizeBeforeSteal.toNumber() - 1,
                         "the assessment's size did not get reduced.")

            doneAfterSteal = await assessmentContract.done.call()
            await  assessmentContract.reveal(scores[1], salts[1], calledAssessors[1], {from:calledAssessors[1]})
            doneAfterTry = await assessmentContract.done.call()
            assert.equal(doneAfterTry.toNumber(),
                         doneAfterSteal.toNumber(),
                         "the burned assessor could still advance the assessment.")
        })

        it("and his stake is given to the account who revealed it.",async () => {
            balance = await userReg.balances.call(outsideUser)
            assert.equal(balance.toNumber(),
                         balanceBeforeSteal.toNumber() + cost,
                         "stake was not given to the stealer")
        })
    })
})
