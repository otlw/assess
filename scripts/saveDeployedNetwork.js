var fs = require('fs')
var extend = require('xtend')

let networkIDs = {
  rinkeby: '4'
}

// can be passed as arg or queried by CLI later on
let networkToBeCopied = 'rinkeby'

let contractArtifacts = []
fs.readdirSync('./build/contracts/').forEach(file => {
  contractArtifacts.push(file)
})

let deployment = {}
for (var artifact of contractArtifacts) {
  let location = '../build/contracts/' + artifact
  let json = require(location)
  let networkID = networkIDs[networkToBeCopied]
  if (json.networks.hasOwnProperty(networkID)) {
    deployment[artifact] = {}
    deployment[artifact].abi = extend({}, json.abi)
    deployment[artifact].networkData = extend({}, json.networks[networkID])
    deployment.date = Date.now()
    deployment.description = 'test'
  } else {
    if (artifact !== 'StandardToken.json' && artifact !== 'Token.json') {
      console.log('ERROR: Could not find a local deployment data for', artifact, ' on ', networkToBeCopied)
    }
  }
}

let targetLocation = './deployments/' + networkToBeCopied + '.json'
fs.writeFile(targetLocation, JSON.stringify(deployment), (err) => {
  if (err) {
    console.log('ERROR: writing to file failed:', err)
  } else {
    console.log('Success! Written to ', targetLocation)
  }
})
