// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Donation {
    address public owner;
    mapping(address => uint) public donorAmounts;
    uint public totalDonations;

    event DonationReceived(address indexed donor, uint amount);
    event FundsDistributed(address indexed beneficiary, uint amount);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        require(msg.value > 0, "Can't donate zero Ether");
        donorAmounts[msg.sender] += msg.value;
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function distributeFunds(address payable _beneficiary, uint _amount) public {
        require(msg.sender == owner, "Only owner can distribute funds");
        require(address(this).balance >= _amount, "Insufficient funds");
        _beneficiary.transfer(_amount);
        emit FundsDistributed(_beneficiary, _amount);
    }

    function getTotalDonations() public view returns (uint) {
        return totalDonations;
    }

    function getDonationAmount(address _donor) public view returns (uint) {
        return donorAmounts[_donor];
    }
}
