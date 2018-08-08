var FathomToken = artifacts.require('./FathomToken.sol')
let getAccounts = require('../js/getAccounts.js')

module.exports = function (deployer) {
  deployer.then(async () => {
    let accounts = await getAccounts(deployer.network, web3)
    let instance = await FathomToken.deployed()
    for (let i = 1; i < accounts.length; i++) {
      await instance.transfer(accounts[i], 100000000000)
    }
  })
}
