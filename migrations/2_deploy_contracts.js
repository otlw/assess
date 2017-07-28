var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var UserRegistry = artifacts.require("./UserRegistry.sol");
var Distributor = artifacts.require("./Distributor.sol");
var accounts = web3.eth.accounts

// var initialConcepts = setup2.tree
//setup syntax:
// id, data, parentIds, propagationRates,lifetime, memberAddresses, memberWeights

var lifetime = 60*60*24*365;
var setup1 = [
    [0, "", [], [500], lifetime, [accounts[0]],[20]],
    [1, "", [], [500], lifetime,  [],[]],
    [2, "", [0], [500], lifetime, [accounts[1], accounts[2], accounts[3]], [10,10,10]],
    [3, "", [0], [500],lifetime, [accounts[4]],[20]]
]
var nInitialUsers = 5;

// uniform distribution
var n = 100;
uniform = Array(n).fill(10)
var stairs = []
steps = 10;
for (i=0; i<steps; i++) {
    stairs = stairs.concat(Array(n/steps).fill(10*(i+1)))
}
uniformUsers = accounts.slice(0,n)
var setup2 = [
    [0, "", [], [500], lifetime, [], []],
    [1, "", [0], [500], lifetime, [], []],
    [2, "", [1], [500], lifetime, [], []],
    [3, "", [2], [500], lifetime, [], []],
    [4, "", [3], [500], lifetime, uniformUsers, stairs]
    ]

nInitialUsers = n //uniformUsers.length

setup = setup2
// setup = setup1

module.exports = function(deployer) {
  var distributor;
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry)
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
      return initiateConcepts(distributor, setup, accounts)
  }).then(function() {
      return initiateMembers(distributor, setup)
  })
};

function initiateConcepts (distributorInstance, _setup, accounts) {
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _setup.length; i++) {
        chain = chain.then(function(index) {
            distributorInstance.addNextConcept(_setup[index][0], _setup[index][1],
                                               _setup[index][2], _setup[index][3],
                                               _setup[index][4], _setup[index][5].length,
                                               {from:accounts[index]})
            return index += 1
        })
    }
    return chain
}

function initiateMembers (distributorInstance, _setup) {
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _setup.length; i++) {
        chain = chain.then(function(index) {
            addInitialMembers(distributorInstance, setup[index][0], _setup[index][5], _setup[index][6])
            return index += 1
        })
    }
    return chain
}
function addInitialMembers(distributorInstance, _conceptId, _members, _weights) {
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _members.length; i++) {
        chain = chain.then(function(index) {
            // console.log("add member" + index + " to concept" + _conceptId)
            distributorInstance.addInitialMember(_conceptId, _members[index], _weights[index])
            return index += 1
        })
    }
    return chain
}
//maybe use this once everything else works
/*
async function initiateConcepts2 (distributorInstance, _setup) {
    for(i=0; i < _setup.length; i++) {
        // await distributorInstance.addNextConcept.apply(null, _setup[i])
        await distributorInstance.addNextConcept(_setup[i][0], _setup[i][1], _setup[i][2], _setup[i][3], _setup[i][4], _setup[i][5], _setup[i][6])
    }
}

module.exports = async function(deployer) {
    deployer.deploy(Math);
    deployer.link(Math, [Assessment, Concept, ConceptRegistry])
    deployer.deploy(ConceptRegistry)
    console.log(ConceptRegistry.address)
    deployer.deploy(Distributor, setup.length, ConceptRegistry.address)
    deployer.deploy(UserRegistry, ConceptRegistry.address, accounts[0], accounts.length*10000000000)
    let conceptReg = await ConceptRegistry.deployed() ///hacky code after here: unclear on whether 
    await conceptReg.init(UserRegistry.address, Distributor.address)
    let distributor = await Distributor.deployed()
 deployer.deploy(UserRegiAddableMembers.address, accounts[0], accounts.length*10000000000)
 let conceptReg = await CinitialM;
 await conceptReg.init(UserRegistry.address, Distributor.address)

    // await initiateConcepts2(distributor, setup)
}
*/

module.exports.setupVariable = setup
module.exports.nInitialUsers = nInitialUsers
module.exports.etherPrice = 217 //as of 07/07/2017
module.exports.gasPrice = 1000000000 //safe low cost of 07/07/17 WATCHOUT: if you change this value you must change it in ./truffle.js!!

