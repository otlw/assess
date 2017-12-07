var HDWalletProvider = require("truffle-hdwallet-provider");
let mnemonic = "vessel caught idle sphere summer aunt motion chat once average eight seat"

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            rpc: {
                host: "localhost",
                port: 8545,
            }
        },
        rinkeby: {
            provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7"),
            network_id: 4,
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
