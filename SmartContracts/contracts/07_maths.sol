// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

contract Maths {

    // Addition function
    function suma(uint256 _a, uint256 _b) public pure returns (uint256) {
        return _a+_b;
    }

    function resta(int256 _a, int256 _b) public pure returns (int256) {
        return _a-_b;
    }

    function prod(uint256 _a, uint256 _b) public pure returns (uint256) {
        return _a*_b;
    }    

    function div(uint256 _a, uint256 _b) public pure returns (uint256) {
        return _a/_b;
    }    

    function expo(uint256 _a, uint256 _b) public pure returns (uint256) {
        return _a**_b;
    } 

    function mod(uint256 _a, uint256 _b) public pure returns (uint256) {
        return _a%_b;
    }        
}