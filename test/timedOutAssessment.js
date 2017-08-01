var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor")

var utils = require("../js/utils.js")
var chain = require("../js/assessmentFunctions.js")

contract("An assessment where not enough asssessors confirm", (accounts) => {
    let cost = 10;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;

    let assessee = {address: accounts[5]}
    let assessors;
    let assessorInitialBalance;
    let assessedConcept = 4;

    let assessment
    let UserRegistryInstance

    it ("should be created with at least "+size+" assessors", async () => {
        UserRegistryInstance = await UserRegistry.deployed()
        const DistributorInstance = await Distributor.deployed()

        assessee.balance = await UserRegistryInstance.balances.call(assessee.address)
        const assessmentResult = await Concept.at(await DistributorInstance.conceptLookup(assessedConcept)).makeAssessment(cost, size, waitTime, timeLimit, {from: assessee.address})

        assessment = Assessment.at(utils.getNotificationArgsFromReceipt(assessmentResult.receipt, 1)[0].sender)

        assessors = utils.getCalledAssessors(assessmentResult.receipt)
        assessorInitialBalance = await UserRegistryInstance.balances.call(assessors[0])
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

        it("should return the payment to the user", async () => {
            const balance = await UserRegistryInstance.balances.call(assessee.address)

            assert.equal(balance.toNumber(), assessee.balance.toNumber(), "payment wasn't returned")
        })

        it("should return payment to the assessors", async () => {
            const assessorBalance = await UserRegistryInstance.balances.call(assessors[0])
            assert.equal(assessorInitialBalance.toNumber(), assessorBalance.toNumber(), "stake wasn't returned")
        })
    })
})

contract ("An assessment where assessors fail to reveal", (accounts) => {
    let assessee = {address: accounts[5]}
    let assessors;

    let finalBalances;
    let initialBalances;

    let size = 5;
    let assessment
    let UserRegistryInstance

    let scores = Array(5).fill(4)
    let salts = Array(5).fill("hihihi")

    let hashes = Array(5).fill(utils.hashScoreAndSalt(4, "hihihi"))

    it ("should run until the reveal stage", async () => {
        UserRegistryInstance = await UserRegistry.deployed()
        const DistributorInstance = await Distributor.deployed()

        assessee.balance = await UserRegistryInstance.balances.call(assessee.address)
        const assessmentResult = await Concept.at(await DistributorInstance.conceptLookup(2)).makeAssessment(10, 5, 1000, 2000, {from: assessee.address})

        assessment = Assessment.at(utils.getNotificationArgsFromReceipt(assessmentResult.receipt, 1)[0].sender)

        assessors = utils.getCalledAssessors(assessmentResult.receipt)
        initialBalances = await utils.getBalances(assessors, UserRegistryInstance)

        await chain.confirmAssessors(assessors.slice(0,size), assessment)
        await chain.commitAssessors(assessors.slice(0,size), hashes, assessment)

        stage = await assessment.assessmentStage.call()

        assert.equal(stage.toNumber(), 3, "did not reach Committed stage")
    })

    it ("should allow assessors to confirm before 12 hours have passed", async () => {
        await chain.revealAssessors(assessors.slice(0,3 ), scores.slice(0, 3), salts.slice(0, 3), assessment)

        const done = await assessment.done.call()
        assert.equal(done.toNumber(), 3)
    })

    describe("After 12 hours", () => {
        it("assessors shouldn't be able to confirm", async () => {
            utils.evmIncreaseTime(13*60*60)
            await assessment.reveal(4, "hihihi")

            const done = await assessment.done.call()
            assert.equal(done.toNumber(), 3)
        })

        it("should payout assessors who did commit", async () => {
            finalBalances = await utils.getBalances(assessors, UserRegistryInstance)
            for(i=0; i < 2; i++) {
                assert.isAbove(finalBalances[i], initialBalances[i])
            }
        })

        it("should not payout assessors who didn't reveal", () => {
            for(i = 3; i < 5; i++) {
                assert.isBelow(finalBalances[i], initialBalances[i])
            }
        })
    })
})
        
