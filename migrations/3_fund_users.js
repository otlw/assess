var UserRegistry = artifacts.require("./UserRegistry.sol");

module.exports = function(deployer) {
    accounts = web3.eth.accounts
    var UserRegistryInstance
    deployer.then(function(){
        return UserRegistry.deployed()
    }).then(function(instance){
        for(i=1; i < accounts.length; i++) {
            instance.transfer(accounts[i], 10000000000, {from: accounts[0]})
        }
    }).then(function(){
        web3.eth.sendTransaction({from:accounts[0], to:"0xcA2628422FcC668aba0a2b8D38c582302EA1bE60", value: web3.toWei(10, "ether")})
    })
}
