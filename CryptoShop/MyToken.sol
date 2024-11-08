// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importamos contratos de OpenZeppelin
import "@openzeppelin/contracts@4.5.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.5.0/access/Ownable.sol";

/**
 * @title MyToken
 * @dev Implementación de un token ERC20 utilizado como medio de pago en la tienda en línea
 */
contract MyToken is ERC20, Ownable {
    /**
     * @dev Constructor que asigna el suministro inicial al creador del contrato.
     * @param initialSupply Suministro inicial de tokens (en unidades enteras, sin considerar decimales).
     */
    constructor(uint256 initialSupply) ERC20("StokeToken", "STK") {
        // Acuñamos el suministro inicial a un propietario (la tienda)
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }


    /**
     * @dev Función para acuñar nuevos tokens.
     * Solo el propietario (la tienda) puede llamar a esta función.
     * @param to Dirección que recibirá los nuevos tokens.
     * @param amount Cantidad de tokens a acuñar (en unidades enteras, sin considerar decimales).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10 ** decimals());
    }
}