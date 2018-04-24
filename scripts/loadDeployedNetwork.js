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
  networks: {
    '4': {}
  }
}

let networkIDs = {
  rinkeby: '4',
  local: '1524484386734'
}
// can be passed as arg or queried by CLI later on
let networkToBeCopied = 'local'//'rinkeby'
let networkID = networkIDs[networkToBeCopied]

// load deployment data
let deployment
try {
  deployment = require('../deployments/' + networkToBeCopied + '.json')
} catch (e) {
  console.log('ERROR: no deployment found for network', networkToBeCopied)
}

// console.log('deployemt', Object.keys(deployment))

// overwrite each artifact with data from the deployment
for (let contractName of Object.keys(deployment.contracts)) {
  let localJson
  try {
    localJson = require('../build/contracts/' + contractName + '.json')
  } catch (e) {
    console.log('no artifact found for contract:', contractName, ' -> creating minimal dummy Artifact')
    localJson = extend(minimalArtifact, {contractName: contractName})
  }
  // console.log('localJson',Object.keys(localJson))
  localJson.abi = deployment.contracts[contractName].abi
  localJson.networks[networkID] = deployment.contracts[contractName].networkData
  // localJson.bogus = 'ahahahahahahahah'
  // save modified JSON to build-folder
  fs.writeFile('./build/contracts/' + contractName + '.json', JSON.stringify(localJson), (err) => {
    if (err) {
      console.log('ERROR: writing to file failed:', err)
    } else {
      console.log('Success! ', contractName, ' successfully modified')
    }
  })
}

// console.log('Success!')

