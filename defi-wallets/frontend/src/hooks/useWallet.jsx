// src/hooks/useWallet.js
import { useEffect, useCallback } from "react";
import useWalletStore from "../stores/walletStore";
import walletService from "../services/walletService";

const useWallet = () => {
  // Obtener estado y acciones del store
  const {
    account,
    provider,
    signer,
    chainId,
    balance,
    currencySymbol, // Añadimos el símbolo de la moneda
    isConnecting,
    error,
    isConnected,
    connect,
    disconnect,
    updateBalance,
    switchToGanache,
    checkConnection,
  } = useWalletStore();

  // Verificar conexión al iniciar
  useEffect(() => {
    // Verificar estado real de conexión al cargar
    checkConnection();

    // Actualizar balance periódicamente (cada 15s)
    const balanceInterval = setInterval(() => {
      if (isConnected) {
        updateBalance();
      }
    }, 15000);

    return () => clearInterval(balanceInterval);
  }, [checkConnection, isConnected, updateBalance]);

  // NUEVO: Detectar cambios de cuenta y forzar actualización
  useEffect(() => {
    if (isConnected && account) {
      console.log("Cuenta activa detectada:", account);
      updateBalance();
    }
  }, [account, isConnected, updateBalance]);

  // Verificar si MetaMask está disponible
  const isMetaMaskAvailable = useCallback(() => {
    return walletService.isMetaMaskAvailable();
  }, []);

  // Formatear dirección para mostrar (0x1234...5678)
  const getShortAddress = useCallback(() => {
    if (!account) return "";
    return `${account.substring(0, 6)}...${account.substring(
      account.length - 4
    )}`;
  }, [account]);

  // Verificar si estamos en Ganache
  const isGanacheNetwork = useCallback(() => {
    return chainId === 1337;
  }, [chainId]);

  // Método para manejar la conexión/desconexión con formato para componente Header
  const handleConnectWallet = useCallback(async () => {
    if (isConnected) {
      disconnect();
    } else {
      if (!isMetaMaskAvailable()) {
        window.open("https://metamask.io/download/", "_blank");
        return;
      }
      await connect();
    }
  }, [isConnected, disconnect, isMetaMaskAvailable, connect]);

  // Obtener nombre de la red
  const getNetworkName = useCallback(() => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 3:
        return "Ropsten Testnet";
      case 4:
        return "Rinkeby Testnet";
      case 5:
        return "Goerli Testnet";
      case 42:
        return "Kovan Testnet";
      case 1337:
        return "Ganache Local";
      default:
        return chainId ? `Desconocida (${chainId})` : "No conectado";
    }
  }, [chainId]);

  return {
    // Estado
    account,
    provider,
    signer,
    chainId,
    balance,
    currencySymbol, // Exponemos el símbolo de la moneda
    isConnecting,
    error,
    isConnected,

    // Acciones
    connect,
    disconnect,
    updateBalance,
    switchToGanache,
    handleConnectWallet,

    // Helpers
    isMetaMaskAvailable,
    getShortAddress,
    isGanacheNetwork,
    getNetworkName,
  };
};

export default useWallet;
