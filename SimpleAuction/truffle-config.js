module.exports = {
  networks: {
    ganache: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*"
    },
  },
  // Configure your compilers
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',  
  compilers: {
    solc: {
      version: "0.8.4",
    }
  },
};