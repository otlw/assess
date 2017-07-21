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
exports.getMAD = function(data){
    mean = 0;
    mean = data.reduce((previous, current) => current += previous)
    mean /=  solidityRound(data.length);

    totalRelativeDistance = 0;
    for(k = 0; k < data.length; k++) {
        totalRelativeDistance += Math.abs(data[k] - mean);
    }
    meanAbsoluteDeviation = solidityRound(totalRelativeDistance/data.length);
    return meanAbsoluteDeviation;
}


exports.getLargestCluster = function(scores){
    largestCluster = []
    largestClusterSize = 0;
    MAD = this.getMAD(scores)
    for (j=0; j<scores.length; j++){
        clusterSize = 0
        cluster = []
        for (i=0; i<scores.length; i++){
            if (Math.abs(scores[j] - scores[i]) <= MAD ) {
                cluster.push(true)
                clusterSize++
            } else {
                cluster.push(false)
            }
        }
        if(clusterSize > largestClusterSize) {
            largestCluster = cluster;
            largestClusterSize = clusterSize;
        }
    }
    return [largestCluster, largestClusterSize]
}

exports.getFinalScore = function(clusterMask, scores){
    score = 0;
    finalClusterLength = 0;
    for (key in scores){
        if (clusterMask[key]){
            score += scores[key]
            finalClusterLength++
        }
    }
    return solidityRound(score/finalClusterLength)
}

//do weird rounding to account for solidity behavior -1/2 = -1 in js but -1/2 = 0 in solidity
function solidityRound(x){
    if(x<0){
        return Math.ceil(x)
    }
    else { return Math.floor(x) }
}

exports.computePayouts = function(clusterMask, scores, finalScore, mad, cost) {
    payouts = []
    q = 1  //INFLATION RATE
    for (key in scores) {
        let xOfMad =0;
        if (mad > 0){
            xOfMad = solidityRound((Math.abs(scores[key] - finalScore)*10000) / mad);
        }
        // console.log("scoreDinstance(JS) for assessor " + key + " : " + scoreDistance)
        dist  = Math.abs(scores[key] - finalScore)
        if(clusterMask[key]) {
            payouts.push(Math.floor((q*cost * Math.max(10000 - xOfMad, 0))/10000) + cost);
        }
        else {
            payouts.push(Math.floor((cost * Math.max(20000 - xOfMad, 0)) / 20000));
        }
    }
    return payouts
}

exports.generateSetup = function(accounts, maxAssessors, maxScore, cost) {
    size = utils.getRandomInt(5,maxAssessors)
    scores = []
    for (i=0; i<size; i++){
        scores.push(utils.getRandomInt(-maxScore, maxScore))
    }
    //generating the right results
    largestClusterInfo = this.getLargestCluster(scores)
    var trueClusterMask = largestClusterInfo[0]
    var largestClusterSize = largestClusterInfo[1]
    var trueScore = this.getFinalScore(trueClusterMask, scores)
    return {assessors: accounts.slice(0, size),
            scores: scores,
            stake: cost,
            size: size,
            clusterMask: trueClusterMask,
            largestClusterSize: largestClusterSize,
            finalScore: trueScore,
            payouts: this.computePayouts(trueClusterMask,
                                    scores,
                                    trueScore,
                                    this.getMAD(scores),
                                    cost
                                   )
           }
 }
