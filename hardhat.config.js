require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: "J6S8N23TRMRH9NNZY5DZYX49C17X3VU25P"
  }
};
