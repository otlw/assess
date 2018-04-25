var ConceptRegistry = artifacts.require('ConceptRegistry')
var Assessment = artifacts.require('Assessment')

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

  it('Only the assessee can store data', async () => {
    let meetingString = 'Meet me in the djungle.'
    await assessmentContract.addData(meetingString, {from: assessee})
    let data = await assessmentContract.data.call()
    assert.equal(meetingString, data)

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

  it('But not after the assessment has ended', async () => {
    await assess.runAssessment(assessmentContract, calledAssessors.slice(0, size), Array(size).fill(100), -1)
    let stage = await assessmentContract.assessmentStage.call()
    assert.equal(stage, 4)
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
