var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var UserRegistry = artifacts.require("./UserRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");
var accounts = web3.eth.accounts
var setup = [
    [0, [], []],
    [1, [0], [accounts[0]]],
    [2, [0], []],
    [3, [2],[accounts[1],accounts[2]]]
    ]

module.exports = function(deployer) {
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
    return deployer.deploy(ConceptRegistry)
  }).then(function(){
      return deployer.deploy(Distributor, setup.length, ConceptRegistry.address)
  }).then(function(){
    return deployer.deploy(UserRegistry, ConceptRegistry.address, accounts[0], accounts.length*100)
  }).then(function(){
    return deployer.deploy(Concept, [], UserRegistry.address)
  }).then(function(){
    return ConceptRegistry.deployed()
  }).then(function(instance){
    console.log(Concept.address, UserRegistry.address)
      return instance.init(UserRegistry.address, Concept.address, Distributor.address)
  })
};
