var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var FathomToken = artifacts.require("./FathomToken.sol");
var Distributor = artifacts.require("./Distributor.sol");
var Minter = artifacts.require("./Minter.sol")

var accounts, nInitialMewMembers;

try {
    //NOTE: a list of initial Members should only be used when deploying to the rinkeby-testnet.
    // When deploying to the local testnet, you want to use the accounts provided
    // by the web3-object, which will only be loaded if no list has been found.
    var setup = require("./../initialMembers.json")
    console.log("Using provided list of initial members. Deploying to testnet won't work!")
    accounts = setup.accounts
    nInitialMewMembers = accounts.length > 5 ? accounts.length : 5
} catch(e) {
    console.log("No list of initial members provided. Deploying to rinkeby won't work.")
    accounts = web3.eth.accounts
    nInitialMewMembers = 6;
}

let initialAhaAccount = accounts[0]
let initialAmount = 10000000000 * (nInitialMewMembers+3)

// nInitialUsers = x; // x many members can be directly added to MEW
// If you want to disable the distributor, you can also comment out its deployment
// (second call of deploy()') or pass a 'address(0)' to the Conceptregistry (last line)

var epochLength = 60*60*24*7
var tokenReward = 100

module.exports = function(deployer) {
  var distributor;
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry)
  }).then(function(){
      return deployer.deploy(Distributor, nInitialMewMembers, ConceptRegistry.address)
  }).then(function(){
      return deployer.deploy(Minter, ConceptRegistry.address, epochLength, tokenReward)
  }).then(function(){
    console.log("sending all initial AHAs to address: ", initialAhaAccount)
      return deployer.deploy(FathomToken, ConceptRegistry.address, initialAhaAccount, initialAmount, Minter.address)
  }).then(function(){
      return Minter.deployed()
  }).then(function(minter){
      return minter.init(FathomToken.address)
  }).then(function(){
      return ConceptRegistry.deployed()
  }).then(function(instance){
      return instance.init(FathomToken.address, Distributor.address)
  })
};
