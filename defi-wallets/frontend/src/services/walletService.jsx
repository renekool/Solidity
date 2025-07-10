// src/services/walletService.js
import { ethers } from "ethers";

/**
 * Servicio para interactuar con MetaMask y otras wallets
 * Versión básica para desarrollo con Ganache
 */
const walletService = {
  // Verificar si MetaMask está disponible
  isMetaMaskAvailable: () => {
    return Boolean(window.ethereum?.isMetaMask);
  },

  // Verificar si hay una cuenta conectada en MetaMask
  isConnected: async () => {
    if (!window.ethereum) return false;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      return Boolean(accounts && accounts.length > 0);
    } catch (error) {
      console.error("Error verificando conexión:", error);
      return false;
    }
  },

  // Conectar con MetaMask
  connectMetaMask: async () => {
    if (!window.ethereum?.isMetaMask) {
      throw new Error("MetaMask no está instalado");
    }

    try {
      // Solicitar acceso a la cuenta
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No se autorizó el acceso a MetaMask");
      }

      // Configurar provider y signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Obtener balance
      const balance = await provider.getBalance(accounts[0]);

      // Determinar el símbolo de la moneda basado en la red
      let currencySymbol = "ETH"; // Por defecto

      // Si se pudiera obtener de la red, lo haríamos aquí
      // Pero en este caso simplificado, usamos un mapeo
      if (
        Number(network.chainId) === 1337 ||
        Number(network.chainId) === 31337
      ) {
        currencySymbol = "ETH"; // Ganache usa ETH
      }

      return {
        account: accounts[0],
        provider,
        signer,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        currencySymbol: currencySymbol,
      };
    } catch (error) {
      console.error("Error conectando a MetaMask:", error);
      throw error;
    }
  },

  // Cambiar a la red de Ganache (chainId 1337)
  switchToGanache: async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x539" }], // 1337 en hexadecimal
      });
      return true;
    } catch (error) {
      // Si la red no está configurada en MetaMask (error 4902)
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x539",
                chainName: "Ganache Local",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["http://127.0.0.1:7545"],
                blockExplorerUrls: null,
              },
            ],
          });
          return true;
        } catch (addError) {
          throw new Error(`Error al añadir Ganache: ${addError.message}`);
        }
      }
      throw error;
    }
  },

  // Obtener balance actualizado
  getBalance: async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error obteniendo balance:", error);
      throw error;
    }
  },

  // Obtener símbolo de moneda nativa según la red
  getCurrencySymbol: async (chainId) => {
    const symbolMap = {
      1: "ETH", // Ethereum Mainnet
      3: "ETH", // Ropsten
      4: "ETH", // Rinkeby
      5: "ETH", // Goerli
      42: "ETH", // Kovan
      56: "BNB", // Binance Smart Chain
      97: "tBNB", // BSC Testnet
      137: "MATIC", // Polygon
      80001: "MATIC", // Mumbai (Polygon Testnet)
      1337: "ETH", // Ganache
      31337: "ETH", // Hardhat Network
    };

    return symbolMap[chainId] || "ETH"; // Default a ETH si no conocemos la red
  },
};

export default walletService;
