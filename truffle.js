const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
       
     networks: {
         development: {
              host: "localhost",
              port: 8545,
              network_id: "*" // Match any network id
            },
          
       rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/25be2de0c88c487583f3b4ec2231eb7f`),
      network_id: 4,       
      gas: 5500000,        
      confirmations: 2,    
      timeoutBlocks: 200,  
      skipDryRun: true     
    }
}
};
