ethereumjsABI = require('ethereumjs-abi')
var ABI = require('./ABIs.js')


/*
  finds the lottery ticket with the smallest distance from the goal,
  for from a single assessor in a given assessment
  @param assessment: object with fields for address, salt, cost
  @param assessor: address of the assessor
  @param goal: the epoch's target hash as a uint
*/
genTicket = (assessment, assessor, goal) => {
    let bestShot = {distance: -1, salt: null};
    for (let i=0; i<=assessment.cost; i++) {
        let hash = this.hashTicket(assessor, assessment.address, i, assessment.salt)
        let dist = Math.abs(hash-goal)
        if (bestShot.distance < 0 || dist < bestShot.distance) {
            bestShot = {distance: dist, salt:i}
        }
    }
    return bestShot;
}

/*
  creates bytes32-hash to be used as a lottery-ticket using the solidity dense-packed data-handling
*/
hashTicket = function(_assessment, _assessor, _tokenSalt, _assessmentSalt) {
    return '0x' + ethereumjsABI.soliditySHA3(
        ["address", "address", "uint", "uint"],
        [_assessor, _assessment, _tokenSalt, _assessmentSalt]
    ).toString('hex')
}

/*
   returns a list of all assessments associated to a given FathomTokenAddress since a given blockNumber.
   For each assessment, an object with the address, the cumulative salt, cost and the addressess of all assessors
   who have completed the assessment is returned.
   @param firstEpochBlock
   @param epochLength over which to look for completed assessments
   @param fathomTokenAddress: address of the fathomToken from which all events are fired.

 */
getAllAssessments = async (w3, firstEpochBlock, epochLength, fathomTokenAddress, callback) => {
    var fathomTokenInstance = w3.eth.contract(ABI.fathomToken).at(fathomTokenAddress)
    // get all events with topic 6: 'consensus-reached, you got paid'
    let event = fathomTokenInstance.notification([{topic: 6}, {fromBlock: firstEpochBlock, toBlock: firstEpochBlock + epochLength}])
    let ret = await event.get(function(err, logs) {
        if (err) {
            console.log(err)
        } else {
            console.log(logs)
            let assessments = {}
            // loop over all assessors, sort them by assessment and get the relevant assessment-params
            for (let i=0; i< logs.length; i++) {
                let assessmentAddress = logs[i].args["sender"]
                if (assessments[assessmentAddress]) {
                    assessments[assessmentAddress].assessors.push(logs[i].args["user"])
                } else {
                    // initialize assessment data with empy list and assessment-params
                    assessments[assessmentAddress] = {assessors: [], address: assessmentAddress, salt: -1, cost: -1} 
                    //TODO get the actual salt and cost
                    // let assessmentInstance = w3.eth.contract(ABI.assessment).at(assessmentAddress)
                    // let salt = (await assessmentInstance.salt.call()).toNumber() // how to do that?
                    // let cost = (await assessmentInstance.cost.call()).toNumber()
                }
            }
            callback(assessments)
        }
    })
}
/*
  Runs the lottery by generating tickets for all salts from all assessors who finished an assessment
  during the epoch.
  @param firstEpochBlockNumber
  @param fathomTokenAddress
  */
exports.runLottery = async function(w3, firstEpochBlockNumber, fathomTokenAddress, callback) {
    let goal = (await w3.eth.getBlock(firstEpochBlockNumber)).hash //TODO convert hash into an int
    console.log("goal", goal, " as int")
    this.getAllAssessments(w3, firstEpochBlockNumber, fathomTokenAddress, function(assessments) {
        let result = {
            winners: [],
            winnerTicketDistance: null,
            tickets : []
        }
        for (let i=0; i< assessments.length; i++) {
            for (let j=0; j< assessments[i].assessors.length; j++) {
                let tx = this.genTicket(assessments[i], assessments[i].assessors[j], goal)
                // case tie:
                if (tx.dist === result.winnerTicketDistance) {
                    result.winners.push(assessments[i].assessors[j])
                    result.tickets.push({
                        assessment: assessments[i].address,
                        assessor: assessments[i].assessors[j],
                        salt: tx.salt
                    })
                }
                // case smaller distance:
                if (tx.distance < result.winnerTicketDistance ||
                   !result.winnerTicketDistance) {
                    result.winnerTicketDistance = tx.distance
                    result.winners = [assessments[i].assessors[j]]
                    result["tickets"] = [{
                        assessment: assessments[i].address,
                        assessor: assessments[i].assessors[j],
                        salt: tx.salt
                    }]
                }
            }
        }
        callback(result)
    })

}
