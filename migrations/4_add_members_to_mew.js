var Distributor = artifacts.require('./Distributor.sol')
let getAccounts = require('../js/getAccounts.js')

module.exports = function (deployer) {
  deployer.then(async () => {
    let accounts = await getAccounts(deployer.network, web3, true)
    let initialWeights = new Array(accounts.length).fill(100)

    let DistributorInstance = await Distributor.deployed()
    for (let i = 0; i < accounts.length; i++) {
      await DistributorInstance.addInitialMember(accounts[i], initialWeights[i])
    }
  })
}
