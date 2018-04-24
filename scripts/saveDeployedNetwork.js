/*
  Script to save a local deployment from the untracked build-folder to the indexed
  'deployments'-folder
  Later: this should be extended to ask for a description and to use versioning
  Usage: node saveDeployedNetwork.js
*/

var fs = require('fs')

let networkIDs = {
  rinkeby: '4',
  local: '1524617849012'
}

// can be passed as arg or queried by CLI later on
// let networkToBeCopied = 'rinkeby'
let networkToBeCopied = 'local'
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
  let path = './build/contracts/' + artifact
  let json = JSON.parse(fs.readFileSync(path))
  console.log('json ', artifact, ' ',  json.networks)
  let contractName = json.contractName
  if (json.networks.hasOwnProperty(networkID)) {
    deployment.contracts[contractName] = {}
    deployment.contracts[contractName].abi = json.abi
    // console.log('abi type', typeof deployment.contracts[contractName].abi)//Object.keys(typeof deployment.contracts[contractName].abi))
    // deployment.contracts[contractName].bytecode = json.bytecode
    // deployment.contracts[contractName].deployedBytecode = json.deployedBytecode
    deployment.contracts[contractName].networkData = json.networks[networkID]
  } else {
    console.log('ERROR: Could not find a local deployment data for', artifact, ' on ', networkToBeCopied)
  }
}
// add metadata
deployment.metadata.date = Date.now()
deployment.metadata.description = 'test'
// console.log('deployment',deployment.contracts['Math'].abi)

// save JSON to deployments-folder
let targetLocation = './deployments/' + networkToBeCopied + '.json'
fs.writeFileSync(targetLocation, JSON.stringify(deployment))
console.log('deployment saved at: targetLocation ',targetLocation )
