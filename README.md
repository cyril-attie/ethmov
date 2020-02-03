# EthMov Project

## Description

The ethMov platform decentralizes transport services. 

On this platform anyone is able to post a packet transportation demand including destination (eth) address, packet size category, packet weight category, destination coordinates, delivery time range category, estimated packet value (for insurance purposes) and price. As well anyone is able to supply the transport service demanded. 

Transportation price is proposed by the demander first but suppliers can make a counter-offers to bargain. Insurance must be paid by the transporter and its price falls as the transporter becomes more experienced. Even though insurance is optional it is recommended for users to configure their proposal to only accept insured transporters.

The transportation and insurance fees brought by the customer and the trnasporter are locked in the contract and only the destination receiver can unlock the funds to the transporter. 


## Set Up For Evaluation

To test the implementation locally start your development blockchain by running Ganache GUI and running `$ truffle test` from the terminal in the project directory. 

To test it on the rinkeby testnet run `$ npm install` and `$ npm start` from the directory and open your browser at localhost:4200. You will just be able to create a transport demand, for the moment.

