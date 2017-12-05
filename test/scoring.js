var MathLib = artifacts.require("Math");
utils = require("../js/utils.js")
assess = require("../js/assessmentFunctions.js")
jsAsses = require("../js/simulateAssessment.js")

var accounts = web3.eth.accounts

var maxSize = 9 //the number of accounts created by testrpc 
var stake = 10000
var inflationRate = 1;
//setting random scores
var maxScore = 127;
// radius within two assessors agree
// needs to be the same as Math.sol/consensusRadius
var radius = 13; // 5% of 256
var nTests = 3;
var setups = []
var trueResults = []
for (t=0; t<nTests; t++){
    setup = jsAsses.generateAssessmentDataAtRandom(accounts, maxSize, maxScore, radius, stake, false)
    setups.push(setup)
}
verbose = false

//add custom cases here:
// perfect agreement
setups.push(jsAsses.generateAssessmentData(accounts,[100,100,100,100, 100],radius, stake))
setups.push(jsAsses.generateAssessmentData(accounts,[-7,-6,8,8,9], radius, stake, false))
setups.push(jsAsses.generateAssessmentData(accounts,[0,10,10,10, 10], radius, stake, false))
setups.push(jsAsses.generateAssessmentData(accounts,[10,10,10,60,60,60], radius, stake, false))

contract("Scoring Unit Tests", function(accounts) {
    describe(setups.length + " virtual assessments with random scores and varying sizes are ", async () => {
        outcomes = []
        it("being run.", async () => {
            mathlib  = await MathLib.deployed()
            for (setup of setups) {
                var payouts = []
                //run assessment
                resultInfo = await mathlib.getFinalScore.call(setup.scores)
                // fetch its outcome
                for (var key in setup.assessors) {
                    distance = Math.abs(setup.scores[key] - resultInfo[0].toNumber())
                    payout = await mathlib.getPayout.call(distance,
                                                          stake,
                                                          inflationRate)
                    payouts.push(payout[0].toNumber())
                }
                // save it for later comparisons
                outcomes.push({scores: setup.scores,
                               finalScore: resultInfo[0].toNumber(),
                               largestClusterSize: resultInfo[1].toNumber(),
                               payouts: payouts,
                               payoutsJs: setup.payouts
                              })
            }
            if (verbose) {
                console.log('outcomes: ', outcomes);
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
