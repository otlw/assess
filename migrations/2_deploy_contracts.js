var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var FathomToken = artifacts.require("./FathomToken.sol");
var Distributor = artifacts.require("./Distributor.sol");
var Minter = artifacts.require("./Minter.sol")

// uncomment this to deploy to rinkeby with specific users
// var setup = require("./../initialMembers.json")
// var accounts = setup.accounts
// var nInitialUsers = accounts.length;

// deploy to development-network
var accounts = web3.eth.accounts
var nInitialUsers = 6;

var epochLength = 60000
var tokenReward = 100

module.exports = function(deployer) {
  var distributor;
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry)
  }).then(function(){
      return deployer.deploy(Distributor, nInitialUsers, ConceptRegistry.address)
  }).then(function(){
      return deployer.deploy(Minter, epochLength, tokenReward)
  }).then(function(){
      return deployer.deploy(FathomToken, ConceptRegistry.address, accounts[0], accounts.length*10000000000, Minter.address)
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
