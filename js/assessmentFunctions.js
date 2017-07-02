exports.confirmAssessors = function(_assessors, assessmentInstance) {
    var chain = new Promise((resolve, reject) => resolve(0))
    for(i=0; i < _assessors.length; i++) {
        chain = chain.then(function(index) {
            assessmentInstance.confirmAssessor({from: _assessors[index]})
            return index += 1

        })
    }
    return chain
}

exports.commitAssessors = function(_assessors, _hashes, _assessmentInstance) {
    var chain = new Promise((resolve, reject) => resolve(0))
    for(i=0; i < _assessors.length; i++) {
        chain = chain.then(function(index) {
            _assessmentInstance.commit(_hashes[index], {from: _assessors[index]})
            return index += 1

        })
    }
    return chain
}

exports.revealAssessors = function(_assessors, _scores, _salts, _assessmentInstance) { //TODO refactor to take an object
    var chain = new Promise((resolve, reject) => resolve(0))
    for(i=0; i < _assessors.length; i++) {
        chain = chain.then(function(index) {
            _assessmentInstance.reveal(_scores[index], _salts[index], _assessors[index], {from: _assessors[index]})
            return index += 1

        })
    }
    return chain
}
