var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Minter = artifacts.require("Minter");

var utils = require("../js/utils.js")
var chain = require("../js/assessmentFunctions.js")



contract("Minting New Tokens:", function(accounts) {
    let conceptReg
    let fathomToken
    let minter
    let assessedConcept
    let assessees = accounts.slice(7,9)
    let assessment
    let cost = 50;
    let size = 6;
    let waitTime = 50;
    let timeLimit = 1000;
    let scores = Array(size).fill(100)
    let epochLength

    describe ("Initially,", async () => {
        it ("a concept is created", async () => {
            conceptReg = await ConceptRegistry.deployed()
            let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"")
            assessedConcept = await Concept.at(txResult.logs[0].args["_concept"])
            fathomToken = await FathomToken.deployed()
            assert.isTrue( await conceptReg.conceptExists.call(assessedConcept.address))
        })

        it ("an assessment is run until the end (one assessors failing to reveal)", async () => {
            assessment = await chain.createAndRunAssessment(
                assessedConcept.address,
                assessees[0],
                cost, size, waitTime, timeLimit,
                scores, -1
            )
            let stage = await assessment.instance.assessmentStage.call()
            assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
        })
        describe("During the epoch, the minter...", async () => {
            itAgora("accepts bids from finished assessments", async () => {
                minter = await Minter.deployed()
                await minter.submitBid(assessment.calledAssessors[0], assessment.address, cost-3)
                assert.equal(assessment.calledAssessors[0], await minter.winner.call())
            })

            it("rejects bids from addressess that have not revealed a score", async () => {
                try {
                    await minter.submitBid(assessees[0], assessment.address, cost-3)
                } catch (e) {
                    if (e.toString().indexOf('revert') > 0) {
                        assert(true)
                    } else {
                        assert(false, e.toString(), "bid could be submitted by foreign address")
                    }
                }
            })

            it("rejects bids if the token-salt is too high", async () => {
                try {
                    await minter.submitBid(assessment.calledAssessors[0], assessment.address, cost+1)
                } catch (e) {
                    if (e.toString().indexOf('revert') > 0) {
                        assert(true)
                    } else {
                        assert(false, e.toString(), "a bid with too high a salt could be submitted")
                    }
                }
            })

            it("rejects bids from assessments ending in another epoch", async () => {
                //create new assessment with longer timescale
                epochLength = (await minter.epochLength.call()).toNumber()
                let assessment2 = await chain.createAndRunAssessment(
                    assessedConcept.address,
                    assessees[1],
                    cost, size, waitTime, epochLength*2, // assessment-params
                    scores, -1 // scores & default salts
                )
                let stage = await assessment2.instance.assessmentStage.call()
                assert.equal(stage.toNumber(), 4, "assessment did not move to stage done")
                try {
                    await minter.submitBid(assessment2.calledAssessors[0], assessment2.address, 1)
                } catch (e) {
                    if (e.toString().indexOf('revert') > 0) {
                        assert(true)
                    } else {
                        assert(false, e.toString(), "a bid was submitted based on an assessment from a future epoch")
                    }
                }
            })

            it("can not be prompted to mint tokens", async () => {
                try {
                    await minter.endEpoch()
                } catch (e) {
                    if (e.toString().indexOf('revert') > 0) {
                        assert(true)
                    } else {
                        assert(false, e.toString(), "minter minted tokens before end of epoch")
                    }
                }
            })
        })

        describe ("After the epoch, the minter...", async () => {
            it("mints new tokens to the winner", async () => {
                await utils.evmIncreaseTime(epochLength)
                let winner = await minter.winner.call()
                let balanceBefore = await fathomToken.balanceOf.call(winner)
                await minter.endEpoch()
                let balanceAfter = await fathomToken.balanceOf.call(winner)
                assert.isAbove(balanceAfter.toNumber(), balanceBefore.toNumber(), "winner did not receive minted Tokens")
            })
            it("and starts a new epoch", async () => {
                assert(await minter.winner.call(), 0x0, "winner was not reset")
                assert(await minter.closestDistance.call(), 0, "winner was not reset")
            })
        })
    })
})

