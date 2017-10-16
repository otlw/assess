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

exports.makeAssessment = async function(conceptAddress, assesseeAddress, cost, size, startTime, endTime, maxTries = 10) {
    assessmentData = {assessors: [], tries: 0}
    while (assessmentData.assessors.length < size) {
        // try at most 10 times
        if (assessmentData.tries == maxTries) {
            console.log("ERROR: Aborting after 10 subsequent tries did not yield an assessment of the desired size")
            break;
        }
        try {
            var assessmentResult = await Concept.at(conceptAddress).makeAssessment(cost, size, startTime, endTime, {from: assesseeAddress})
            assessmentData.assessors = utils.getCalledAssessors(assessmentResult.receipt)
            assessmentData.address = utils.getNotificationArgsFromReceipt(assessmentResult.receipt, 1)[0].sender
            assessmentData.txResult = assessmentResult
            assessmentData.tries++
        } catch(e) {
            console.log("ERROR! Creating an assessment failed with error: ", e);
            return;
        }
    }
    return assessmentData
}
