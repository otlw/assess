var Distributor = artifacts.require('./Distributor.sol')

var initialMewMembers

const nInitialUsers = 6

module.exports = function (deployer) {
  // choose accounts depending on network
  if (deployer.network === 'development') {
    console.log('Development network detected, using dev accounts...')
    initialMewMembers = web3.eth.accounts.slice(0, nInitialUsers)
  } else if (deployer.network === 'rinkeby') {
    let setup = require('./../initialMembers.json')
    console.log('Rinkeby network detected, using provided list of initial members....')
    initialMewMembers = setup.accounts
  } else {
    let setup = require('./../initialMembers.json')
    console.log('Unexpected non-development network detected, using provided list of initial members....')
    initialMewMembers = setup.accounts
  }
  let initialWeights = new Array(initialMewMembers.length).fill(100)

  deployer.then(async () => {
    let DistributorInstance = await Distributor.deployed()
    for (let i = 0; i < initialMewMembers.length; i++) {
      await DistributorInstance.addInitialMember(initialMewMembers[i], initialWeights[i])
    }
  })
}
