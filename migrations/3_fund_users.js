var FathomToken = artifacts.require("./FathomToken.sol");
var accounts, setup;

module.exports = function(deployer) {
    //choose accounts depending on network
  if (deployer.network==="development"){
    console.log("Development network detected, using dev accounts...")
    accounts = web3.eth.accounts.slice(0,9)
  } else if (deployer.network==="rinkeby") {
    var setup = require("./../initialMembers.json")
    console.log("Rinkeby network detected, using provided list of initial members....")
    accounts = setup.accounts
  } else {
    var setup = require("./../initialMembers.json")
    console.log("Unexpected non-development network detected, using provided list of initial members....")
    accounts = setup.accounts
  }
    deployer.then(function(){
        return FathomToken.deployed()
    }).then(function(instance){
        return fundInitialMembers(instance, accounts, 10000000000)
    })
}

// function to repeatedly send funds to one of the initial members
function fundInitialMembers (fathomTokenInstance, _members, _amount) {
    console.log("funding initial members...")
    var chain = new Promise((resolve, reject)=> resolve(1))
    for(i=1; i < _members.length; i++) {
        chain = chain.then(function(index) {
            fathomTokenInstance.transfer(_members[index], _amount)
            return index += 1
        })
    }
    return chain
}

