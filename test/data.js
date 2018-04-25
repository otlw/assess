var ConceptRegistry = artifacts.require('ConceptRegistry')
var Assessment = artifacts.require('Assessment')

var utils = require('../js/utils.js')
var assess = require('../js/assessmentFunctions.js')

var nInitialUsers = 6

contract('Storing Data on Assessments:', function (accounts) {
  let conceptReg
  let assessmentContract
  let assessmentData

  let cost = 150000
  let size = 6
  let timeLimit = 10000
  let waitTime = 100

  let calledAssessors
  let assessee = accounts[nInitialUsers + 1]

  it('An assessment is created and user are called to be assessors.', async () => {
    conceptReg = await ConceptRegistry.deployed()
    let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]), [500], 60 * 60 * 24, '', '0x0')
    let assessedConceptAddress = txResult.logs[0].args['_concept']

    // initiate assessment, save assessors and their initial balance
    assessmentData = await assess.makeAssessment(assessedConceptAddress, assessee, cost, size, waitTime, timeLimit)
    assessmentContract = Assessment.at(assessmentData.address)
    calledAssessors = assessmentData.calledAssessors

    assert.isAbove(calledAssessors.length, size - 1, 'not enough assessors were called')
  })

  it('The assessee can store data', async () => {
    let meetingString = 'Meet me in the djungle.'
    await assessmentContract.addData(meetingString, {from: assessee})
    let data = await assessmentContract.data.call(assessee)
    assert.equal(meetingString, data)
  })

  it('Assessors can not store data before they have confirmed', async () => {
    let response = 'at the palm tree?'
    try {
      await assessmentContract.addData(response, {from: calledAssessors[0]})
    } catch (e) {
      if (e.toString().indexOf('revert') > 0) {
        return assert(true)
      } else {
        return assert(false, e.toString(), 'another error than revert was thrown')
      }
    }
    assert(false)
  })

  it('Staked assessors can store data', async () => {
    await assessmentContract.confirmAssessor({from: calledAssessors[0]})
    let response = 'at the palm tree?'
    await assessmentContract.addData(response, {from: calledAssessors[0]})
    let data = await assessmentContract.data.call(calledAssessors[0])
    assert.equal(response, data)
  })

  it('No one can change their data after the last assessor has committed', async () => {
    let hashes = []
    for (let i = 0; i < size; i++) {
      hashes.push(utils.hashScoreAndSalt(i, i.toString()))
    }
    await assess.confirmAssessors(calledAssessors.slice(1, size), assessmentContract)
    await assess.commitAssessors(calledAssessors.slice(0, size), hashes, assessmentContract)
    let stage = await assessmentContract.assessmentStage.call()
    assert.equal(stage.toNumber(), 3)

    let response = 'Meet on top of the highest mountain!'
    try {
      await assessmentContract.addData(response, {from: calledAssessors[0]})
    } catch (e) {
      if (e.toString().indexOf('revert') > 0) {
        return assert(true)
      } else {
        return assert(false, e.toString(), 'another error than revert was thrown')
      }
    }
    assert(false)
  })
})
