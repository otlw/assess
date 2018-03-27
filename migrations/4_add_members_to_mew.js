var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");

var initialMewMembers;


module.exports = function(deployer) {
  //choose accounts depending on network
  if (deployer.network==="development"){
    console.log("Development network detected, using dev accounts...")
    initialMewMembers = web3.eth.accounts.slice(0,6)
  } else if (deployer.network==="rinkeby") {
    var setup = require("./../initialMembers.json")
    console.log("Rinkeby network detected, using provided list of initial members....")
    initialMewMembers = setup.accounts
  } else {
    var setup = require("./../initialMembers.json")
    console.log("Unexpected non-development network detected, using provided list of initial members....")
    initialMewMembers = setup.accounts
  }
  let initialWeights = new Array(initialMewMembers.length).fill(100)

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


