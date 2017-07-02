var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var UserRegistry = artifacts.require("./UserRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");
var accounts = web3.eth.accounts
//setup syntax:
// id, parentIds, memberAddresses, memberWeights
// also say how many user there are initially in the system
var setup = [
    [0, [], [accounts[0]],[20]],
    [1, [], [],[]],
    [2, [0], [accounts[1], accounts[2], accounts[3]], [10,10,10]],
    [3, [0],[accounts[4]],[20]]
]
var nInitialUsers = 5;

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
    //add mewConcept
    return deployer.deploy(Concept, [], UserRegistry.address)
  }).then(function(){
    return ConceptRegistry.deployed()
  }).then(function(instance){
    console.log(Concept.address, UserRegistry.address, Distributor.address)
      return instance.init(UserRegistry.address, Concept.address, Distributor.address)
  }).then(function(){
      //add initialConcepts via deployer
      return Distributor.deployed()
  }).then(function(instance){
      distributor = instance
      return distributor.addNextConcept.apply(null, setup[0]) //apply(null, adds elements of setup[0] as individual args)
  }).then(function(){
      return distributor.addNextConcept.apply(null, setup[1])
  }).then(function(){
      return distributor.addNextConcept.apply(null, setup[2])
  }).then(function(){
      return distributor.addNextConcept.apply(null, setup[3])
  }) 
};

module.exports.setupVariable = setup
module.exports.nInitialUsers = nInitialUsers

