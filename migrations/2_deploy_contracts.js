var Math = artifacts.require('./Math.sol')
var Concept = artifacts.require('./Concept.sol')
var Assessment = artifacts.require('./Assessment.sol')
var ConceptRegistry = artifacts.require('./ConceptRegistry.sol')
var FathomToken = artifacts.require('./FathomToken.sol')
var Distributor = artifacts.require('./Distributor.sol')
var Minter = artifacts.require('./Minter.sol')

var accounts, nInitialMewMembers

// nInitialUsers = x; // x many members can be directly added to MEW
// If you want to disable the distributor, you can also comment out its deployment
// (second call of deploy()') or pass a 'address(0)' to the Conceptregistry (last line)

module.exports = function (deployer) {
  // choose accounts depending on network
  if (deployer.network === 'development') {
    console.log('Development network detected, using dev accounts...')
    accounts = web3.eth.accounts
    nInitialMewMembers = 6
  } else if (deployer.network === 'rinkeby') {
    let setup = require('./../initialMembers.json')
    console.log('Rinkeby network detected, using provided list of initial members....')
    accounts = setup.accounts
    nInitialMewMembers = accounts.length > 5 ? accounts.length : 5
  } else {
    let setup = require('./../initialMembers.json')
    console.log('Unexpected non-development network detected, using provided list of initial members....')
    accounts = setup.accounts
    nInitialMewMembers = accounts.length > 5 ? accounts.length : 5
  }

  deployer.then(async () => {
    await deployer.deploy(Math)
    await deployer.link(Math, [Assessment, Concept, ConceptRegistry])
    await deployer.deploy(ConceptRegistry)
    await deployer.deploy(Distributor, nInitialMewMembers, ConceptRegistry.address)

    let epochLength = 60 * 60 * 24 * 7
    let tokenReward = 100
    await deployer.deploy(Minter, ConceptRegistry.address, epochLength, tokenReward)

    let initialAhaAccount = await web3.eth.accounts[0]
    let initialAmount = 10000000000 * (nInitialMewMembers + 3)
    await deployer.deploy(
      FathomToken,
      ConceptRegistry.address,
      initialAhaAccount,
      initialAmount,
      Minter.address)
    let minter = await Minter.deployed()
    await minter.init(FathomToken.address)

    let conceptRegistry = await ConceptRegistry.deployed()
    await conceptRegistry.init(FathomToken.address, Distributor.address)
  })
}
