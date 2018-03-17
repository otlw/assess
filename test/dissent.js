var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

var utils = require("../js/utils.js")
var chain = require("../js/assessmentFunctions.js")


contract ("Dissenting assessors:", (accounts) => {
    let assessee = {address: accounts[5]}
    let assessors;

    let finalBalances;
    let initialBalances;

    let size = 5;
    let cost = 20;
    let assessment
    let aha

    let scores = [0,200,200,200,200]
    let salts = Array(5).fill("hihihi")

    let hashes = []
    for (i=0; i<scores.length; i++){
        hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
    }

    it ("An assessment runs until the end", async () => {
        aha = await FathomToken.deployed()
        let conceptReg = await ConceptRegistry.deployed()

        assessee.balance = await aha.balanceOf.call(assessee.address)
        let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"")
        let assessedConceptAddress = txResult.logs[0].args["_concept"]
        assessmentData = await chain.makeAssessment(assessedConceptAddress, assessee.address, cost, size, 1000, 2000)
        assessment = Assessment.at(assessmentData.address)
        assessors = assessmentData.calledAssessors

        initialBalances = await utils.getBalances(assessors, aha)
        await chain.confirmAssessors(assessors.slice(0,size), assessment)
        utils.evmIncreaseTime(13)
        await chain.commitAssessors(assessors.slice(0,size), hashes, assessment)
        utils.evmIncreaseTime(13*60*60) // wait challenge period
        await chain.revealAssessors(assessors.slice(0,size), scores, salts, assessment)
        stage = await assessment.assessmentStage.call()

        assert.equal(stage.toNumber(), 4, "did not reach Committed stage")
    })

    it("the dissenting assessors stake is redistributed amongst the other assessors", async () => {
        finalBalances = await utils.getBalances(assessors, aha)
        assert.equal(finalBalances[1], initialBalances[1] + cost + cost/4, "inAssessors did not get more")
        assert.equal(finalBalances[0], initialBalances[0] - cost, "dissenting assessor was not charged")
    })

})

