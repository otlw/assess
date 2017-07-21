var MathLib = artifacts.require("Math");
var VirtualAssessment = artifacts.require("VirtualAssessment");
utils = require("../js/utils.js")
assess = require("../js/assessmentFunctions.js")
var accounts = web3.eth.accounts

var maxSize = 9 //the number of accounts created by testrpc 
var stake = 10000
var inflationRate = 1;
//setting random scores
var maxScore =  2**64;
var nTests = 5;
var setups = []
var trueResults = []
for (t=0; t<nTests; t++){
    setup = assess.generateSetup(accounts, maxSize, maxScore, stake)
    setups.push(setup)
}

contract("Scoring Unit Tests", function(accounts) {
    describe(nTests + "virtual assessments with random scores and varying sizes are ", async () => {
        outcomes = []
        it("created.", async () => {
            mathlib  = await MathLib.deployed()
            va  = await VirtualAssessment.deployed()
            for (setup of setups) {
                var payouts = []
                //run assessment
                await va.init(setup.scores, setup.stake)
                await va.calculateResult()
                await va.payout()
                // fetch its outcome
                var finalScore = await va.finalScore.call()
                var largestClusterSize = await va.largestClusterSize.call()
                for (var key in setup.assessors) {
                    payout = await va.payouts.call(key)
                    payouts.push(payout.toNumber())
                }
                // save it for later comparisons
                outcomes.push({finalScore: finalScore.toNumber(),
                               largestClusterSize: largestClusterSize.toNumber(),
                                payouts: payouts
                              })
            await va.reset()
            }
        })

        it("The biggest cluster is chosen.", async () => {
            for (key in setups) {
                assert.equal(outcomes[key].largestClusterSize, setups[key].largestClusterSize , "clustering was not correct")
            }
        })

        it("The final score is calculated.", async () => {
            for (key in setups){
                scoredifference = Math.abs(setups[key].finalScore - outcomes[key].finalScore)
                assert.isBelow(scoredifference, maxScore/1000, "finalScore was not correct")
            }
        })

        it("Payouts are distributed accordingly.", async () => {
            for (key in setups){
                for (i=0; i<setups[key].assessors.length; i++){
                    payoutdifference = Math.abs(setups[key].payouts[i] - outcomes[key].payouts[i])
                    assert.isBelow(payoutdifference, stake/100, "payout was not correct")
                }
            }
        })
    })
 })
