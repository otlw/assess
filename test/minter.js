var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

var utils = require("../js/utils.js")
var chain = require("../js/assessmentFunctions.js")



contract("Minting New Tokens:", function(accounts) {
    let conceptReg
    let fathomToken
    let minter
    let assessedConcept
    let assessees
    let assessments
    let cost
    let startTime
    let endTime
    let size

    describe ("Initially,", async () => {
        it ("a concept is created .", async () => {
            conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"")
            assessedConcept = await Concept.at(txResult.logs[0].args["_concept"])

            assert.isTrue( await conceptReg.conceptExists.call(assessedConcept.address))
        })
        it ("an assessment is run until the end (one assessors failing to reveal)", async () => {
        })
    })
    describe("During the epoch, the minter,", async () => {
        it("accepts bids from finished assessments.", async () => {
        })
        it("rejects bids from unrelated addressess and assessors that have not completed the assessment.", async () => {
        })
        it("rejects bids if the token-salt is too high.", async () => {
        })
        it("can not mint tokens.")
    })
    describe ("After the epoch, the minter,", async () => {
        it("rejects bids from assessments from another epoch.", async () => {
        })
        it("mints new tokens to the winner.", async () => {
        })
    })
})
