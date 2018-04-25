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
  it('The assessee can leave data', async () => {
    let meetingString = 'meet me in the djungle'
    await assessmentContract.addData(meetingString, {from: assessee})
    let data = await assessmentContract.data.call(0)
    assert.equal(meetingString, data)
  })

  it('Non-confirmed assessors can not leave data', async () => {
    let response = 'at the palm tree?'
    try {
      await assessmentContract.addData(response, {from: calledAssessors[0]})
    } catch (e) {
      if (e.toString().indexOf('revert') > 0) {
        return assert(true)
      } else {
        return assert(false, e.toString(), 'a bid with too high a salt could be submitted')
      }
    }
    assert(false)
  })

  it('Once they have staked assessors can too', async () => {
    await assessmentContract.confirmAssessor({from: calledAssessors[0]})
    let response = 'at the palm tree?'
    await assessmentContract.addData(response, {from: calledAssessors[0]})
    let data = await assessmentContract.data.call(1)
    assert.equal(response, data)
  })
})

