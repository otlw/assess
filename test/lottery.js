var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Minter = artifacts.require("Minter");

var BigNumber = require('bignumber.js');
var assess = require("../js/assessmentFunctions.js")
var utils = require("../js/utils.js")
var jsAsses = require("../js/simulateAssessment.js")

contract("Lottery Unit Tests:", function(accounts){
    let fathomToken;
    let conceptReg;
    let minter
    let assessedConcept

    let nAssessments = 2
    let nAssessors = 2 // assessors to generate tickets for
    let nSalts = 5 // how many tickets to generate per assessor
    let assessments = []
    let assessees = accounts.slice(6,6+nAssessments)

    let cost = 50;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;
    let scores = Array(size).fill(100)
    let salts = [
        Array(size).fill('hi'),
        Array(size).fill('hihih')
    ]

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
                assessments.push(await assess.createAndRunAssessment(assessedConcept.address, assessees[i], cost, size, waitTime, timeLimit, scores, salts[i]))
                let stage = await assessments[i].instance.assessmentStage.call()
                assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
            }
        })

        describe(nAssessments * nAssessors * nSalts + ' tickets are submitted...', function() {

            it("and the minter is updated if the distance of the hashed ticket is smaller", async () => {
                minter = await Minter.deployed()
                let goal = await minter.epochHash.call()
                let tickets = await utils.generateTickets(assessments, 2, 10)
                for (let ticket of tickets) {
                    ticket.hashAsInt = new BigNumber(ticket.hash)
                    let ticketDistance = (goal > ticket.hashAsInt) ? goal.minus(ticket.hashAsInt) : ticket.hashAsInt.minus(goal)
                    ticketDistance.s = 1 //weird workaround, because sometimes the distance comes out negative

                    // submit tickets
                    let closestDistanceByMinter = await minter.closestDistance.call()
                    await minter.submitBid(ticket.inputs.assessor, ticket.inputs.assessment, ticket.inputs.tokenSalt)
                    let closestDistanceByMinterAfter = await minter.closestDistance.call()

                    // and see if closestDistance and winner change as expected
                    if (ticketDistance.toNumber() < closestDistanceByMinter.toNumber()) {
                        let winnerByMinter = await minter.winner.call()
                        assert.equal(winnerByMinter, ticket.inputs.assessor, "the assessor was not saved as winner, despite a closer ticket")
                        assert.isBelow(closestDistanceByMinterAfter.toNumber(), closestDistanceByMinter.toNumber(), "the bestDistance of the minter did not decrease despite a closer ticket")
                    } else {
                        assert.equal(closestDistanceByMinterAfter.toNumber(), closestDistanceByMinter.toNumber(), "the closest distance changed without the ticket being a winner")
                    }
                }
            })
        })
    })
})

