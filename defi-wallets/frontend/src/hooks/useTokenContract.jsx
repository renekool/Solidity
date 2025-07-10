import { useState, useEffect, useCallback } from "react";
import useWallet from "./useWallet";
import tokenContractService from "../services/tokenContractService";
import useTokenStore from "../stores/tokenStore";

/**
 * Hook para interactuar con el contrato SimpleDeFiToken
 * Proporciona datos y métodos para componentes
 */
const useTokenContract = () => {
  // Obtener datos de la wallet
  const { provider, signer, account, isConnected } = useWallet();

  // Acceder al store global - Destructurar para evitar ciclos infinitos
  const {
    totalSupply,
    balance,
    isLoading,
    error,
    isTransferring,
    isBurning,
    setTotalSupply,
    setBalance,
    setLoading,
    setError,
    setTransferring,
    setBurning,
    resetState,
  } = useTokenStore();

  // Estado local del contrato (no se expone fuera)
  const [contract, setContract] = useState(null);

  // Detectar cambios en la conexión
  useEffect(() => {
    // Si se desconecta, reset de todos los valores
    if (!isConnected) {
      resetState();
      setContract(null);
    }
  }, [isConnected, resetState]);

  // Detectar cambios de cuenta y resetear estados de transacción
  useEffect(() => {
    if (account) {
      // Resetear estados de transacción cuando cambie la cuenta
      setTransferring(false);
      setBurning(false);
      setError(null);
    }
  }, [account, setTransferring, setBurning, setError]);

  // Inicializar contrato cuando cambie el signer/provider
  useEffect(() => {
    const initContract = async () => {
      try {
        if (!provider || !isConnected) {
          setContract(null);
          return;
        }

        // Obtener signer actualizado para la cuenta activa
        const currentSigner = await provider.getSigner();
        const instance = tokenContractService.getContract(currentSigner);
        setContract(instance);

        // Limpiar errores previos
        setError(null);
      } catch (error) {
        console.error("Error inicializando contrato:", error);
        setError(`Error inicializando contrato: ${error.message}`);
        setContract(null);
      }
    };

    initContract();
  }, [provider, signer, setError, isConnected, account]);

  // Cargar datos del token
  const loadTokenData = useCallback(async () => {
    if (!contract || !isConnected) {
      resetState();
      return;
    }

    try {
      setLoading(true);

      // Obtener total supply
      const totalSupply = await tokenContractService.getTotalSupply(contract);
      setTotalSupply(totalSupply);

      // Obtener balance si hay cuenta conectada
      if (isConnected && account) {
        const balance = await tokenContractService.getBalance(
          contract,
          account
        );
        setBalance(balance);
      } else {
        setBalance("0");
      }
    } catch (error) {
      console.error("Error cargando datos del token:", error);
      setError(`Error cargando datos: ${error.message}`);
      // En caso de error, resetear los valores
      setTotalSupply("0");
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [
    contract,
    isConnected,
    account,
    setTotalSupply,
    setBalance,
    setLoading,
    setError,
    resetState,
  ]);

  // Cargar datos al inicializar o cuando cambie el contrato/cuenta
  useEffect(() => {
    if (contract && isConnected && account) {
      loadTokenData();
    } else if (!isConnected) {
      resetState();
    }
  }, [contract, account, loadTokenData, isConnected, resetState]);

  // Actualización periódica de datos
  useEffect(() => {
    if (!contract || !isConnected || !account) return;

    const intervalId = setInterval(() => {
      loadTokenData();
    }, 15000); // Actualizar cada 15 segundos

    return () => clearInterval(intervalId);
  }, [contract, loadTokenData, isConnected, account]);

  // Transferencia estándar
  const transfer = useCallback(
    async (to, amount) => {
      if (!contract || !isConnected) {
        setError("Wallet no conectada");
        return false;
      }

      try {
        setTransferring(true);
        setError(null);

        // Validar parámetros
        if (!to || !amount) {
          throw new Error("Dirección destino y monto son requeridos");
        }

        // Ejecutar transferencia a través del servicio
        const tx = await tokenContractService.transfer(contract, to, amount);

        // Esperar confirmación
        const receipt = await tx.wait();

        // Verificar si la transacción fue exitosa
        if (receipt.status !== 1) {
          throw new Error(`Transacción falló. Status: ${receipt.status}`);
        }

        // Recargar datos
        await loadTokenData();

        return true;
      } catch (error) {
        console.error("Error en transferencia:", error);
        setError(`Error en transferencia: ${error.message}`);
        return false;
      } finally {
        setTransferring(false);
      }
    },
    [contract, isConnected, loadTokenData, setError, setTransferring, account]
  );

  // Transferencia con quema
  const transferWithBurn = useCallback(
    async (to, amount) => {
      if (!contract || !isConnected) {
        setError("Wallet no conectada");
        return false;
      }

      try {
        setBurning(true);
        setError(null);

        // Validar parámetros
        if (!to || !amount) {
          throw new Error("Dirección destino y monto son requeridos");
        }

        // Ejecutar transferencia con quema
        const tx = await tokenContractService.transferWithBurn(
          contract,
          to,
          amount
        );

        // Esperar confirmación
        const receipt = await tx.wait();

        // Verificar si la transacción fue exitosa
        if (receipt.status !== 1) {
          throw new Error(`Transacción falló. Status: ${receipt.status}`);
        }

        // Recargar datos
        await loadTokenData();

        return true;
      } catch (error) {
        console.error("Error en transferencia con quema:", error);
        setError(`Error en transferencia con quema: ${error.message}`);
        return false;
      } finally {
        setBurning(false);
      }
    },
    [contract, isConnected, loadTokenData, setError, setBurning, account]
  );

  // Refrescar datos manualmente
  const refreshData = useCallback(() => {
    if (isConnected && contract && account) {
      loadTokenData();
    } else {
      resetState();
    }
  }, [loadTokenData, isConnected, contract, resetState, account]);

  // Exponer datos y métodos a los componentes
  return {
    // Datos
    totalSupply,
    balance,

    // Estados
    isLoading,
    error,
    isTransferring,
    isBurning,
    isConnected,

    // Acciones
    transfer,
    transferWithBurn,
    refreshData,
  };
};

export default useTokenContract;
