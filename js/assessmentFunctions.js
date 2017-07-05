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

exports.confirmAssessors2 = async function(_assessors, assessmentInstance) {
    // for(i=0; i < _assessors.length; i++) {
    i = 0
    await assessmentInstance.confirmAssessor({from: _assessors[i]})
    // }
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

exports.revealAssessors = function(_assessors, _scores, _salts, _assessmentInstance) { //TODO refactor to take an object
    var chain = new Promise((resolve, reject) => resolve(0))
    for(i=0; i < _assessors.length; i++) {
        chain = chain.then(function(index) {
            return _assessmentInstance.reveal(_scores[index], _salts[index], _assessors[index], {from: _assessors[index]}) .then(function(){
                return index += 1
            })
        })
    }
    return chain
}
