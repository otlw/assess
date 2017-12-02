var Math = artifacts.require("./Math.sol");
var Concept = artifacts.require("./Concept.sol");
var Assessment = artifacts.require("./Assessment.sol");
var ConceptRegistry = artifacts.require("./ConceptRegistry.sol");
var FathomToken = artifacts.require("./FathomToken.sol");
var Distributor = artifacts.require("./Distributor.sol");
var accounts = web3.eth.accounts

// setup = getUniformSetup(100, 10, accounts)
setup = defaultSetup()
var nInitialUsers = setup.n

module.exports = function(deployer) {
  var distributor;
  deployer.deploy(Math);
  deployer.link(Math, [Assessment, Concept, ConceptRegistry])
  deployer.then( function(){
      return deployer.deploy(ConceptRegistry)
  }).then(function(){
      return deployer.deploy(Distributor, setup.tree.length, ConceptRegistry.address)
  }).then(function(){
    return deployer.deploy(FathomToken, ConceptRegistry.address, accounts[0], accounts.length*10000000000)
  }).then(function(){
      return ConceptRegistry.deployed()
  }).then(function(instance){
      return instance.init(FathomToken.address, Distributor.address)
  }).then(function(){
      //add initialConcepts via deployer
      return Distributor.deployed()
  }).then(function(instance){
      distributor = instance
      instance.init()
  }).then(function(){
      return initiateConcepts(distributor, setup.tree, accounts)
  }).then(function() {
      return initiateMembers(distributor, setup.tree)
  })
};

function initiateConcepts (distributorInstance, _setup, accounts) {
    console.log("deploying initial Concepts...")
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _setup.length; i++) {
        chain = chain.then(function(index) {
            distributorInstance.addNextConcept(_setup[index][0], _setup[index][1],
                                               _setup[index][2], _setup[index][3],
                                               _setup[index][4].length,
                                               {from:accounts[index]})
            return index += 1
        })
    }
    return chain
}

function initiateMembers (distributorInstance, _setup) {
    console.log("adding initial members...")
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _setup.length; i++) {
        chain = chain.then(function(index) {
            addInitialMembers(distributorInstance, index + 1, _setup[index][4], _setup[index][5]) // +1 because 0 is mew
            return index += 1
        })
    }
    return chain
}

function addInitialMembers(distributorInstance, _conceptId, _members, _weights) {
    var chain = new Promise((resolve, reject)=> resolve(0))
    for(i=0; i < _members.length; i++) {
        chain = chain.then(function(index) {
            distributorInstance.addInitialMember(_conceptId, _members[index], _weights[index])
            return index += 1
        })
    }
    return chain
}

function getUniformSetup(n, bins, accounts) {
    // uniform distribution
    var lifetime = 60*60*24*365;
    var stairs = []
    for (i=0; i<bins; i++) {
        stairs = stairs.concat(Array(n/bins).fill(10*(i+1)))
    }
    uniformUsers = accounts.slice(0,n)
    //setup syntax:
    // id, data, parentIds, propagationRates,lifetime, memberAddresses, memberWeights
    setup = [
        ["", [0], [500], lifetime, [], []],
        ["", [1], [500], lifetime, [], []],
        ["", [2], [500], lifetime, [], []],
        ["", [3], [500], lifetime, [], []],
        ["", [4], [500], lifetime, uniformUsers, stairs]
    ]

    nInitialUsers = n //uniformUsers.length
    return {tree: setup, n: nInitialUsers}
}

function defaultSetup(){
    // create five groups of initial Users and five sets of different weights
    nInitialUserGroups = 5
    groupSize = 8
    users = []
    initialWeights = []
    lifetime = 60*60*24*365;
    for (i=0; i<nInitialUserGroups; i++) {
        users.push(accounts.slice(i*groupSize, (i+1) * groupSize))
        initialWeights.push(Array(groupSize).fill(10*(i+1)))
    }
    //setup syntax:
    // data, parentIds, propagationRates,lifetime, memberAddresses, memberWeights
    var setup = [
        ["", [0], [500], lifetime, users[0], initialWeights[3]], // concept will have id 1 (0 is mew)
        ["", [0], [500], lifetime, users[1], initialWeights[1]], // id 2
        ["", [1], [500], lifetime, users[2], initialWeights[2]], // id 3
        ["", [2], [500], lifetime, users[3], initialWeights[3]], // ...
        ["", [3], [500], lifetime, users[4], initialWeights[3]]
    ]
    return {tree: setup, n: setup.length * groupSize}
}

module.exports.setupVariable = setup.tree
module.exports.nInitialUsers = setup.n
module.exports.etherPrice = 217 //as of 07/07/2017
module.exports.gasPrice = 1000000000 //safe low cost of 07/07/17 WATCHOUT: if you change this value you must change it in ./truffle.js!!

