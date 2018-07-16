var ConceptRegistry = artifacts.require('ConceptRegistry')
var FathomToken = artifacts.require('FathomToken')
var Concept = artifacts.require('Concept')
var Assessment = artifacts.require('Assessment')

var utils = require('../js/utils.js')
var chain = require('../js/assessmentFunctions.js')

var nInitialUsers = 6
var gasPrice = 1000000000 // safe low cost
var etherPrice = 460 // as of 11/17

contract('Assessment', function (accounts) {
  let aha
  let conceptReg

  let assessedConcept
  let assessmentContract
  let assessmentData

  let cost = 10000000
  let size = 5
  let timeLimit = 100000000
  let waitTime = 100

  let calledAssessors = []
  let confirmedAssessors = []
  let assessee = accounts[nInitialUsers + 1]
  let assesseeInitialBalance
  let outsideUser = accounts[nInitialUsers + 2]

  let score = 1000
  let scores = []
  let salts = []
  let hashes = []

  for (let i = 0; i < nInitialUsers; i++) {
    scores.push(score)
    salts.push(i.toString())
    hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
  }

  let receiptFromMakeAssessment
  var gasCosts = []

  describe('Before the assessment', function () {
    it('A concept is created', async () => {
      conceptReg = await ConceptRegistry.deployed()
      let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]), [500], 60 * 60 * 24, '', '0x0')
      assessedConcept = await Concept.at(txResult.logs[0].args['_concept'])

      assert.isTrue(await conceptReg.conceptExists.call(assessedConcept.address))
    })

    it('users should have enough tokens', async () => {
      aha = await FathomToken.deployed()
      assesseeInitialBalance = await aha.balanceOf.call(assessee)

      assert.isAbove(assesseeInitialBalance.toNumber(), cost * size)
    })
  })

  describe('Concept', function () {
    it('should throw if assessmentSize < 5', async () => {
      try {
        await assessedConcept.makeAssessment(cost, 3, waitTime, timeLimit)
      } catch (e) {
        if (e.toString().indexOf('revert') > 0) {
          return assert(true)
        } else {
          return assert(false, e.toString())
        }
      }
      assert(false)
    })
    it('should initiate an assessment', async () => {
      assessmentData = await chain.makeAssessment(assessedConcept.address, assessee, cost, size, waitTime, timeLimit)
      receiptFromMakeAssessment = assessmentData.txResult.receipt

      gasCosts.push({function: 'makeAssessment',
        cost: {
          ether: web3.fromWei(receiptFromMakeAssessment.gasUsed * gasPrice, 'ether'),
          $: utils.weiToDollar((receiptFromMakeAssessment.gasUsed * gasPrice).toString(), etherPrice)
        }})

      assessmentContract = Assessment.at(assessmentData.address)
      console.log('assessmentaddress ', assessmentData.address)

      assert.isTrue(await assessedConcept.assessmentExists.call(assessmentContract.address), "the assessment hasn't been created")
      assert(false)
    })

    it('should charge the assessee', async () => {
      const balance = await aha.balanceOf.call(assessee)
      assert.equal(balance.toNumber(), assesseeInitialBalance - cost * size, 'the assessee did not get charged correctly')
    })
  })

  describe('In assessment stage', function () {
    let receiptFromLastReveal
    let assessorInitialBalance

    describe('Called', function () {
      it('should call the assessors', async () => {
        calledAssessors = assessmentData.calledAssessors
        assert.isAtLeast(calledAssessors.length, size, 'not enough assesssors got added to the pool')
      })

      describe('When assessors confirm', async () => {
        it('they should be rejected if they have not been called', async () => {
          let balanceBefore = await aha.balanceOf.call(outsideUser)
          await assessmentContract.confirmAssessor({from: outsideUser})
          let balanceAfter = await aha.balanceOf.call(outsideUser)

          assert.equal(balanceBefore.toNumber(), balanceAfter.toNumber(), 'an uncalled assessor could stake')
        })

        it('they should be charged', async () => {
          confirmedAssessors = calledAssessors.slice(0, size)
          assessorInitialBalance = await aha.balanceOf.call(confirmedAssessors[0])
          await chain.confirmAssessors(confirmedAssessors, assessmentContract)
          let balanceAfter = await aha.balanceOf.call(confirmedAssessors[0])

          assert.equal(balanceAfter, assessorInitialBalance - cost)
        })

        it('should move to the called stage if enough confirmed', async () => {
          let assessmentStage = await assessmentContract.assessmentStage.call()
          assert.equal(assessmentStage, 2, 'the assessment', 'the assessment did not enter called stage')
        })

        it('should wait some time', function () {
          return utils.evmIncreaseTime(2000)
        })
      })
    })

    describe('Confirmed', function () {
      let receiptFromLastCommit

      it('commits from non-assessors should be rejected', async () => {
        let doneBefore = await assessmentContract.done.call()
        await assessmentContract.commit(web3.sha3('random'), {from: outsideUser})
        let doneAfter = await assessmentContract.done.call()

        assert.equal(doneBefore.toNumber(), doneAfter.toNumber(), 'an unconfirmed assessor could commit')
        assert.equal(doneAfter.toNumber(), 0, 'done was increased')
      })

      it('should accept commits from confirmed assessors', async () => {
        await chain.commitAssessors(confirmedAssessors.slice(1), hashes.slice(1), assessmentContract)
        let doneAfter = await assessmentContract.done.call()
        assert.equal(doneAfter.toNumber(), confirmedAssessors.length - 1, "a confirmed assessor couldn't commit")
      })

      it('should move to committed stage when all commited', async () => {
        let txResult = await assessmentContract.commit(hashes[0], {from: confirmedAssessors[0]})
        receiptFromLastCommit = txResult.receipt
        gasCosts.push({function: 'commit',
          cost: {
            ether: web3.fromWei(receiptFromLastCommit.gasUsed * gasPrice, 'ether'),
            $: utils.weiToDollar((receiptFromLastCommit.gasUsed * gasPrice).toString(), etherPrice)
          }
        })

        let stage = await assessmentContract.assessmentStage.call()
        assert.equal(stage.toNumber(), 3, 'assessment did not enter commit stage')

        let done = await assessmentContract.done.call()
        assert.equal(done.toNumber(), 0, "done wasn't reset")
      })
    })

    describe('Committed', function () {
      it('committed assessors can reveal their scores', async () => {
        await utils.evmIncreaseTime(60 * 60 * 13) // let 12h challenge period pass
        let nAssessors = confirmedAssessors.length

        await chain.revealAssessors(confirmedAssessors.slice(1, nAssessors),
          scores.slice(1, nAssessors),
          salts.slice(1, nAssessors),
          assessmentContract)

        let done = await assessmentContract.done.call()
        assert.equal(done.toNumber(), nAssessors - 1, "at least one assessors couldn't reveal")
      })

      it('should move to the done stage when all assessors have revealed', async () => {
        let result = await assessmentContract.reveal(scores[0],
          salts[0],
          {from: confirmedAssessors[0]})

        receiptFromLastReveal = result.receipt
        gasCosts.push({function: 'last Reveal + calculate + payout',
          cost: {
            ether: web3.fromWei(receiptFromLastReveal.gasUsed * gasPrice, 'ether'),
            $: utils.weiToDollar((receiptFromLastReveal.gasUsed * gasPrice).toString(), etherPrice)
          }
        })

        let stage = await assessmentContract.assessmentStage.call()
        assert.equal(stage.toNumber(), 4, 'assessment did not enter done stage')
      })
    })

    describe('Done', function () {
      it("should calculate the assessee's score", async () => {
        let finalScore = await assessmentContract.finalScore.call()
        assert.equal(finalScore.toNumber(), score, 'score not calculated correctly')
      })

      describe('The assessee', function () {
        let weight

        it('is added to the concept', async () => {
          let weightInConcept = await assessedConcept.getWeight.call(assessee)
          weight = weightInConcept.toNumber()
          assert.isAbove(weight, 0, "the assesee doesn't have a weight in the concept")
        })

        it('is added to the parent at half weight', async () => {
          let parentConcept = await Concept.at(await assessedConcept.parents.call(0))
          let weightInParent = await parentConcept.getWeight.call(assessee)

          assert.isAbove(weightInParent.toNumber(), 0, "the assesse doesn't have a weight in the parent")
          assert.equal(weight / 2, weightInParent.toNumber(), "the assessee didn't have half weight in parent")
        })

        it('should not be called for assessments', async () => {
          let newAssessmentData = await chain.makeAssessment(assessedConcept.address, outsideUser, cost, size, waitTime, timeLimit)
          let calledAssessors = newAssessmentData.calledAssessors
          assert.isFalse(calledAssessors.includes(assessee))
        })

        it('should be called as an assessor if they toggle available', async () => {
          let mew = await Concept.at(await conceptReg.mewAddress())
          await mew.toggleAvailability({from: assessee})

          let newAssessmentData = await chain.makeAssessment(assessedConcept.address, outsideUser, cost, size, waitTime, timeLimit)
          let calledAssessors = newAssessmentData.calledAssessors
          assert.isTrue(calledAssessors.includes(assessee))
        })
      })

      describe('The Assessor', function () {
        it('should be paid', async () => {
          let balanceAfter = await aha.balanceOf.call(confirmedAssessors[0])
          assert.equal(balanceAfter.toNumber(), assessorInitialBalance.toNumber() + cost, "assessor didn't get paid")
        })
      })

      describe('Gast costs', function () {
        it('Analysis:', async () => {
          let stage = await assessmentContract.assessmentStage.call()
          assert.equal(stage.toNumber(), 4, 'gas measured before assessment is done')
          console.log('Assuming GasPrice: ' + gasPrice + '  and 1 ether = $' + etherPrice)
          console.log('gasCosts: ', gasCosts)
        })
      })
    })
  })
})
