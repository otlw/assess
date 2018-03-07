var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");

var initialMewMembers;

try {
    //NOTE: this should only be used when deploying to the rinkeby-testnet.
    // For development please use the accounts from the web3-object
    var setup = require("./../initialMembers.json")
    console.log("using provided list of initial members")
    initialMewMembers = setup.accounts;
}
catch(e) {
    let accounts = web3.eth.accounts
    // minimal Setup: 6 members in mew with weight 100
    // note: 5 accounts are needed for the mininal valid assessment, +1 for burnStakes-test
    var nInitialUsers = 6
    initialMewMembers = accounts.slice(0,nInitialUsers)
}

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
            console.log("added ", _members[index], "to MEW")
            return index += 1
        })
    }
    return chain
}


