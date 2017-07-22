var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var UserRegistry = artifacts.require("./UserRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");
var accounts = web3.eth.accounts

// var initialConcepts = setup2.tree
//setup syntax:
// id, parentIds, memberAddresses, memberWeights
// also say how many user there are initially in the system
var lifetime = 60*60*24*365;
var setup = [
    [0, [], [500], lifetime, "", [accounts[0]],[20]],
    [1, [], [500], lifetime, "", [],[]],
    [2, [0], [500], lifetime, "", [accounts[1], accounts[2], accounts[3]], [10,10,10]],
    [3, [0], [500],lifetime, "", [accounts[4]],[20]]
]
var nInitialUsers = 5;

module.exports = function(deployer) {
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry, {gas: 6700000})
  }).then(function(){
      return deployer.deploy(Distributor, setup.length, ConceptRegistry.address)
  }).then(function(){
    return deployer.deploy(UserRegistry, ConceptRegistry.address, accounts[0], accounts.length*10000000000)
  }).then(function(){
      return ConceptRegistry.deployed()
  }).then(function(instance){
      return instance.init(UserRegistry.address, Distributor.address)
  }).then(function(){
      //add initialConcepts via deployer
      return Distributor.deployed()
  }).then(function(instance){
      distributor = instance
      initiateConcepts(distributor, setup)
  })
};

function initiateConcepts (distributorInstance, _setup) {
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _setup.length; i++) {
        chain = chain.then(function(index) {
            distributorInstance.addNextConcept.apply(null, _setup[index])
            return index += 1
        })
    }
    return chain
}


module.exports.setupVariable = setup
module.exports.nInitialUsers = nInitialUsers
module.exports.etherPrice = 217 //as of 07/07/2017
module.exports.gasPrice = 1000000000 //safe low cost of 07/07/17 WATCHOUT: if you change this value you must change it in ./truffle.js!!

