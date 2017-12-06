var abi = require('ethjs-abi');
var ethereumjsABI = require('ethereumjs-abi');
var FathomToken = artifacts.require("FathomToken");
var Assessment = artifacts.require("Assessment");

exports.hashScoreAndSalt = function(_score, _salt, abi) {
    return '0x' + ethereumjsABI.soliditySHA3(["int128", "string"], [_score, _salt]).toString('hex');
};

exports.getNotificationArgsFromReceipt = function(_receipt, _topic) {
    var events = [];
    var notificationIndex;
    for (var i = 0; i < FathomToken.abi.length; i++) {
        if (FathomToken.abi[i].name === "Notification" && FathomToken.abi[i].type === "event") {
            notificationIndex = i;
        }
    }

    for (var j = 0; j < _receipt.logs.length; j++) {
        if (_receipt.logs[j].topics[0] === "0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876") {
            let event = abi.decodeEvent(FathomToken.abi[notificationIndex], _receipt.logs[j].data);
            if (_topic === -1) {
                events.push({user: event.user, sender: event.sender, topic: event.topic.toNumber()});
            } else if (event.topic.toNumber() === _topic) {
                events.push({user: event.user, sender: event.sender, topic: event.topic.toNumber()});
            }
        }
    }
    return events;
};

exports.evmIncreaseTime = function(seconds) {
    return new Promise(function (resolve, reject) {
        return web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [seconds],
            id: new Date().getTime()
        }, function (error, result) {
            return error ? reject(error) : resolve(result.result);
        });
    });
};

exports.getCalledAssessors = function(receiptFromMakeAssessment) {
    var calledAssessors = [];
    callsToAssessors = this.getNotificationArgsFromReceipt(receiptFromMakeAssessment, 1);
    for (var a = 0; a < callsToAssessors.length; a++) {
        calledAssessors.push(callsToAssessors[a].user);
    }
    return calledAssessors;
};

exports.getBalances = async function(_accounts, _userRegistryInstance) {
    var balances = [];
    for (var i = 0; i < _accounts.length; i++) {
        var tmp = await _userRegistryInstance.balanceOf.call(_accounts[i]);
        balances.push(tmp.toNumber());
    }
    return balances;
};

exports.getEthBalances = function(_accounts) {
    var balances = [];
    for (var i = 0; i < _accounts.length; i++) {
        balances.push(web3.eth.getBalance(_accounts[i]).toNumber());
    }
    return balances;
};

exports.weiToDollar = function(wei, etherPrice) {
    return web3.fromWei(wei,"ether") * etherPrice;
};

exports.getRandomInt  = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};
