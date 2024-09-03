// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4;

contract TiendaVideoJuegos {
    // Arreglo privado que contiene los juegos
    string[] private juegos;

    // Mapeo del inventario de juegos
    mapping(string => uint256) private inventario;

    // Constructor para inicializar algunos juegos
    constructor() {
        
        // Agrega un juego al arreglo de juegos
        juegos.push("Call of Duty");
        juegos.push("Borderlands");
        juegos.push("Super Mario");
        juegos.push("Minecraft");
        juegos.push("Fornite");
    }

    // Funcion publica para ver los juegos disponibles
    function verJuegos() public view returns (string[] memory) {
        // Devuelve un arreglo de juegos
        return juegos;
    }

    // Funcion privada para calcular un descuento
    function calcularDescuento(uint256 precio) private pure returns (uint256) {
        // Devuelve el 15% de un precio
        uint256 descuento = (precio * 15) / 100;

        // Calcula el nuevo precio con el descuento
        return precio - descuento;
    }

    // Ejemplo de como usar la funcion privada dentro de otra funcion
    function comprarConDescuento(uint256 precio) public pure returns (uint256) {
        uint256 precioConDescuento = calcularDescuento(precio);
        return precioConDescuento;
    }

    // Funcion interna para actualizar el inventario
    function actualizarInventario(string memory _juego, uint256 _cantidad) internal {
        // Actualiza el inventario de un juego
        inventario[_juego] += _cantidad;
    }

    // Funcion publica para agregar juegos al inventario
    function agregarJuego(string memory _juego, uint256 _cantidad) public {
        actualizarInventario(_juego, _cantidad);
    }

    // Función para ver el inventario de un juego específico
    function verInventario(string memory juego) public view returns (uint256) {
        return inventario[juego];
    }
}
