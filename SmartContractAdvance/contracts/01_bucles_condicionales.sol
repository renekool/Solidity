// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

contract loops_condicionals {
    // Suma de los 10 primeros numeros a partir de un numero introducido
    function sumarV1(uint256 _number) public pure returns (uint256) {
        uint256 aux_num = 0;

        // Bucle for
        // i = 10, i <= 20, i++
        for (uint256 i = _number; i <= (10 + _number); i++) {
            aux_num += i;
        }

        return aux_num;
    }

    function sumarV2(uint256 _number) public pure returns (uint256) {
        uint256 n = 11; // Número de términos, desde _number hasta _number + 10 inclusive
        uint256 a = _number; // Primer término de la secuencia
        uint256 l = _number + 10; // Último término de la secuencia

        // Suma de la secuencia aritmética
        uint256 sum = (n * (a + l)) / 2;

        return sum;
    }

    // Suma de los 10 primeros numeros impares
    function impares() public pure returns (uint256) {
        uint256 sum = 0;
        uint256 count = 0;
        uint256 number = 1;

        // Bucle while para sumar los 10 primeros números impares
        while (count < 10) {
            if (number % 2 != 0) {
                sum += number;
                count++;
            }
            number++;
        }

        return sum;
    }

    // Funcion para realizar un suma o una resta
    function operations(
        string memory _operation,
        uint256 _a,
        uint256 _b
    ) public pure returns (uint256) {
        // Hash de la operacion
        bytes32 hash_opertation = keccak256(abi.encodePacked(_operation));

        if (hash_opertation == keccak256(abi.encodePacked("+"))) {
            return _a + _b;
        } else if (hash_opertation == keccak256(abi.encodePacked("-"))) {
            return _a - _b;
        } else if (hash_opertation == keccak256(abi.encodePacked("*"))) {
            return _a * _b;
        } else if (hash_opertation == keccak256(abi.encodePacked("/"))) {
            return _a / _b;
        } else {
            return 0;
        }
    }
}
