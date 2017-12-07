var FathomToken = artifacts.require("./FathomToken.sol");
var deploymentSetup = require("../deployment/deploymentSetup.js")
// var accounts = deploymentSetup.setup.accounts

module.exports = function(deployer) {
    accounts = web3.eth.accounts
    deployer.then(function(){
        return FathomToken.deployed()
    }).then(function(instance){
        for(i=1; i < accounts.length; i++) {
            instance.transfer(accounts[i], 10000000000, {from: accounts[0]})
        }
    })
}
