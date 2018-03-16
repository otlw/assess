var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Minter = artifacts.require("Minter");

var BigNumber = require('bignumber.js');
var lotta = require("../js/lotterySim.js")
var assess = require("../js/assessmentFunctions.js")

contract("Lottery:", function(accounts){
    let fathomToken;
    let conceptReg;
    let minter
    let assessedConcept

    let nAssessments = 2
    let assessments = []
    let assessees = accounts.slice(6,6+nAssessments)

    let cost = 50;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;
    let scores = Array(size).fill(100)
    let salts = [
        Array(size).fill(100),
        Array(size).fill(9)
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
                let stage = await assessments[i].assessmentContract.assessmentStage.call()
                assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
                // console.log("assessment" + i + " at address" + assessments[i].assessmentContract.address)
                // console.log("assessors:" + assessments[i].calledAssessors)
                // console.log("assessee:" + assessees[i])
            }
        })
    })

    describe('The lottery-library...', function() {

        it("generates the same ticket as the Minter.sol contract", async () => {

            minter = await Minter.deployed()
            // idea: submit bids for different tokenSalts, different assessors,
            // different assessments & see whether the Minter's closestDistance
            // changes accordingly
            // let goalHex = await minter.epochHash.call()
            // let goal = web3.toDecimal(goalHex)
            // let goalBN = new BigNumber(goal)
            // console.log("goalAsNumber ", goal)
            // console.log("goal ", goal, goalBN)

            // generate Tickets from different assesors, from different
            // assessments with different tokenSalts
            let tickets = []
            for (let assessment of assessments) { // assumes nAssessments > 1
                // console.log("assessment ", assessment.address )
                let assessmentSaltHex = await assessment.assessmentContract.salt.call()
                // let salt = web3.toDecimal(assessmentSaltHex)
                // console.log("assessment salt as hex: ", assessmentSaltHex)
                for (let assessor of assessment.calledAssessors.slice(0,2)) {
                    for (let i=0; i<10; i++) { // assumes cost > 9
                        tickets.push({
                            inputs: {
                                assessor: assessor,
                                assessment: assessment.address,
                                tokenSalt: i,
                                salt: assessmentSaltHex
                            },
                            hash: lotta.hashTicket(
                                assessment.address,
                                assessor,
                                i,
                                // web3.toHex(assessmentSaltHex)),
                                assessmentSaltHex)
                        })
                        console.log("inputs", tickets[i].inputs.assessor, tickets[i].inputs.assessment, tickets[i].inputs.tokenSalt, tickets[i].inputs.salt)

                        let hashByMinter = await minter.getHash.call(tickets[i].inputs.assessor, tickets[i].inputs.assessment, tickets[i].inputs.tokenSalt, tickets[i].inputs.salt)
                        console.log("hashByMinter ", hashByMinter )
                        console.log("hashBySim ", tickets[i].hash )

                        //another call to throw events:
                        let hashByMinter4Event = await minter.getHash(assessor, assessment.address, i, assessmentSaltHex)

                        assert.equal(tickets[i].hash, hashByMinter)
                        assert(false)
                    }
                }
            }
            // // submit tickets and see if closestDistance changes as expected
            // let closestDistanceByMinter = await minter.closestDistance.call()
            // for (let ticket of tickets) {
            //     await minter.submitBid(ticket.inputs.assessor, ticket.inputs.assessment, ticket.inputs.tokenSalt)
            //     let dist = Math.abs(goal - web3.toDecimal(ticket.hash)) //BN?
            //     let closestDistanceByMinterAfter = (await minter.closestDistance.call()).toNumber()
            //     if (dist > closestDistanceByMinter) {
            //         //check for no change in closestDistance
            //         assert.equal(closestDistanceByMinterAfter, closestDistanceByMinter, "the bestDistance of the minter changed when it shouldnt have")
            //     } else {
            //         // check whether the assessor is saved as winner
            //         let winnerByMinter = await minter.winner.call()
            //         assert.equal(winnerByMinter, ticket.inputs.assessor, "the assessor was not saved as winner, despite a closer ticket")
            //         // check whether it has decreased
            //         assert.isBelow(closestDistanceByMinterAfter, closestDistanceByMinter, "the bestDistance of the minter did not decrease despite a closer ticket")
            //         // set new closestDistance
            //         closestDistanceByMinter = closestDistanceByMinterAfter
            //         // assert.equal(closestDistanceByMinterAfter, dist, "the minter resulted in a different hash than the simulation") //TODO
            //     }
            // }
            // assert(false)
        })

        it("selects the winning ticket of all assessments", async () => {

            let block0 = (await web3.eth.getBlock('earliest'))
            let blockZ = (await web3.eth.getBlock('latest'))

            let epochLength = blockZ.number + 1

            // lotta.runLottery(web3, block0.number, epochLength, fathomToken.address, function(result) {
                // console.log("result", result)
                // assert.equal(result.assessments, nAssessments, "not all assessments were found")
            // })
        })

    })
})
