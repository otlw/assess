/*
  Script to save a local deployment from the untracked build-folder to the indexed
  'deployments'-folder
  Later: this should be extended to ask for a description and to use versioning
  Usage: node saveDeployedNetwork.js
*/

var fs = require('fs')
var extend = require('xtend')

let networkIDs = {
  rinkeby: '4'
  // local: '1524617274425'
}

// can be passed as arg or queried by CLI later on
let networkToBeCopied = 'rinkeby'
let networkID = networkIDs[networkToBeCopied]

console.log('Saving local data for ', networkToBeCopied, '-deployment...')

// read all exising contract objects
let contractArtifacts = []
fs.readdirSync('./build/contracts/').forEach(file => {
  if (file !== 'StandardToken.json' && file !== 'Token.json') {
    contractArtifacts.push(file)
  }
})

// extract their deployment data, create a JSON object
let deployment = {contracts: {}, metadata: {}}
for (var artifact of contractArtifacts) {
  let location = '../build/contracts/' + artifact
  let json = require(location)
  let contractName = json.contractName
  if (json.networks.hasOwnProperty(networkID)) {
    deployment.contracts[contractName] = {}
    deployment.contracts[contractName].abi = extend({}, json.abi)
    deployment.contracts[contractName].bytecode = extend({}, json.bytecode)
    deployment.contracts[contractName].deployedBytecode = extend({}, json.deployedBytecode)
    deployment.contracts[contractName].networkData = extend({}, json.networks[networkID])
  } else {
    console.log('ERROR: Could not find a local deployment data for', artifact, ' on ', networkToBeCopied)
  }
}
// add metadata
deployment.metadata.date = Date.now()
deployment.metadata.description = 'test'

// save JSON to deployments-folder
let targetLocation = './deployments/' + networkToBeCopied + '.json'
fs.writeFile(targetLocation, JSON.stringify(deployment), (err) => {
  if (err) {
    console.log('ERROR: writing to file failed:', err)
  } else {
    console.log('Success! Written to ', targetLocation)
  }
})
