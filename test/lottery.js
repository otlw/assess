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
    let assessmentData
    let assessmentContract
    let calledAssessors;
    let assessee = accounts[6]

    let cost = 150000;
    let size = 6;
    let timeLimit = 10000;
    let waitTime = 100;

    describe('First, ', function() {
        it("an assessment is created and user are called to be assessors.", async () =>{
            conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"")
            let assessedConceptAddress = txResult.logs[0].args["_concept"]
            assessedConcept = await Concept.at(assessedConceptAddress)

            fathomToken = await FathomToken.deployed()

            //initiate assessment, save assessors and their initial balance
            assessmentData = await assess.makeAssessment(assessedConceptAddress, assessee, cost, size, waitTime, timeLimit)
            assessmentContract = Assessment.at(assessmentData.address)
            calledAssessors = assessmentData.assessors

            assert.isAbove(calledAssessors.length, size -1, "not enough assessors were called")
        })

       it("an assessment is run until the end", () => {

       })

    })
})
