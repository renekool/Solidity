// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

contract Food {

    // Estructura de datos
    struct dinnerPlate {
        string name;
        string ingredients;
    }

    // Menu del dia
    dinnerPlate [] menu;

    // Creacion de un nuevo menu
    function newMenu(string memory _name, string memory _ingredients) internal {
        // Creacion del nuevo elemento en el menu 
        menu.push(dinnerPlate(_name, _ingredients));
    }
}


contract Hamburguer is Food {

    address public owner;

    constructor (){
        owner = msg.sender;
    } 

    // Cocinar una hamburguesa desde el Smart Contract principal
    function doHamburguer(string memory _ingredients, uint _units) external  {
        require(_units <= 5, "Ups, no puedes pedir tantas hamburguesas");
        newMenu("Hamburguesa", _ingredients);
    }

    // Modifier: Permitir el acceso unicamente al owner
    modifier onlyOwner(){
        require(owner == msg.sender, "No tienes autorizacion para ejecutar esta funcion");
        _;
    }

    // Restriccion a la ejecucion (Solo puede acceder el owner)
    function hashPrivateNumber(uint _number) public view onlyOwner returns (bytes32)  {
        return keccak256(abi.encodePacked(_number));
    }
}