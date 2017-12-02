var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var FathomToken = artifacts.require("./FathomToken.sol");
var Distributor = artifacts.require("./Distributor.sol");
var accounts = web3.eth.accounts

// minimal Setup:
// mew + one child, 6 members in mew with weight 100
// note: 5 accounts are needed for the mininal valid assessment, +1 for burnStakes-test

let firstConcept = {
    data:"",
    propRate: 500,
    lifetime: 60*60*24*365
}
let initialMewMembers = accounts.slice(0,6)
let initialWeights = Array(initialMewMembers.length).fill(100)

var mew;

module.exports.nInitialUsers = initialMewMembers.length;
module.exports.etherPrice = 460 //as of 11/2017
module.exports.gasPrice = 1000000000 //safe low cost of 07/07/17

module.exports = function(deployer) {
  var distributor;
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry)
  }).then(function(){
      return deployer.deploy(Distributor, initialMewMembers.length, ConceptRegistry.address)
  }).then(function(){
    return deployer.deploy(FathomToken, ConceptRegistry.address, accounts[0], accounts.length*10000000000)
  }).then(function(){
      return ConceptRegistry.deployed()
  }).then(function(instance){
      conceptRegistryInstance = instance
      return conceptRegistryInstance.init(FathomToken.address, Distributor.address)
  }).then(function(){
      // get mew-concept
      return conceptRegistryInstance.mewAddress.call()
  }).then(function(mew) {
      mewAddress = mew
      //add initialConcept as child
  }).then(function(){
      return Distributor.deployed()
  }).then(function(instance){
      distributor = instance
      return distributor.addConcept(
          [mewAddress],
          [firstConcept.propRate],
          firstConcept.lifetime,
          firstConcept.data
      )
      // add initial members to mew
  }).then(function(){
      return addInitialMembers(distributor, initialMewMembers, initialWeights)
  })
};

module.exports.mew = mew;

// function to repeatedly call addInitialMember of the distributor
function addInitialMembers (distributorInstance, _members, _weights) {
    console.log("adding initial members...")
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _members.length; i++) {
        chain = chain.then(function(index) {
            distributorInstance.addInitialMember(_members[index], _weights[index])
            return index += 1
        })
    }
    return chain
}


