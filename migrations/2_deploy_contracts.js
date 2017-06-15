var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var UserRegistry = artifacts.require("./UserRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
    return deployer.deploy(ConceptRegistry)
  }).then(function(){
    return deployer.deploy(UserRegistry, ConceptRegistry.address)
  }).then(function(){
    return deployer.deploy(Concept, [], UserRegistry.address)
  }).then(function(){
    return ConceptRegistry.deployed()
  }).then(function(instance){
    console.log(Concept.address, UserRegistry.address)
    return instance.init(UserRegistry.address, Concept.address)
  })
};
