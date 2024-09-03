// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

import "./04_ERC20.sol";

contract customERC20 is ERC20 {

    // Constructor del Smart Contract
    constructor() ERC20("Rene", "RE") {}

    // Creacion de nuevos token
    function createToken() public {
        _mint(msg.sender, 1000);
    }
}