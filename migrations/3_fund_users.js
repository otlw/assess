var FathomToken = artifacts.require("./FathomToken.sol");

// uncomment this when you deploying to rinkeby and wanting to fund specific addresses
// also comment out line 11
// var setup = require("./../initialMembers.json")
// var accounts = setup.accounts

module.exports = function(deployer) {
    accounts = web3.eth.accounts
    deployer.then(function(){
        return FathomToken.deployed()
    }).then(function(instance){
        for(i=1; i < accounts.length; i++) {
            instance.transfer(accounts[i], 10000000000 )
        }
    })
}
