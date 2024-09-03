// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

contract functions {

    // Funciones - Pure (No acceden ni siquiera a los datos)
    function getName() public pure returns (string memory) {
        return "Ruby";
    }

    // Funciones - View (No modifica los datos pero si accede a ellos)
    uint256 x = 100;

    function getNumber() public view returns (uint256){
        return x*2;
    }
}