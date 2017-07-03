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
exports.mineBlocks = function(blocks) {
    var promises = []
    for(i=0; i < blocks; i++) {
        promises.push(this.mineBlock())
    }
    return Promise.all(promises)
}

exports.mineBlocks2 = function(blocks) {
    var chain = new Promise((resolve, reject) =>(0))
    for(i=0; i < blocks; i++) {
        chain = chain.then(function(){
            return this.mineBlock()
        })
    }
    return chain
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

// exports.getBalances = function(_accounts, _UserRegistryInstance) {
//     balances = []
//     var chain = new Promise((resolve, reject) => resolve(0))
//     for(i=0; i < _accounts.length; i++) {
//         chain = chain.then(function(index) {
//             let tmp = index
//             return _UserRegistryInstance.balances.call(_assessors[index])
//         }).then(function(balance){
//             balances.push(balance) 
//             return tmp += 1
//         })
//     }
//     return [chain, balances]
// }
