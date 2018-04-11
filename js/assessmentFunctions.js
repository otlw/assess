var utils = require('./utils.js')
var Concept = artifacts.require('Concept')
var Assessment = artifacts.require('Assessment')

exports.confirmAssessors = async function (_assessors, _assessmentInstance) {
  for (i = 0; i < _assessors.length; i++) {
    stage = await _assessmentInstance.assessmentStage.call()
    if (stage.toNumber() == 1) {
      await _assessmentInstance.confirmAssessor({from: _assessors[i]})
    } else {
      console.log('wrong stage! ' + i + "'-th assessor should not confirm")
    }
  }
}

exports.commitAssessors = async function (_assessors, _hashes, _assessmentInstance) {
  for (i = 0; i < _assessors.length; i++) {
    stage = await _assessmentInstance.assessmentStage.call()
    if (stage.toNumber() == 2) {
      await _assessmentInstance.commit(_hashes[i], {from: _assessors[i]})
    } else {
      console.log('wrong stage! ' + i + "'-th assessor should not confirm")
    }
  }
}

exports.revealAssessors = async function (_assessors, _scores, _salts, _assessmentInstance) {
  for (i = 0; i < _assessors.length; i++) {
    stage = await _assessmentInstance.assessmentStage.call()
    if (stage.toNumber() == 3) {
      await _assessmentInstance.reveal(_scores[i], _salts[i], {from: _assessors[i]})
    } else {
      console.log('wrong stage! ' + i + "'-th assessor should not reveal")
    }
  }
}

exports.makeAssessment = async function (conceptAddress, assesseeAddress, cost, size, startTime, endTime) {
  var assessmentData = {}
  var assessmentResult = await Concept.at(conceptAddress).makeAssessment(cost, size, startTime, endTime, {from: assesseeAddress})
  assessmentData.calledAssessors = utils.getCalledAssessors(assessmentResult.receipt)
  assessmentData.address = utils.getNotificationArgsFromReceipt(assessmentResult.receipt, 1)[0].sender
  assessmentData.txResult = assessmentResult
  assessmentData.cost = cost
  return assessmentData
}

/* creates and runs an assessment from start to finish */
exports.createAndRunAssessment = async function (conceptAddress, assesseeAddress, cost, size, startTime, endTime, scores, salts = -1) {
  let assessmentData = await this.makeAssessment(conceptAddress, assesseeAddress, cost, size, startTime, endTime)
  let assessmentContract = Assessment.at(assessmentData.address)
  assessmentData['instance'] = assessmentContract
  let result = await this.runAssessment(assessmentContract, assessmentData.calledAssessors.slice(0, size), scores.slice(0, size), salts)
  return assessmentData
}

/*
  runs an entire assessment by confirming, committing and revealing given scores
  for all assessors.
  @param assessmentInstance the artifact of the assessment-contract
  @param list of assessors (must have been called)
  @param list of scores to be submitted by the assessors
  @param list of salts to be submitted by the assessors (default [0,1,...])
  */
exports.runAssessment = async function (assessmentInstance, assessors, scores, salts = -1) {
  let hashes = []
  if (salts === -1) {
    var salts = []
    for (let i = 0; i < assessors.length; i++) {
      salts.push(i.toString())
    }
  }
  for (let i = 0; i < assessors.length; i++) {
    hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
  }
  await this.confirmAssessors(assessors, assessmentInstance)
  await utils.evmIncreaseTime(600)
  await this.commitAssessors(assessors, hashes, assessmentInstance)
  await utils.evmIncreaseTime(60 * 60 * 13) // let 12h challenge period pass
  await this.revealAssessors(assessors, scores, salts, assessmentInstance)
}
