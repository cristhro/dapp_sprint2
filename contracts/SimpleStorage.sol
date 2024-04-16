// SPDX-License-Identifier: MIT

pragma solidity  ^0.8.16;
//pragma solidity >=0.8.16 <= 0.8.25;

contract SimpleStorage {
    uint256 storedData;

    constructor() {
        storedData = 1;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
