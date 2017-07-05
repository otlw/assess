abi = require('ethjs-abi')
ethereumjsABI = require('ethereumjs-abi')
var UserRegistry = artifacts.require("UserRegistry")
var Assessment = artifacts.require("Assessment")


exports.hashScoreAndSalt = function(_score, _salt, abi) {
    return '0x' + ethereumjsABI.soliditySHA3(
        ["int8", "string"],
        [_score, _salt]
    ).toString('hex')
}

exports.getNotificationArgsFromReceipt = function(_receipt, _topic) {
    var events = [];
    var notificationIndex;
    for(i=0; i < UserRegistry.abi.length; i++) {
        if(UserRegistry.abi[i].name == "Notification" && UserRegistry.abi[i].type == "event"){
            notificationIndex = i;
        }
    }

    for (i=0; i < _receipt.logs.length; i++) {
        if (_receipt.logs[i].topics[0] == "0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876"){
            let event = abi.decodeEvent(UserRegistry.abi[notificationIndex], _receipt.logs[i].data)
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

exports.getAssessment  = function(receiptFromMakeAssessment){
    logs = this.getNotificationArgsFromReceipt(receiptFromMakeAssessment, 0)
    assessmentAddress = logs[0].sender
    assessmentContract = Assessment.at(assessmentAddress)
    return assessmentContract
}

exports.getBalances = async function(_accounts, _userRegistryInstance){
    balances = []
    for (i=0; i<_accounts.length; i++){
        tmp = await this.getBalanceOf(_accounts[i],_userRegistryInstance )
        balances.push(tmp)
    }
    return balances
}
exports.getBalanceOf = async function(_account, _userRegistryInstance){
    balance = await _userRegistryInstance.balances.call(_account)
    return balance.toNumber()
}

