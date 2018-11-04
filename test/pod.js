var Pod = artifacts.require("./POD.sol");
var expectThrow = require("./helper.js");
const truffleAssert = require("truffle-assertions");

contract("POD", function(accounts) {
  var podInstance;
  var owner = accounts[0];
  var carrierAddress = accounts[1];
  var other = accounts[2];

  it("Deploys with One Status", function() {
    return Pod.deployed().then(function(instance) {
      podInstance=instance;
      return podInstance.getStatusCount();
    }).then(function(count) {
      assert.equal(count, 0, "Should be No Status");
    });  
  });

  it("Add Created Status", function() {
    return Pod.deployed().then(function(instance) {
      podInstance=instance;
      return podInstance.addOrderStatus("Created");
    }).then(function(statusList) {
      return podInstance.orderStatusList(0);
    }).then(function(createdStatus) {
      assert.equal(createdStatus[1], owner, "Should be Owner");
      assert.equal(createdStatus[2], "Created", "Should be Created");
      return podInstance.getStatusCount();
    }).then(function(count) {
      assert.equal(count, 1, "Should be 1 Status"); 
    });  
  });

});
