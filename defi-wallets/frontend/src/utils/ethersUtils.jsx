import { ethers } from "ethers";

/**
 * Utilidades para operaciones con ethers.js
 * Proporciona funciones compatibles con diferentes versiones de ethers
 */
const ethersUtils = (function () {
  // Detección de versión de ethers (v5 o v6)
  const isV5 = !!ethers.utils;
  const isV6 = !!ethers.formatEther;

  return {
    /**
     * Convierte un valor BigNumber a formato legible (ether)
     * @param {BigNumber|string} value - Valor en wei a convertir
     * @returns {string} - Valor formateado en ether
     */
    formatEther: function (value) {
      if (isV5) return ethers.utils.formatEther(value);
      if (isV6) return ethers.formatEther(value);
      return (Number(value.toString()) / 1e18).toString();
    },

    /**
     * Convierte un valor en formato legible a BigNumber (wei)
     * @param {string} value - Valor en ether a convertir
     * @returns {BigNumber} - Valor en wei
     */
    parseEther: function (value) {
      if (isV5) return ethers.utils.parseEther(value);
      if (isV6) return ethers.parseEther(value);
      return ethers.BigNumber.from((Number(value) * 1e18).toString());
    },

    /**
     * Formatea un valor a una cantidad específica de decimales
     * @param {BigNumber|string} value - Valor a formatear
     * @param {number} decimals - Número de decimales (por defecto 18 para ETH)
     * @returns {string} - Valor formateado
     */
    formatUnits: function (value, decimals = 18) {
      if (isV5) return ethers.utils.formatUnits(value, decimals);
      if (isV6) return ethers.formatUnits(value, decimals);
      return (Number(value.toString()) / Math.pow(10, decimals)).toString();
    },

    /**
     * Convierte un valor legible a su representación en wei según los decimales
     * @param {string} value - Valor a convertir
     * @param {number} decimals - Número de decimales (por defecto 18 para ETH)
     * @returns {BigNumber} - Valor en wei
     */
    parseUnits: function (value, decimals = 18) {
      if (isV5) return ethers.utils.parseUnits(value, decimals);
      if (isV6) return ethers.parseUnits(value, decimals);
      return ethers.BigNumber.from(
        (Number(value) * Math.pow(10, decimals)).toString()
      );
    },

    /**
     * Verifica si una dirección es válida
     * @param {string} address - Dirección a verificar
     * @returns {boolean} - True si es válida
     */
    isAddress: function (address) {
      if (isV5) return ethers.utils.isAddress(address);
      if (isV6) return ethers.isAddress(address);
      // Implementación básica fallback usando regex
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    },

    /**
     * Formatea un error de blockchain para hacerlo más legible
     * @param {Error} error - Error de ethers
     * @returns {string} - Mensaje de error formateado
     */
    formatError: function (error) {
      // Extraer el mensaje de error más relevante
      let message = error.message || "Unknown error";

      // Buscar patrones comunes en errores de ethers/solidity
      if (message.includes("insufficient funds")) {
        return "Insufficient funds to complete the transaction";
      } else if (message.includes("user rejected")) {
        return "Transaction rejected by user";
      } else if (message.includes("gas required exceeds")) {
        return "Transaction requires more gas than available";
      } else if (message.includes("execution reverted")) {
        // Intentar extraer el mensaje de revert
        const revertMatch = message.match(/reason: ([^"]+)/);
        if (revertMatch) return revertMatch[1];
        return "Transaction failed in the contract";
      }

      return message;
    },
  };
})();

export default ethersUtils;
