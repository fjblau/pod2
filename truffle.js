var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "815e0cac85b64e668250dc9c95db4fe7";
var mnemonic = "best boil fitness usual school key crane razor fluid actor alarm portion";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 4,
      gas: 6612388, // Gas limit used for deploys
      gasPrice: 20000000000, // 20 gwei
    }
  }
};
