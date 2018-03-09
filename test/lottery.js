var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

var lotta = require("../js/lotterySim.js")
var assess = require("../js/assessmentFunctions.js")

var accounts = web3.eth.accounts


contract("Lottery:", function(accounts){
    let fathomToken;
    let conceptReg;
    let assessedConcept

    let nAssessments = 1
    let assessments = []
    let assessees = accounts.slice(6,6+nAssessments)

    let cost = 150000;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;
    let scores = Array(size).fill(100)

    describe('First, ', function() {
        it(" a concept is created", async () => {
            // creating a concept to be assessed in
            conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"")
            let assessedConceptAddress = txResult.logs[0].args["_concept"]
            assessedConcept = await Concept.at(assessedConceptAddress)
            fathomToken = await FathomToken.deployed()
        })
        it(" " + nAssessments + " assessment(s) are created and run until the end", async () => {
            //run assessments, save related data
            for (let i=0; i<nAssessments; i++) {
                assessments.push(await assess.createAndRunAssessment(assessedConcept.address, assessees[i], cost, size, waitTime, timeLimit, scores))
                let stage = await assessments[i].assessmentContract.assessmentStage.call()
                assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
            }
        })
    })

    describe('The lottery-library...', function() {
        it("is used to filter for all finished assessments", async () => {

            let block0 = (await web3.eth.getBlock('earliest'))
            let blockZ = (await web3.eth.getBlock('latest'))

            let epochLength = blockZ.number - block0.number + 1

            lotta.getAllAssessments(web3, block0.number, epochLength, fathomToken.address, function(err, assessments) {
                if (!err) {
                    console.log("found assessments", assessments)
                } else {
                    console.log("err", err)
                }
            })
        })
    })
})
