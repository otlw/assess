exports.confirmAssessors = function(_assessors, assessmentInstance) {
    var chain = new Promise((resolve, reject) => resolve(0))
    for(i=0; i < _assessors.length; i++) {
        chain = chain.then(function(index) {
            return assessmentInstance.confirmAssessor({from: _assessors[index]}).then(function(){
                return index += 1
            })
        })
    }
    return chain
}

exports.commitAssessors = function(_assessors, _hashes, _assessmentInstance) {
    var chain = new Promise((resolve, reject) => resolve(0))
    for(i=0; i < _assessors.length; i++) {
        chain = chain.then(function(index) {
            return _assessmentInstance.commit(_hashes[index], {from: _assessors[index]}).then(function(){
                return index += 1
            })
        })
    }
    return chain
}


exports.revealAssessors = async function(_assessors, _scores, _salts, _assessmentInstance) {
    for(i=0; i < _assessors.length; i++) {
        stage = await _assessmentInstance.assessmentStage.call()
        if (stage.toNumber() == 3){
            await _assessmentInstance.reveal(_scores[i], _salts[i], _assessors[i], {from: _assessors[i]})
        }
        else{
            console.log("wrong stage! " + i + "'-th assessor should not reveal")
        }
    }
}
