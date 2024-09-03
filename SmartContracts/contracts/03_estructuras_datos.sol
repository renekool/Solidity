// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

contract data_structures {

    // Estructura de datos de un cliente
    struct Customer{
        uint256 id;
        string name;
        string email;
    }

    // Variable de tipo "Customer"
    Customer cliente_1 = Customer(1, "Rene", "rene@hotmail.com");

    // Array de enteros de un longitud fija
    uint256 [5] public enteros = [2,3,5,7,11];

    // Array dinamico de enteros
    uint256 [] public enteros_dinamicos;

    // Array dinamicos de "Customers"
    Customer [] public clientes_dinamicos;

    // Nuevos datos en un array
    function array_modification (uint256 _id, string memory _name, string memory _email) public {
        Customer memory random_customer = Customer(_id, _name, _email);
        clientes_dinamicos.push(random_customer);
    }

    // Mappings
    mapping (address => uint256) public address_uint;
    mapping (string => uint256 []) public string_listUnits;
    mapping (address => Customer) public address_dataStructure;

    // Asignar un numero a una direccion
    function assignNumber (uint256 _number) public {
        address_uint[msg.sender] = _number;
    }

    // Asignar varios numeros a una direccion
    function assignList (string memory _name, uint256 _number) public {
        string_listUnits[_name].push(_number);
    }

    // Asignacion de una estructura de datos a una direccion
    function assignDataStructure (uint256 _id, string memory _name, string memory _email) public {
        address_dataStructure[msg.sender] = Customer(_id, _name, _email);
    }
}