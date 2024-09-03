// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;


contract Padre {
    // Almacenamiento de la informacion del Factory
    mapping(address => address) public personal_contract;

    // Emision de los nuevos Smart Contracts
    function Factory() public {
        address address_personal_contract = address(new Hijo(msg.sender, address(this)));
        personal_contract[msg.sender] = address_personal_contract;
    }
}

contract Hijo {

    Owner public propietario;

    // Estructura de datos del propietario
    struct Owner {
        address _owner;
        address _smartContractPadre;
    }

    // Datos recibido al nuevo Smart Contract
    constructor(address _account, address _accountSC){
        propietario._owner = _account;
        propietario._smartContractPadre = _accountSC;
    }
}