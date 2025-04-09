// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importamos la implementación básica de un token ERC20 y la utilidad Ownable para el control del propietario.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RewardToken
/// @dev Token ERC20 para recompensar a los usuarios.
contract RewardToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("RewardToken", "RWD") {
        _mint(msg.sender, initialSupply); // Suministro inicial asignado al propietario.
    }

    /// @notice Permite al propietario acuñar más tokens.
    /// @param to Dirección a la que se asignarán los tokens.
    /// @param amount Cantidad de tokens a acuñar.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
