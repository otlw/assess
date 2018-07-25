var Math = artifacts.require('./Math.sol')
var Concept = artifacts.require('./Concept.sol')
var Assessment = artifacts.require('./Assessment.sol')
var ConceptRegistry = artifacts.require('./ConceptRegistry.sol')
var ProxyFactory = artifacts.require('./ProxyFactory.sol')
var FathomToken = artifacts.require('./FathomToken.sol')
var Distributor = artifacts.require('./Distributor.sol')
var Minter = artifacts.require('./Minter.sol')

let getAccounts = require('../js/getAccounts.js')

module.exports = function (deployer) {
  deployer.then(async () => {
    let accounts = await getAccounts(deployer.network, web3)
    let mewAccounts = await getAccounts(deployer.network, web3, true)
    await deployer.deploy(Math)
    await deployer.link(Math, [Assessment, Concept, ConceptRegistry, ProxyFactory])

    // set up the proxy factory
    await deployer.deploy(Assessment)
    await deployer.deploy(Concept)
    await deployer.deploy(ProxyFactory, Concept.address, Assessment.address)

    await deployer.deploy(ConceptRegistry)
    await deployer.deploy(Distributor, mewAccounts.length, ConceptRegistry.address)

    let epochLength = 60 * 60 * 24 * 7
    let tokenReward = 100
    await deployer.deploy(Minter, ConceptRegistry.address, epochLength, tokenReward)

    let initialAhaAccount = (await web3.eth.accounts)[0]
    let initialAmount = 10000000000 * (accounts.length)
    await deployer.deploy(
      FathomToken,
      ConceptRegistry.address,
      initialAhaAccount,
      initialAmount,
      Minter.address)
    let minter = await Minter.deployed()
    await minter.init(FathomToken.address)

    let conceptRegistry = await ConceptRegistry.deployed()
    await conceptRegistry.init(FathomToken.address, Distributor.address, ProxyFactory.address)
  })
}
