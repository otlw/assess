var UserRegistry = artifacts.require("./UserRegistry.sol");

module.exports = function(deployer) {
    accounts = web3.eth.accounts
    var UserRegistryInstance
    deployer.then(function(){
        return UserRegistry.deployed()
    }).then(function(instance){
        for(i=1; i < accounts.length; i++) {
            instance.transfer(accounts[i], 100, {from: accounts[0]})
        }
    })
}
