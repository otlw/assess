var abi = require('ethjs-abi')
var ethereumjsABI = require('ethereumjs-abi')
var Web3 = require('web3')
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
var jsAssess = require('./simulateAssessment.js')
var FathomToken = artifacts.require("FathomToken")
var Assessment = artifacts.require("Assessment")


exports.hashScoreAndSalt = function(_score, _salt) {
    return '0x' + ethereumjsABI.soliditySHA3(
        ["int128", "string"],
        [_score, _salt]
    ).toString('hex')
}

exports.getNotificationArgsFromReceipt = function(_receipt, _topic) {
    var events = [];
    var notificationIndex;
    for(i=0; i < FathomToken.abi.length; i++) {
        if(FathomToken.abi[i].name == "Notification" && FathomToken.abi[i].type == "event"){
            notificationIndex = i;
        }
    }

    for (i=0; i < _receipt.logs.length; i++) {
        if (_receipt.logs[i].topics[0] == "0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876"){
            let event = abi.decodeEvent(FathomToken.abi[notificationIndex], _receipt.logs[i].data)
            if (_topic == -1){
                events.push({user: event.user, sender: event.sender, topic: event.topic.toNumber()})
            } else if (event.topic.toNumber() == _topic) {
                events.push({user: event.user, sender: event.sender, topic: event.topic.toNumber()})
            }
        }
    }
    return events
}

exports.evmIncreaseTime = function(seconds) {
    return new Promise(function (resolve, reject) {
      return web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
          method: "evm_increaseTime",
          params: [seconds],
          id: new Date().getTime()
      }, function (error, result) {
        return error ? reject(error) : resolve(result.result);
      })
    })
  }

exports.getCalledAssessors = function(receiptFromMakeAssessment){
    calledAssessors = [];
    callsToAssessors = this.getNotificationArgsFromReceipt(receiptFromMakeAssessment, 1)
    for (a=0; a<callsToAssessors.length; a++){
        calledAssessors.push(callsToAssessors[a].user)
    }
    return calledAssessors
}

exports.getBalances = async function(_accounts, _userRegistryInstance){
    balances = []
    for (i=0; i<_accounts.length; i++){
        tmp = await _userRegistryInstance.balanceOf.call(_accounts[i])
        balances.push(tmp.toNumber())
    }
    return balances
}

exports.getEthBalances = function(_accounts){
    balances = []
    for (i=0; i<_accounts.length; i++){
        balances.push(web3.eth.getBalance(_accounts[i]).toNumber())
    }
    return balances
}

exports.weiToDollar = function(wei, etherPrice) {
    return web3.fromWei(wei,"ether") * etherPrice
}

exports.getRandomInt  = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
/*
  helper function to generate a bunch of tickets for the minting lottery py pulling
  the relevant data from the assessments and generating the hashes
  @param assessments: list of assessments for which to generate tickets (entries are JSON
    objects returned from .js/assessmentFunctions.createAndRunAssessment())
  @param nAssessors: number of assessors to generate tickets for
  @param nSalts: number of tickets to generate per assessor
  */
exports.generateTickets = async function (assessments, nAssessors, nSalts) {
    let tickets = []
    for (let assessment of assessments) {
        let assessmentSaltHex = await assessment.instance.salt.call()
        let maxAss = Math.min(nAssessors, assessment.calledAssessors.length)
        for (let assessor of assessment.calledAssessors.slice(0,maxAss)) {
            let maxTickets = Math.min(nSalts, assessment.cost)
            for (let i=0; i<maxTickets; i++) {
                tickets.push(
                    {
                        inputs: {
                            assessor: assessor,
                            assessment: assessment.address,
                            tokenSalt: i,
                            salt: assessmentSaltHex
                        },
                        hash: jsAssess.hashTicket(
                            assessor,
                            assessment.address,
                            i,
                            assessmentSaltHex)
                    }
                )
            }
        }
    }
    return tickets
}



