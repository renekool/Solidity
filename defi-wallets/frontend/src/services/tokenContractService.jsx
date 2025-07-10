import { ethers } from "ethers";
import TokenABI from "../abis/SimpleDeFiToken.json";
import ethersUtils from "../utils/ethersUtils";

/**
 * Servicio para interactuar con el contrato SimpleDeFiToken
 */
const tokenContractService = {
  /**
   * Obtiene una instancia del contrato
   * @param {ethers.providers.Provider|ethers.Signer} providerOrSigner - Provider o signer de ethers
   * @returns {ethers.Contract} - Instancia del contrato
   */
  getContract(providerOrSigner) {
    try {
      // Obtener la red activa
      let networkId =
        providerOrSigner.provider?.network?.chainId ||
        providerOrSigner.network?.chainId ||
        5777; // Default a Ganache

      // Convertir BigInt a número si es necesario
      if (typeof networkId === "bigint") {
        networkId = Number(networkId);
      }

      // Intentar obtener la dirección del formato Truffle (networks)
      let contractAddress;

      // Verificar si hay un objeto networks en el ABI (formato Truffle)
      if (TokenABI.networks && TokenABI.networks[networkId]) {
        contractAddress = TokenABI.networks[networkId].address;
      } else if (TokenABI.address) {
        contractAddress = TokenABI.address;
      } else {
        throw new Error(
          `No se encontró dirección para el contrato en la red ${networkId}. Redes disponibles: ${Object.keys(
            TokenABI.networks || {}
          ).join(", ")}`
        );
      }

      // Crear y retornar la instancia del contrato
      return new ethers.Contract(
        contractAddress,
        TokenABI.abi,
        providerOrSigner
      );
    } catch (error) {
      console.error("Error creando instancia del contrato:", error);
      throw error;
    }
  },

  /**
   * Obtiene el total supply del token
   * @param {ethers.Contract} contract - Instancia del contrato
   * @returns {Promise<string>} - Total supply en formato legible
   */
  async getTotalSupply(contract) {
    try {
      const totalSupply = await contract.totalSupply();
      return ethersUtils.formatEther(totalSupply);
    } catch (error) {
      console.error("Error obteniendo total supply:", error);
      throw error;
    }
  },

  /**
   * Obtiene el balance de un usuario
   * @param {ethers.Contract} contract - Instancia del contrato
   * @param {string} address - Dirección a consultar
   * @returns {Promise<string>} - Balance en formato legible
   */
  async getBalance(contract, address) {
    try {
      if (!ethersUtils.isAddress(address)) {
        throw new Error("Dirección inválida");
      }

      const balance = await contract.balanceOf(address);
      return ethersUtils.formatEther(balance);
    } catch (error) {
      console.error("Error obteniendo balance:", error);
      throw error;
    }
  },

  /**
   * Realiza una transferencia estándar
   * @param {ethers.Contract} contract - Instancia del contrato
   * @param {string} to - Dirección destino
   * @param {string} amount - Cantidad a transferir (en ETH)
   * @returns {Promise<ethers.providers.TransactionResponse>}
   */
  async transfer(contract, to, amount) {
    try {
      if (!ethersUtils.isAddress(to)) {
        throw new Error("Dirección de destino inválida");
      }

      const amountWei = ethersUtils.parseEther(amount);
      const tx = await contract.transfer(to, amountWei);
      return tx;
    } catch (error) {
      console.error("Error en transferencia:", error);
      const formattedError = new Error(ethersUtils.formatError(error));
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  /**
   * Realiza una transferencia con quema
   * @param {ethers.Contract} contract - Instancia del contrato
   * @param {string} to - Dirección destino
   * @param {string} amount - Cantidad a transferir (en ETH)
   * @returns {Promise<ethers.providers.TransactionResponse>}
   */
  async transferWithBurn(contract, to, amount) {
    try {
      if (!ethersUtils.isAddress(to)) {
        throw new Error("Dirección de destino inválida");
      }

      const amountWei = ethersUtils.parseEther(amount);
      const tx = await contract.transferWithAutoBurn(to, amountWei);
      return tx;
    } catch (error) {
      console.error("Error en transferencia con quema:", error);
      const formattedError = new Error(ethersUtils.formatError(error));
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  /**
   * Estima el gas necesario para una transferencia
   * @param {ethers.Contract} contract - Instancia del contrato
   * @param {string} to - Dirección destino
   * @param {string} amount - Cantidad a transferir (en ETH)
   * @returns {Promise<string>} - Estimación de gas formateada
   */
  async estimateTransferGas(contract, to, amount) {
    try {
      const amountWei = ethersUtils.parseEther(amount);
      const gasEstimate = await contract.estimateGas.transfer(to, amountWei);
      // Incrementar en 10% para margen de seguridad
      return Math.floor(gasEstimate * 1.1).toString();
    } catch (error) {
      console.error("Error estimando gas:", error);
      throw error;
    }
  },

  /**
   * Estima el gas necesario para una transferencia con quema
   * @param {ethers.Contract} contract - Instancia del contrato
   * @param {string} to - Dirección destino
   * @param {string} amount - Cantidad a transferir (en ETH)
   * @returns {Promise<string>} - Estimación de gas formateada
   */
  async estimateBurnTransferGas(contract, to, amount) {
    try {
      const amountWei = ethersUtils.parseEther(amount);
      const gasEstimate = await contract.estimateGas.transferWithAutoBurn(
        to,
        amountWei
      );
      // Incrementar en 10% para margen de seguridad
      return Math.floor(gasEstimate * 1.1).toString();
    } catch (error) {
      console.error("Error estimando gas para burn transfer:", error);
      throw error;
    }
  },
};

export default tokenContractService;
