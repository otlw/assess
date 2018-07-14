var FathomToken = artifacts.require('./FathomToken.sol')
var accounts

const nInitialUsersWithFunds = 9

module.exports = function (deployer) {
  // choose accounts depending on network
  if (deployer.network === 'development') {
    console.log('Development network detected, using dev accounts...')
    accounts = web3.eth.accounts.slice(0, nInitialUsersWithFunds)
  } else if (deployer.network === 'rinkeby') {
    let setup = require('./../initialMembers.json')
    console.log('Rinkeby network detected, using provided list of initial members....')
    accounts = setup.accounts
  } else {
    let setup = require('./../initialMembers.json')
    console.log('Unexpected non-development network detected, using provided list of initial members....')
    accounts = setup.accounts
  }

  deployer.then(async () => {
    let instance = await FathomToken.deployed()
    for (let i = 1; i < accounts.length; i++) {
      await instance.transfer(accounts[i], 10000000000)
    }
  })
}
