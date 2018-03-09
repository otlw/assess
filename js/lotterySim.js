ethereumjsABI = require('ethereumjs-abi')
var ABI = require('./ABIs.js')


/*
  finds the lottery ticket with the smallest distance from the goal,
  for a single assessor in a given assessment
  @param assessment: object with fields for address, salt, cost
  @param assessor: address of the assessor
  @param goal: the epoch's target hash as a uint
*/
genTicket = (assessment, assessor, goal) => {
    let bestShot = {distance: -1, salt: null};
    for (let i=0; i<=assessment.cost; i++) {
        let hash = hashTicket(assessor, assessment.address, i, assessment.salt)
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
function hashTicket(_assessor, _assessment, _tokenSalt, _assessmentSalt) {
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
exports.getAllAssessments = async function (w3, firstEpochBlockNumber, epochLength, fathomTokenAddress, callback) {
    var fathomTokenInstance = w3.eth.contract(ABI.fathomToken).at(fathomTokenAddress)
    // get all events with topic 6: 'consensus-reached, you got paid'
    let event = fathomTokenInstance.Notification([{topic: 6}])//, {fromBlock: firstEpochBlockNumber, toBlock: firstEpochBlockNumber + epochLength}])
    let ret = await event.get(function(err, logs) {
        if (err) {
            console.log("err", err)
        } else {
            console.log("number of events found", logs.length)
            let assessments = {}
            // loop over all assessors, sort them by assessment and get the relevant assessment-params
            for (let i=0; i< logs.length; i++) {
                let assessmentAddress = logs[i].args["sender"]
                if (assessments[assessmentAddress]) {
                    assessments[assessmentAddress].assessors.push(logs[i].args["user"])
                } else {
                    // initialize assessment data with empy list and assessment-params
                    console.log("new assessment found!!")
                    let assessmentInstance = w3.eth.contract(ABI.assessment).at(assessmentAddress)
                    let salt = (assessmentInstance.salt.call()).toNumber()
                    let cost = (assessmentInstance.cost.call()).toNumber()
                    assessments[assessmentAddress] = {assessors: [], address:assessmentAddress,  salt: salt, cost: cost}
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
exports.runLottery = async function(w3, firstEpochBlockNumber, epochLength, fathomTokenAddress, callback) {
    let goal = (await w3.eth.getBlock(firstEpochBlockNumber)).hash //TODO convert hash into an int
    console.log("goal", goal, " as int")
    this.getAllAssessments(w3, firstEpochBlockNumber, epochLength, fathomTokenAddress, function(assessments) {
        let result = {
            winners: [],
            winnerTicketDistance: null,
            tickets : []
        }
        // loop over assessments
        for (var key in assessments) {
            let nAssessors = assessments[key].assessors.length
            for (let j=0; j<nAssessors; j++) {
                let tx = this.genTicket(assessments[key], assessments[key].assessors[j], goal)
                // case tie:
                if (tx.dist === result.winnerTicketDistance) {
                    result.winners.push(assessments[key].assessors[j])
                    result.tickets.push({
                        assessment: key,
                        assessor: assessments[key].assessors[j],
                        salt: tx.salt
                    })
                }
                // case smaller distance (or no previous distance):
                if (tx.distance < result.winnerTicketDistance || !result.winnerTicketDistance) {
                    result.winnerTicketDistance = tx.distance
                    result.winners = [assessments[key].assessors[j]]
                    result["tickets"] = [{
                        assessment: key,
                        assessor: assessments[key].assessors[j],
                        salt: tx.salt
                    }]
                }
            }
        }
        callback(result)
    })
}
