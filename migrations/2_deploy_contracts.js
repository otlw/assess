var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var FathomToken = artifacts.require("./FathomToken.sol");
var Distributor = artifacts.require("./Distributor.sol");

var accounts, nInitialUsers;

try {
    //NOTE: this should only be used when deploying to the rinkeby-testnet.
    // For development please use the accounts from the web3-object
    // Using lis
    console.log("Using provided list of initial members. NOTE: Deploying to testnet won't work!")
    var setup = require("./../initialMembers.json")
    accounts = setup.accounts
    nInitialUsers = accounts.length;
} catch(e) {
    console.log("No list of initial members provided. Using web3-accounts.")
    accounts = web3.eth.accounts
    nInitialUsers = 6;
}

let initialAhaAccount = accounts[0]
let initialAmount = 10000000000 * nInitialUsers

// nInitialUsers = x; // x many members can be directly added to MEW
// If you want to disable the distributor, you can also comment out its deployment
// (line 34) or pass a 'address(0)' to the Conceptregistry (line 41)

module.exports = function(deployer) {
  var distributor;
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry)
  }).then(function(){
      return deployer.deploy(Distributor, nInitialUsers, ConceptRegistry.address)
  }).then(function(){
    console.log("sending all initial AHAs to address: ", accounts[0])
    return deployer.deploy(FathomToken, ConceptRegistry.address, initialAhaAccount, initialAmount)
  }).then(function(){
      return ConceptRegistry.deployed()
  }).then(function(instance){
      return instance.init(FathomToken.address, Distributor.address)
  })
};
