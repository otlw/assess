var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor")

var utils = require("../js/utils.js")
var chain = require("../js/assessmentFunctions.js")

contract("An assessment where not enough asssessors confirm", (accounts) => {
    let cost = 10;
    let size = 5;
    let timeLimit = 2000;
    let waitTime = 1000;

    let assessee = {address: accounts[size+1]}
    let assessors;
    let assessorInitialBalance;
    let assessedConcept = 4;

    let assessment
    let aha

    it ("should be created with at least "+size+" assessors", async () => {
        aha = await FathomToken.deployed()
        const DistributorInstance = await Distributor.deployed()

        assessmentData = await chain.makeAssessment((await DistributorInstance.conceptLookup(1)), assessee.address, cost, size, waitTime, timeLimit)
        assessment = Assessment.at(assessmentData.address)
        assessors = assessmentData.assessors

        // save the assessee's balance before the last makeAssessment() call
        assessee.balance = (await aha.balances.call(assessee.address)).toNumber() + cost * size
        assessorInitialBalance = await aha.balances.call(assessors[0])
        assert.isAtLeast(assessors.length, size, "the minimum of at least" + size + " assessors was not called")
    })

    it ("should allow an assessor to confirm before the latest possible Start", async () => {
        await utils.evmIncreaseTime(waitTime - 5)

        const txResult = await assessment.confirmAssessor({from: assessors[0]})
        const notifications = utils.getNotificationArgsFromReceipt(txResult.receipt, 2)
    })


    describe ("After the deadline, it ", function() {
        it("shouldn't allow an assessor to confirm", async () => {
            await utils.evmIncreaseTime(waitTime + 5)

            const txResult = await assessment.confirmAssessor({from: assessors[1]})
            const notifications = utils.getNotificationArgsFromReceipt(txResult.receipt, 2)

            assert.equal(notifications.length, 0, "an assessor could confirm")
        })

        it("should return the payment to the assessee", async () => {
            const balance = await aha.balances.call(assessee.address)
            assert.equal(balance.toNumber(), assessee.balance, "payment wasn't returned")
        })

        it("should return payment to the assessors", async () => {
            const assessorBalance = await aha.balances.call(assessors[0])
            assert.equal(assessorInitialBalance.toNumber(), assessorBalance.toNumber(), "stake wasn't returned")
        })
    })
})

contract ("An assessment where assessors fail to reveal", (accounts) => {
    let finalBalances;
    let initialBalances;

    let size = 6;
    let cost = 10;
    let assessment
    let aha

    let assessee = {address: accounts[size+1]}
    let assessors;

    let scores = Array(size).fill(4)
    let salts = Array(size).fill("hihihi")

    let hashes = Array(size).fill(utils.hashScoreAndSalt(4, "hihihi"))

    it ("should run until the reveal stage", async () => {
        aha = await FathomToken.deployed()
        const DistributorInstance = await Distributor.deployed()


        assessmentData = await chain.makeAssessment((await DistributorInstance.conceptLookup(1)), assessee.address, cost, size, 1000, 2000)
        assessment = Assessment.at(assessmentData.address)
        assessors = assessmentData.assessors
        assessee.balance = await aha.balances.call(assessee.address)

        initialBalances = await utils.getBalances(assessors, aha)

        await chain.confirmAssessors(assessors.slice(0,size), assessment)
        await chain.commitAssessors(assessors, hashes, assessment)

        stage = await assessment.assessmentStage.call()

        assert.equal(stage.toNumber(), 3, "did not reach Committed stage")
    })

    it ("should allow assessors to reveal before 24 hours have passed", async () => {
        utils.evmIncreaseTime(13*60*60) // wait challenge period
        await chain.revealAssessors(assessors.slice(1, size), scores.slice(1, size), salts.slice(1, size), assessment)

        const done = await assessment.done.call()
        assert.equal(done.toNumber(), size-1)
    })

    describe("After 24 hours", () => {
        it("assessors shouldn't be able to reveal", async () => {
            utils.evmIncreaseTime(13*60*60)
            await assessment.reveal(4, "hihihi")

            const done = await assessment.done.call()
            assert.equal(done.toNumber(), size-1)
        })

        it("should payout assessors who did reveal", async () => {
            finalBalances = await utils.getBalances(assessors, aha)
            for(i=1; i < 4; i++) {
                assert.isAbove(finalBalances[i], initialBalances[i])
            }
        })

        it("should not payout assessors who didn't reveal", () => {
                assert.isBelow(finalBalances[0], initialBalances[0])
        })
    })
})

