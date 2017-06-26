var UserRegistry = artifacts.require("./UserRegistry.sol");

module.exports = function(deployer) {
    deployer.then(function(){
        return UserRegistry.deployed()
    }).then(function(instance) {
        return instance.firstUser(web3.eth.accounts[0])
    })
}
