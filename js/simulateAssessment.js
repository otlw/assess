exports.getMAD = function(data){
    mean = 0;
    mean = data.reduce((previous, current) => current += previous)
    mean =  solidityRound(mean/data.length);

    totalRelativeDistance = 0;
    for(k = 0; k < data.length; k++) {
        totalRelativeDistance += Math.abs(data[k] - mean);
    }
    meanAbsoluteDeviation = Math.floor(totalRelativeDistance/data.length);
    return meanAbsoluteDeviation;
}

exports.getFinalScore = function(scores){
    largestCluster = []
    largestClusterSize = 0;
    finalScore = 0;
    MAD = this.getMAD(scores)
    for (j=0; j<scores.length; j++){
        clusterSize = 0
        cluster = []
        clusterScore = 0;
        for (i=0; i<scores.length; i++){
            if (Math.abs(scores[j] - scores[i]) <= MAD ) {
                cluster.push(true)
                clusterSize++
                clusterScore += scores[i]
            } else {
                cluster.push(false)
            }
        }
        if(clusterSize > largestClusterSize) {
            largestCluster = cluster;
            largestClusterSize = clusterSize;
            finalScore = solidityRound(clusterScore/largestClusterSize);
        }
    }
    return {score: finalScore, mad:MAD, clusterMask:largestCluster, size:largestClusterSize}
}

//do weird rounding to account for solidity behavior -1/2 = -1 in js but -1/2 = 0 in solidity
function solidityRound(x){
    if(x<0){
        return Math.ceil(x)
    }
    else { return Math.floor(x) }
}

exports.computePayouts = function(scores, finalScore, mad, cost) {
    payouts = []
    q = 1  //INFLATION RATE
    for (key in scores) {
        distance = Math.abs(scores[key] - finalScore)
        let xOfMad = 0;
        if (mad > 0){
            xOfMad = Math.floor((distance*10000) / mad);
        }
        // console.log("scoreDinstance(JS) for assessor " + key + " : " + scoreDistance)
        if( distance <= mad ) { //in RewardCluster
            payouts.push(Math.floor((q*cost * Math.max(10000 - xOfMad, 0))/10000) + cost);
        }
        else {
            payouts.push(Math.floor((cost * Math.max(20000 - xOfMad, 0)) / 20000));
        }
    }
    return payouts
}

exports.generateRandomSetup = function(accounts, maxAssessors, maxScore, cost) {
    size = utils.getRandomInt(5,maxAssessors)
    scores = []
    for (i=0; i<size; i++){
        scores.push(utils.getRandomInt(-maxScore, maxScore))
    }
    return this.generateSetup(accounts, scores, cost)
}

exports.generateSetup = function(accounts, scores, cost){
    size = scores.length
    assessors = accounts.slice(0, size)
    //generating the right results
    resultInfo = this.getFinalScore(scores)
    return {assessors: assessors,
            scores: scores,
            stake: cost,
            size: size,
            clusterMask: resultInfo.clusterMask,
            largestClusterSize: resultInfo.size,
            finalScore: resultInfo.score,
            payouts: this.computePayouts(scores,
                                         resultInfo.score,
                                         resultInfo.mad,
                                         cost)
           }
}
