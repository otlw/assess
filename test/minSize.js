var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

var utils = require("../js/utils.js")
var chain = require("../js/assessmentFunctions.js")

contract ("Minimum size violations will cancel assessments", (accounts) => {
    let finalBalances;
    let initialBalances;

    let size = 5;
    let cost = 50;
    let timelimit = 2000;
    let assessment
    let aha

    let assessors;

    let scores = Array(size).fill(4)
    let salts = Array(size).fill("hihihi")

    let hashes = Array(size).fill(utils.hashScoreAndSalt(4, "hihihi"))

    describe("during the commit stage:", async () => {
        let assessee = {address: accounts[size+1]}

        it ("An assessment of size 5 is created and assessors are called", async () => {
            aha = await FathomToken.deployed()
            let conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"","0x0")
            let assessedConceptAddress = txResult.logs[0].args["_concept"]

            // save the assessee's balance before the makeAssessment() call
            assessee.balance = (await aha.balanceOf.call(assessee.address)).toNumber()

            let assessmentData = await chain.makeAssessment(assessedConceptAddress, assessee.address, cost, size, 1000, timelimit)
            assessment = Assessment.at(assessmentData.address)
            assessors = assessmentData.calledAssessors

            initialBalances = await utils.getBalances(assessors, aha)
            assert.isAbove(assessors.length, size-1, "not enough assessors were called")
        })

        it ("five confirm, but only four assessors commit", async () => {
            await chain.confirmAssessors(assessors.slice(0,size), assessment)
            await chain.commitAssessors(assessors.slice(1,size), hashes, assessment)

            stage = await assessment.assessmentStage.call()
            done = await assessment.done.call()

            assert.equal(stage.toNumber(), 2, "did not reach Confirmed stage")
            assert.equal(done.toNumber(), size-1)
        })

        it("the 5th assessors fails to commit in time and the assessment is cancelled", async () => {
            utils.evmIncreaseTime(timelimit*1.2)
            commitResult = await assessment.commit(hashes[0])
            events = utils.getNotificationArgsFromReceipt(commitResult.receipt, 3)
            assert.equal(events[0].topic, 3, "no cancellation event fired")
        })

        it("the assessee is refunded", async () => {
            balanceAfterRefund = await aha.balanceOf.call(assessee.address)
            assert.equal(assessee.balance, balanceAfterRefund.toNumber(), "assessee did not get refunded")
        })

        it("the assessors who committed are refunded", async () => {
            finalBalances = await utils.getBalances(assessors, aha)
            assert.equal(initialBalances[1], finalBalances[1])
        })

        it("the assessor who failed to commit is not", async () => {
            assert.equal(initialBalances[0], finalBalances[0] + cost)
        })
    })

    describe("during the reveal stage:", async () => {
        let assessee = {address: accounts[size+1]}
        it ("An assessment of size 5 is created and assessors are called", async () => {
            aha = await FathomToken.deployed()
            let conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"","0x0")

            assessee.balance = await aha.balanceOf.call(assessee.address)
            assessmentData = await chain.makeAssessment(txResult.logs[0].args["_concept"], assessee.address, cost, size, 1000, timelimit)
            assessment = Assessment.at(assessmentData.address)
            assessors = assessmentData.calledAssessors

            // save the assessee's balance before the last makeAssessment() call
            assessee.balance = (await aha.balanceOf.call(assessee.address)).toNumber() + cost * size
            initialBalances = await utils.getBalances(assessors, aha)
            assert.isAbove(assessors.length, size-1, "not enough assessors were called")
        })

        it ("all five assessors confirm and commit, but only four assessors reveal", async () => {
            await chain.confirmAssessors(assessors.slice(0,size), assessment)
            await chain.commitAssessors(assessors.slice(0,size), hashes, assessment)
            utils.evmIncreaseTime(13*60*60) //let challenge period pass
            await chain.revealAssessors(assessors.slice(1,size), scores.slice(1,size), salts.slice(1,size), assessment)

            stage = await assessment.assessmentStage.call()
            done = await assessment.done.call()

            assert.equal(stage.toNumber(), 3, "did not reach Confirmed stage")
            assert.equal(done.toNumber(), size-1)
        })

        it("the 5th assessor fails to reveal in time and the assessment is cancelled", async () => {
            utils.evmIncreaseTime(timelimit*1.2 + 24*60*60)
            revealResult = await assessment.reveal(scores[0], salts[0])
            events = utils.getNotificationArgsFromReceipt(revealResult.receipt, 3)
            assert.equal(events[0].topic, 3, "no cancellation event fired")
        })

        it("the assessee is refunded", async () => {
            balanceAfterRefund = await aha.balanceOf.call(assessee.address)
            assert.equal(assessee.balance, balanceAfterRefund.toNumber(), "assessee did not get refunded")
        })

        it("the assessors who revealed are refunded", async () => {
            finalBalances = await utils.getBalances(assessors, aha)
            assert.equal(initialBalances[1], finalBalances[1])
        })

        it("the assessor who failed to reveal is not", async () => {
            assert.equal(initialBalances[0], finalBalances[0] + cost)
        })
    })

})
