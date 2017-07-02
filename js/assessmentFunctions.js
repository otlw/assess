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
