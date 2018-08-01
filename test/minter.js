var ConceptRegistry = artifacts.require('ConceptRegistry')
var FathomToken = artifacts.require('FathomToken')
var Concept = artifacts.require('Concept')
var Minter = artifacts.require('Minter')

var BigNumber = require('bignumber.js')
var utils = require('../js/utils.js')
var chain = require('../js/assessmentFunctions.js')

contract('Minting New Tokens:', function (accounts) {
  let conceptReg
  let fathomToken
  let minter
  let assessedConcept
  let assessees = accounts.slice(7, 9)
  let assessment
  let cost = 50
  let size = 6
  let waitTime = 50
  let timeLimit = 1000
  let scores = Array(size - 1).fill(100)
  scores.push(20)
  let epochLength
  let foundation = { address: accounts[9] }

  describe('Initially,', async () => {
    it('a concept is created', async () => {
      conceptReg = await ConceptRegistry.deployed()
      let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]), [500], 60 * 60 * 24, '', '0x0')
      assessedConcept = await Concept.at(txResult.logs[0].args['_concept'])
      fathomToken = await FathomToken.deployed()
      assert.isTrue(await conceptReg.conceptExists.call(assessedConcept.address))
    })

    it('an assessment is run until the end', async () => {
      assessment = await chain.createAndRunAssessment(
        assessedConcept.address,
        assessees[0],
        cost, size, waitTime, timeLimit,
        scores, -1
      )
      let stage = await assessment.instance.assessmentStage.call()
      assert.equal(stage.toNumber(), 4, 'assessment did not move to stage done')
    })

    it('the owner can set where the tax should go by default', async () => {
      minter = await Minter.deployed()
      await minter.setDefaultBeneficiary(foundation.address)
      let defaultBeneficiary = await minter.defaultBeneficiary.call()
      assert.equal(foundation.address, defaultBeneficiary)
    })

    describe('During the epoch, the minter...', async () => {
      it('accepts bids from finished assessments', async () => {
        await minter.submitTicket(assessment.calledAssessors[0], assessment.address, cost - 3)
        assert.equal(assessment.calledAssessors[0], await minter.winner.call())
      })

      // describe(nAssessments * nAssessors * nSalts + ' tickets are submitted...', function() {

      it('updates the winner if the distance of a hashed ticket is smaller', async () => {
        let goal = await minter.epochHash.call()
        let tickets = await utils.generateTickets([assessment], 2, 10)
        for (let ticket of tickets) {
          ticket.hashAsInt = new BigNumber(ticket.hash)
          let ticketDistance = (goal > ticket.hashAsInt) ? goal.minus(ticket.hashAsInt) : ticket.hashAsInt.minus(goal)
          ticketDistance.s = 1 // weird workaround, because sometimes the distance comes out negative

          // submit tickets
          let closestDistanceByMinter = await minter.closestDistance.call()
          await minter.submitTicket(ticket.inputs.assessor, ticket.inputs.assessment, ticket.inputs.tokenSalt)
          let closestDistanceByMinterAfter = await minter.closestDistance.call()

          // and see if closestDistance and winner change as expected
          if (ticketDistance.toNumber() < closestDistanceByMinter.toNumber()) {
            let winnerByMinter = await minter.winner.call()
            assert.equal(winnerByMinter, ticket.inputs.assessor, 'the assessor was not saved as winner, despite a closer ticket')
            assert.isBelow(closestDistanceByMinterAfter.toNumber(), closestDistanceByMinter.toNumber(), 'the bestDistance of the minter did not decrease despite a closer ticket')
          } else {
            assert.equal(closestDistanceByMinterAfter.toNumber(), closestDistanceByMinter.toNumber(), 'the closest distance changed without the ticket being a winner')
          }
        }
      })

      it('rejects bids from addressess that have not revealed a score', async () => {
        try {
          await minter.submitTicket(assessees[0], assessment.address, cost - 3)
        } catch (e) {
          if (e.toString().indexOf('revert') > 0) {
            return assert(true)
          } else {
            return assert(false, e.toString(), 'bid could be submitted by foreign address')
          }
        }
        assert(false)
      })

      it('rejects bids if the token-salt is too high', async () => {
        try {
          await minter.submitTicket(assessment.calledAssessors[0], assessment.address, cost + 1)
        } catch (e) {
          if (e.toString().indexOf('revert') > 0) {
            return assert(true)
          } else {
            return assert(false, e.toString(), 'a bid with too high a salt could be submitted')
          }
        }
        assert(false)
      })

      it('rejects bids if the assessor is not in the majority cluster', async () => {
        try {
          await minter.submitTicket(assessment.calledAssessors[size - 1], assessment.address, cost - 1)
        } catch (e) {
          if (e.toString().indexOf('revert') > 0) {
            return assert(true)
          } else {
            return assert(false, e.toString(), 'a bid from a dissenting assessor could be submitted')
          }
        }
        assert(false)
      })

      it('rejects bids from assessments ending in another epoch', async () => {
        // create new assessment with longer timescale
        epochLength = (await minter.epochLength.call()).toNumber()
        let assessment2 = await chain.createAndRunAssessment(
          assessedConcept.address,
          assessees[1],
          cost, size, waitTime, epochLength * 1.2, // assessment-params
          scores, -1 // scores & default salts
        )
        let stage = await assessment2.instance.assessmentStage.call()
        assert.equal(stage.toNumber(), 4, 'assessment did not move to stage done')
        try {
          await minter.submitTicket(assessment2.calledAssessors[1], assessment2.address, 1)
        } catch (e) {
          if (e.toString().indexOf('revert') > 0) {
            return assert(true)
          } else {
            return assert(false, e.toString(), 'a bid was submitted based on an assessment from a future epoch')
          }
        }
        assert(false)
      })

      it('can not be prompted to mint tokens', async () => {
        try {
          await minter.endEpoch()
        } catch (e) {
          if (e.toString().indexOf('revert') > 0) {
            return assert(true)
          } else {
            return assert(false, e.toString(), 'minter minted tokens before end of epoch')
          }
        }
        assert(false)
      })
    })

    describe('After the epoch, the minter...', async () => {

      it('mints new tokens to the winner', async () => {
        await utils.evmIncreaseTime(epochLength)
        let winner = await minter.winner.call()
        let balanceBefore = await fathomToken.balanceOf.call(winner)
        foundation['balance'] = Number(await fathomToken.balanceOf.call(foundation.address))
        await minter.endEpoch()
        let balanceAfter = await fathomToken.balanceOf.call(winner)
        assert.isAbove(balanceAfter.toNumber(), balanceBefore.toNumber(), 'winner did not receive minted Tokens')
      })

      it('mints part of the token to the default beneficiary (aka the foundation)', async () => {
        let balanceAfter = await fathomToken.balanceOf.call(foundation.address)
        assert.isAbove(balanceAfter.toNumber(), foundation.balance, 'default beneficiary did not receive a share of the minted Tokens')
      })

      it('and starts a new epoch', async () => {
        assert(await minter.winner.call(), 0x0, 'winner was not reset')
        assert(await minter.closestDistance.call(), 0, 'winner was not reset')
      })
    })

    describe('The taxation system is opt-out:', async () => {
      let selfishUser;
      it('another assessment is run until the end and a user submits a bid', async () => {
        assessment = await chain.createAndRunAssessment(
          assessedConcept.address,
          assessees[1],
          cost, size, waitTime, timeLimit,
          scores, -1
        )
        let stage = await assessment.instance.assessmentStage.call()
        selfishUser = assessment.calledAssessors[0]
        assert.equal(stage.toNumber(), 4, 'assessment did not move to stage done')

        await minter.submitTicket(selfishUser, assessment.address, cost - 3)
        assert.equal(selfishUser, await minter.winner.call())
      })

      it('users can redirect their taxes if they want to', async () => {
        await minter.registerBeneficiary(selfishUser, {from: selfishUser})
        let balanceBefore = Number(await fathomToken.balanceOf.call(selfishUser))
        await utils.evmIncreaseTime(epochLength)
        await minter.endEpoch()
        let balanceAfter = Number(await fathomToken.balanceOf.call(selfishUser))
        let reward = Number(await minter.reward.call())
        assert.equal(balanceAfter, balanceBefore + reward, 'user did not receive all minted tokens')
      })

    })

    // describe('Users can specify a ')
  })
})
