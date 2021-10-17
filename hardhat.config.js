/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
const secret = require("./environment/secrets.json");

module.exports = {
  solidity: "0.8.4",
  paths: {
    sources:  "./blockchain/contracts",
    tests:    "./blockchain/test",
    cache:    "./blockchain/cache",
    artifacts:"./blockchain/artifacts"
  },
  networks: {
    mumbai: {
      url:      secret.mumbaiNode,
      accounts: [secret.privateKey]
    }
  },
};
