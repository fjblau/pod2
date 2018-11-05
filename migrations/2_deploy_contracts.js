//var Pod = artifacts.require("./POD.sol");
var carrierOrders = artifacts.require("./carrierOrders.sol");

module.exports = function(deployer) {
  //deployer.deploy(Pod);
  deployer.deploy(carrierOrders, "Carrier One");
};