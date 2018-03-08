var utils = require("./utils.js")
var Concept = artifacts.require("Concept")

exports.confirmAssessors = async function(_assessors, _assessmentInstance) {
    for(i=0; i < _assessors.length; i++) {
        stage = await _assessmentInstance.assessmentStage.call()
        if (stage.toNumber() == 1){
            await _assessmentInstance.confirmAssessor({from: _assessors[i]})
        }
        else{
            console.log("wrong stage! " + i + "'-th assessor should not confirm")
        }
    }
}

exports.commitAssessors = async function(_assessors, _hashes, _assessmentInstance) {
    for(i=0; i < _assessors.length; i++) {
        stage = await _assessmentInstance.assessmentStage.call()
        if (stage.toNumber() == 2){
            await _assessmentInstance.commit(_hashes[i], {from: _assessors[i]})
        }
        else{
            console.log("wrong stage! " + i + "'-th assessor should not confirm")
        }
    }
}

exports.revealAssessors = async function(_assessors, _scores, _salts, _assessmentInstance) {
    for(i=0; i < _assessors.length; i++) {
        stage = await _assessmentInstance.assessmentStage.call()
        if (stage.toNumber() == 3){
            await _assessmentInstance.reveal(_scores[i], _salts[i], {from: _assessors[i]})
        }
        else{
            console.log("wrong stage! " + i + "'-th assessor should not reveal")
        }
    }
}

exports.makeAssessment = async function(conceptAddress, assesseeAddress, cost, size, startTime, endTime) {
    var assessmentData = {assessors: []}
    var assessmentResult = await Concept.at(conceptAddress).makeAssessment(cost, size, startTime, endTime, {from: assesseeAddress})
    assessmentData.assessors = utils.getCalledAssessors(assessmentResult.receipt)
    assessmentData.address = utils.getNotificationArgsFromReceipt(assessmentResult.receipt, 1)[0].sender
    assessmentData.txResult = assessmentResult
    return assessmentData
}

/*
  runs an entire assessment
  @param assessmentInstance the artifact of the assessment-contract
  @param list of assessors (must have been called)
  @param list of scores to be submitted by the assessors
  */
exports.runAssessment = async function(assessmentInstance, assessors, scores) {
    await this.confirmAssessors(assessors, assessmentInstance)
    let salts = []
    let hashes = []
    for (let i=0; i<assessors.length; i++){
        salts.push(i.toString())
        hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
    }
    await this.commitAssessors(assessors, hashes, assessmentInstance)
    //do we need to wait in between these steps
    await this.revealAssessors(assessors, scores, salts, assessmentInstance)
}
