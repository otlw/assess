var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");

// development-network:
// minimal Setup: 6 members in mew with weight 100
// note: 5 accounts are needed for the mininal valid assessment, +1 for burnStakes-test
var accounts = web3.eth.accounts
var nInitialUsers = 6
let initialMewMembers = accounts.slice(0,nInitialUsers)

// rinkeby: addresses to be in mew
// var setup = require("./../initialMembers.json")
// var initialMewMembers = setup.accounts;

let initialWeights = new Array(initialMewMembers.length).fill(100)

module.exports = function(deployer) {
  deployer.then( function(){
      return ConceptRegistry.deployed()
  }).then(function(instance){
      conceptRegistryInstance = instance
      // get mew-concept
      return conceptRegistryInstance.mewAddress.call()
  }).then(function(mew) {
      mewAddress = mew
      //add initialConcept as child
  }).then(function(){
      return Distributor.deployed()
  }).then(function(instance){
      // add initial members to mew
      distributor = instance
  }).then(function(){
      return addInitialMembers(distributor, initialMewMembers, initialWeights)
  })
};

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


