var FathomToken = artifacts.require("./FathomToken.sol");
var accounts, setup;

try {
    //NOTE: this should only be used when deploying to the rinkeby-testnet.
    // For development please use the accounts from the web3-object
    console.log("using provided list of initial members.")
    setup = require("./../initialMembers.json")
    accounts = setup.accounts
}
catch(e) {
    var nInitialUsers = 6
    accounts = web3.eth.accounts.slice(6)
}

module.exports = function(deployer) {
    deployer.then(function(){
        return FathomToken.deployed()
    }).then(function(instance){
        fundInitialMembers(instance, accounts, 10000000000)
    })
}

// function to repeatedly send funds to one of the initial members
function fundInitialMembers (fathomTokenInstance, _members, _amount) {
    console.log("adding initial members...")
    var chain = new Promise((resolve, reject)=> resolve(1))
    for(i=1; i < _members.length; i++) {
        chain = chain.then(function(index) {
            fathomTokenInstance.transfer(_members[index], _amount)
            console.log("transfering ", _amount, " AHAs to", _members[index])
            return index += 1
        })
    }
    return chain
}

