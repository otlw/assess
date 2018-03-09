var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

// var lotta = require("../js/lotterySim.js")
var assess = require("../js/assessmentFunctions.js")

var accounts = web3.eth.accounts


contract("Lottery:", function(accounts){
    let fathomToken;
    let conceptReg;
    let assessedConcept

    let nAssessments = 2
    let assessments = []
    let assessees = accounts.slice(6,6+nAssessments)

    let cost = 150000;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;
    let scores = Array(size).fill(100)

    describe('First, ' + nAssessments + " assessment(s)...", function() {
        it("... are run until the end", async () => {
            // creating a concept to be assessed in
            conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"")
            let assessedConceptAddress = txResult.logs[0].args["_concept"]
            assessedConcept = await Concept.at(assessedConceptAddress)

            fathomToken = await FathomToken.deployed()

            //run assessments, save related data
            for (let i=0; i<nAssessments; i++) {
                assessments.push(await assess.createAndRunAssessment(assessedConceptAddress, assessees[i], cost, size, waitTime, timeLimit, scores))
                let stage = await assessments[i].assessmentContract.assessmentStage.call()
                assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
            }
        })
    })
})
