// this tests the Math-Library function getFinalScore, therefore assessments without consensus
// will not produce a zero score, but the average of the biggest cluster
exports.getFinalScore = function(scores, radius) {
    largestCluster = []
    largestClusterScore = 0;
    finalScore = 0;
    for (var j=0; j<scores.length; j++) {
        cluster = []
        clusterScore = 0;
        for (var i=0; i<scores.length; i++){
            if (Math.abs(scores[j] - scores[i]) <= radius ) {
                cluster.push(scores[i])
                clusterScore += scores[i]
            }
        }
        if(cluster.length > largestCluster.length || (cluster.length == largestCluster.length && clusterScore < largestClusterScore)) {
            largestCluster = cluster;
            largestClusterScore = clusterScore;
        }
    }
    finalScore = solidityRound(largestClusterScore/largestCluster.length);
    return {score: finalScore, clusterMask:largestCluster, size:largestCluster.length}
}

//do weird rounding to account for solidity behavior -1/2 = -1 in js but -1/2 = 0 in solidity
function solidityRound(x){
    if(x<0){
        return Math.ceil(x)
    }
    else { return Math.floor(x) }
}

//emulating the funcionality of the getPayout function of Math.sol
exports.computePayouts = function(scores, finalScore, radius, cost, dissentBonus=false) {
    payouts = []
    dissentBonus = 0
    inAssessorsIdxs = []
    q = 1  //INFLATION RATE
    for (key in scores) {
        distance = Math.abs(scores[key] - finalScore)
        let xOfRadius = Math.floor((distance*10000) / radius);
        // console.log("scoreDinstance(JS) for assessor " + key + " : " + scoreDistance)
        if (distance <= radius) { //in RewardCluster?
            payouts.push(Math.floor((q*cost * Math.max(10000 - xOfRadius, 0))/10000) + cost);
            inAssessorsIdxs.push(key)
        }
        else {
            payoutValue = Math.floor((cost * Math.max(20000 - xOfRadius, 0)) / 20000)
            payouts.push(payoutValue)
            dissentBonus += cost - payoutValue
        }
    }
    // add dissentBonus to equal parts to all inCluster assessors
    if (dissentBonus == true) {
        for (i=0; i< inAssessorsIdxs.length; i++) {
            payouts[inAssessorsIdxs[i]] += Math.floor(dissentBonus/inAssessorsIdxs.length)
        }
    }

    return payouts
}

exports.generateAssessmentDataAtRandom = function(accounts, maxAssessors, maxScore, radius, cost, dissentBonus=false) {
    size = utils.getRandomInt(5,maxAssessors)
    scores = []
    for (i=0; i<size; i++){
        scores.push(utils.getRandomInt(-maxScore, maxScore))
    }
    return this.generateAssessmentData(accounts, scores, radius, cost, dissentBonus)
}

exports.generateAssessmentData = function(accounts, scores, radius, cost, dissentBonus=false){
    size = scores.length
    assessors = accounts.slice(0, size)
    //generating the right results
    resultInfo = this.getFinalScore(scores, radius)
    return {assessors: assessors,
            scores: scores,
            stake: cost,
            size: size,
            clusterMask: resultInfo.clusterMask,
            largestClusterSize: resultInfo.size,
            finalScore: resultInfo.score,
            payouts: this.computePayouts(scores,
                                         resultInfo.score,
                                         radius,
                                         cost,
                                         dissentBonus)
           }
}
