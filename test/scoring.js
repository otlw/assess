var MathLib = artifacts.require("Math");
utils = require("../js/utils.js")
assess = require("../js/assessmentFunctions.js")
jsAsses = require("../js/simulateAssessment.js")

var accounts = web3.eth.accounts

var maxSize = 9 //the number of accounts created by testrpc 
var stake = 10000
var inflationRate = 1;
//setting random scores
var maxScore = 1000;// 2**64;
var nTests = 5;
var setups = []
var trueResults = []
for (t=0; t<nTests; t++){
    setup = jsAsses.generateRandomSetup(accounts, maxSize, maxScore, stake)
    setups.push(setup)
}
// flag to generate output
var verbose = true

//add special edgecases here:

// perfect agreement
setups.push(jsAsses.generateSetup(accounts,[1000,1000,1000,1000, 1000], stake))

//draw (should go for lower score)
setups.push(jsAsses.generateSetup(accounts,[200, 200, 200, 1000, 1000, 1000], stake))
setups.push(jsAsses.generateSetup(accounts,[200, 200, 200, 10, 10, 10], stake))
setups.push(jsAsses.generateSetup(accounts,[200, 200, 200, 180, 180, 180], stake))

contract("Scoring Unit Tests", function(accounts) {
    describe(setups.length + " virtual assessments with random scores and varying sizes are ", async () => {
        outcomes = []
        it("being run.", async () => {
            mathlib  = await MathLib.deployed()
            for (setup of setups) {
                var payouts = []
                //run assessment
                mad = (await mathlib.calculateMAD.call(setup.scores, setup.scores.length)).toNumber()
                resultInfo = await mathlib.getFinalScore.call(setup.scores, mad)
                // fetch its outcome
                for (var key in setup.assessors) {
                    distance = Math.abs(setup.scores[key] - resultInfo[0].toNumber())
                    payout = await mathlib.getPayout.call(distance,
                                                          mad,
                                                          stake,
                                                          inflationRate
                                                         )
                    payouts.push(payout.toNumber())
                }
                // save it for later comparisons
                outcomes.push({scores: setup.scores,
                               finalScore: resultInfo[0].toNumber(),
                               largestClusterSize: resultInfo[1].toNumber(),
                                payouts: payouts
                              })
            }
            if (verbose) {
                console.log(outcomes)
            }
        })

        it("The biggest cluster is chosen.", async () => {
            for (key in setups) {
                assert.equal(outcomes[key].largestClusterSize, setups[key].largestClusterSize , "clustering was not correct")
            }
        })

        it("The final score is calculated.", async () => {
            for (key in setups){
                assert.equal(outcomes[key].finalScore, setups[key].finalScore, "finalScore was not correct")
            }
        })

        it("Payouts are distributed accordingly.", async () => {
            for (key in setups){
                for (i=0; i<setups[key].assessors.length; i++){
                    assert.equal(outcomes[key].payouts[i],
                                 setups[key].payouts[i],
                                 "payout of assessor " + i + " was not correct: " +
                                 outcomes[key].payouts[i]  + " instead of " + setups[key].payouts[i] +
                                 " \n scores are: " + setups[key].scores +
                                 " \n correct cluster is: " + setups[key].clusterMask + "\n")
                }
            }
        })
    })
 })
