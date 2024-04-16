//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  deployer.deploy(Auction);
};
