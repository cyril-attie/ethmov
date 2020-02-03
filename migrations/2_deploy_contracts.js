var Withdrawal = artifacts.require("./Withdrawal.sol");
var EthMov = artifacts.require("./EthMov.sol");

module.exports = function(deployer) {
  deployer.deploy(Withdrawal).then(()=>
  deployer.deploy(EthMov));
};
