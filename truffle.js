// safe low cost of 8th July 2017: 1 shannon 
var gasPrice = 1000000000; //WATCHOUT: if you change this value you must change it in migrations/2_deploymentScript.js too

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            rpc: {
                host: "localhost",
                port: 8545,
                gasPrice: gasPrice
                //from: accounts[accounts.length - 1]
            }
        }
    }
};
