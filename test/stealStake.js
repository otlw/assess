var ConceptRegistry = artifacts.require('ConceptRegistry')
var FathomToken = artifacts.require('FathomToken')
var Concept = artifacts.require('Concept')
var Assessment = artifacts.require('Assessment')

var utils = require('../js/utils.js')
var chain = require('../js/assessmentFunctions.js')

var nInitialUsers = 6

contract('Steal Stake:', function (accounts) {
  let aha

  let assessedConcept
  let assessmentContract

  let cost = 1500
  let size = 5
  let timeLimit = 10000
  let waitTime = 10

  let calledAssessors
  let confirmedAssessors
  let assessee = accounts[nInitialUsers + 1]
  let outsideUser = accounts[nInitialUsers + 2]

  let scores = []
  let salts = []
  let hashes = []
  for (i = 0; i < nInitialUsers; i++) {
    scores.push(10)
    salts.push(i.toString())
    hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
  }

  it('An assessment is created and users are called to be assessors.', async () => {
    let conceptReg = await ConceptRegistry.deployed()
    let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]), [500], 60 * 60 * 24, '', '0x0')
    let assessedConceptAddress = txResult.logs[0].args['_concept']
    aha = await FathomToken.deployed()

    // initiate assessment, save assessors and their initial balance
    let assessmentData = await chain.makeAssessment(assessedConceptAddress, assessee, cost, size, waitTime, timeLimit)
    assessmentContract = Assessment.at(assessmentData.address)
    calledAssessors = assessmentData.calledAssessors

    assert.isAbove(calledAssessors.length, size - 1, 'not enough assessors were called')
  })

  it('Called assessors stake to confirm.', async () => {
    confirmedAssessors = calledAssessors.slice(0, size)
    let initialBalanceAssessors = await utils.getBalances(confirmedAssessors, aha)
    await chain.confirmAssessors(confirmedAssessors, assessmentContract)
    let balancesAfter = await utils.getBalances(confirmedAssessors, aha)
    assert.equal(balancesAfter[0], initialBalanceAssessors[0] - cost, 'stake did not get taken')

    let stage = await assessmentContract.assessmentStage.call()
    assert.equal(stage.toNumber(), 2, 'assessment did not move to stage confirmed')
  })

  it('Assessors commit their hashed scores and the assessment advances.', async () => {
    await utils.evmIncreaseTime(60)
    await chain.commitAssessors(confirmedAssessors,
      hashes,
      assessmentContract)
    let stage = await assessmentContract.assessmentStage.call()
    assert.equal(stage.toNumber(), 3, 'assessment did not move to stage reveal')
  })

  describe('If assessors reveal their own score', function () {
    it('an error is thrown if they try to do so before the end of the 12h challenge period', async () => {
      try {
        await assessmentContract.reveal(scores[0], salts[0], {from: confirmedAssessors[0]})
      } catch (e) {
        if (e.toString().indexOf('revert') > 0) {
          return assert(true, "a 'revert' is thrown")
        } else {
          return assert(false, e.toString(), 'execution should have failed with a revert')
        }
      }
      assert(false)
    })

    it('they are marked as done, and the assessment progresses.', async () => {
      await utils.evmIncreaseTime(60 * 60 * 13) // let 12h challenge period pass
      let doneBefore = await assessmentContract.done.call()
      await assessmentContract.reveal(scores[0], salts[0], {from: confirmedAssessors[0]})
      let doneAfter = await assessmentContract.done.call()
      assert.equal(doneAfter.toNumber(), doneBefore.toNumber() + 1, 'the assessment did not progress')
    })
  })

  describe("If someone else steals an assessor's score", function () {
    var balanceBeforeSteal
    it('the assessor is burned and the size of the assessment reduced.', async () => {
      balanceBeforeSteal = await aha.balanceOf.call(outsideUser)

      let sizeBeforeSteal = await assessmentContract.size.call()
      await assessmentContract.steal(scores[1], salts[1], confirmedAssessors[1], {from: outsideUser})
      let sizeAfterSteal = await assessmentContract.size.call()
      assert.equal(sizeAfterSteal.toNumber(),
        sizeBeforeSteal.toNumber() - 1,
        "the assessment's size did not get reduced.")

      let burnedAssessorState = await assessmentContract.assessorState.call(confirmedAssessors[1])
      assert.equal(burnedAssessorState.toNumber(), 5, 'the assessor did not get burned')
    })

    it('and his stake is given to the account who revealed it.', async () => {
      let balance = await aha.balanceOf.call(outsideUser)
      assert.equal(balance.toNumber(),
        balanceBeforeSteal.toNumber() + cost / 2,
        'stake was not given to the stealer')
    })
  })

  describe('If an assessors waits too long to reveal his score', async () => {
    it('their stake is burned and the assessment moves on', async () => {
      await utils.evmIncreaseTime(60 * 60 * 130) // let latest revealTime pass
      await assessmentContract.reveal(scores[2], salts[2], {from: confirmedAssessors[2]})
      // the assessor will get burned and as as a result the assessment should be cancelled and the assessmentContract destroyed
      try {
        await assessmentContract.size.call()
      } catch (e) {
        if (e.toString().indexOf('Attempting') > 0) {
          return assert(true, 'the contract should have been destroyed')
        } else {
          return assert(false, e.toString())
        }
      }
      assert(false)
    })
  })
})
