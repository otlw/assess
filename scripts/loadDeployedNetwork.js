/*
  Script to load a deployment from indexed 'deployments'-folder to the local, untracked
  build-folder. If contracts are not yet existent, a minimal dummy artifact will be inserted
  Later: this should be extended to ask for a description and to use versioning
  Usage: node loadDeployedNetwork.js
*/
var fs = require('fs')
var extend = require('xtend')
let minimalArtifact = { // TODO to be tested
  contractName: '',
  abi: [],
  bytecode: null,
  deployedBytecode: null,
  networks: {
    '4': {}
  }
}

let networkIDs = {
  rinkeby: '4',
  // local: '1524617274425'
}
// can be passed as arg or queried by CLI later on
let networkToBeCopied = 'rinkeby'
let networkID = networkIDs[networkToBeCopied]

console.log('Loading repository data for ', networkToBeCopied, '-deployment...')

// load deployment data
let deployment
try {
  deployment = require('../deployments/' + networkToBeCopied + '.json')
} catch (e) {
  console.log('ERROR: no deployment found for network', networkToBeCopied)
}

// console.log('deployemt', Object.keys(deployment))

// overwrite each artifact with data from the deployment
let success = true
for (let contractName of Object.keys(deployment.contracts)) {
  let localJson
  let path = './build/contracts/' + contractName + '.json'
  try {
    localJson = require('.' + path)
  } catch (e) {
    console.log('no artifact found for contract:', contractName, ' -> creating minimal dummy Artifact')
    localJson = extend(minimalArtifact, {contractName: contractName})
  }
  // console.log('localJson',Object.keys(localJson))
  localJson.abi = deployment.contracts[contractName].abi
  localJson.bytecode = deployment.contracts[contractName].bytecode
  localJson.deployedBytecode = deployment.contracts[contractName].deployedBytecode
  localJson.networks[networkID] = deployment.contracts[contractName].networkData
  // localJson.bogus = 'ahahahahahahahah'
  // save modified JSON to build-folder
  try {
    fs.writeFileSync(path, JSON.stringify(localJson))//, (err) => {
  } catch (e) {
    console.log('Please check if a /build folder exists. If not run "truffle migrate" once')
    success = false
    break
  }
}

if (success) { console.log('Success: Deployment saved to local build folder.') }

