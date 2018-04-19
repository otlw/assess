var HDWalletProvider = require('truffle-hdwallet-provider')
let mnemonic
try {
  mnemonic = require('./secrets.json')
} catch (e) {
  mnemonic = {seed: 'put your seed words here or in a file called secret. json'}
  console.log('no mnemonic found. Deploying to rinkeby will not work.')
}

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      rpc: {
        host: 'localhost',
        port: 8545
      }
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic.seed, 'https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7'),
      network_id: 4
    },
    kovan: {
      provider: new HDWalletProvider(mnemonic.seed, 'https://kovan.infura.io/2FBsjXKlWVXGLhKn7PF7'),
      network_id: 42
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic.seed, "https://ropsten.infura.io/2FBsjXKlWVXGLhKn7PF7"),
      network_id: 3,
      gas: 1828127,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
