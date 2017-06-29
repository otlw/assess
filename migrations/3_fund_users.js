var UserRegistry = artifacts.require("./UserRegistry.sol");

module.exports = function(deployer) {
    accounts = web3.eth.accounts
    var UserRegistryInstance
    deployer.then(function(){
        return UserRegistry.deployed()
    }).then(function(instance) {
        UserRegistryInstance = instance
        return UserRegistryInstance.firstUser(accounts[0], accounts.length * 100)
    }).then(function(){
        for(i=1; i < accounts.length; i++) {
            UserRegistryInstance.transfer(accounts[i], 100, {from: accounts[0]})
        }
    })
}
