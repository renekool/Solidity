import { create } from "zustand";
import { persist } from "zustand/middleware";
import walletService from "../services/walletService";

const useWalletStore = create(
  persist(
    (set, get) => ({
      // Estado
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: "0",
      currencySymbol: "ETH", // Añadimos el símbolo de la moneda
      isConnecting: false,
      error: null,
      isConnected: false,

      // Verificar estado de conexión al iniciar/recargar
      checkConnection: async () => {
        try {
          // Verificar si hay wallet conectada en MetaMask
          const isConnected = await walletService.isConnected();

          if (!isConnected) {
            // No hay cuenta conectada, resetear estado
            get().disconnect();
            return false;
          } else if (get().isConnected && !get().account) {
            // Estado indica conectado pero faltan datos, reconectar
            get().connect();
            return true;
          }

          return isConnected;
        } catch (error) {
          console.error("Error verificando conexión:", error);
          get().disconnect();
          return false;
        }
      },

      // Conectar wallet
      connect: async () => {
        try {
          set({ isConnecting: true, error: null });

          const connectionData = await walletService.connectMetaMask();

          set({
            account: connectionData.account,
            provider: connectionData.provider,
            signer: connectionData.signer,
            chainId: connectionData.chainId,
            balance: connectionData.balance,
            currencySymbol: connectionData.currencySymbol, // Guardar el símbolo de la moneda
            isConnecting: false,
            isConnected: true,
            error: null,
          });

          // Si no estamos en Ganache, intentar cambiar
          if (connectionData.chainId !== 1337) {
            get().switchToGanache();
          }

          // Configurar listeners
          get().setupListeners();

          return true;
        } catch (error) {
          set({
            error: error.message || "Error al conectar wallet",
            isConnecting: false,
            isConnected: false, // Asegurar que queda como desconectado en caso de error
          });
          return false;
        }
      },

      // Configurar listeners para eventos de MetaMask
      setupListeners: () => {
        if (!window.ethereum) return;

        // Cambio de cuenta - MEJORADO
        const handleAccountsChanged = async (accounts) => {
          console.log("Cambio de cuentas detectado:", accounts);

          if (!accounts || accounts.length === 0) {
            // Usuario desconectó en MetaMask
            console.log("No hay cuentas, desconectando...");
            get().disconnect();
          } else {
            const newAccount = accounts[0];
            const currentAccount = get().account;

            // Solo actualizar si la cuenta realmente cambió
            if (newAccount !== currentAccount) {
              console.log(
                "Cambiando de cuenta:",
                currentAccount,
                "→",
                newAccount
              );

              // Actualizar la cuenta inmediatamente
              set({
                account: newAccount,
                isConnected: true,
                balance: "0", // Resetear balance temporalmente
              });

              // Actualizar balance para la nueva cuenta
              setTimeout(() => {
                get().updateBalance();
              }, 500); // Pequeño delay para que el cambio se propague
            }
          }
        };

        // Cambio de red - MEJORADO
        const handleChainChanged = async (chainIdHex) => {
          const newChainId = parseInt(chainIdHex, 16);
          console.log("Cambio de red detectado:", newChainId);

          // Actualizar el símbolo de la moneda cuando cambia la red
          const currencySymbol = await walletService.getCurrencySymbol(
            newChainId
          );

          set({
            chainId: newChainId,
            currencySymbol: currencySymbol,
            balance: "0", // Resetear balance al cambiar de red
          });

          // Actualizar balance después del cambio de red
          setTimeout(() => {
            get().updateBalance();
          }, 1000);
        };

        // Desconexión
        const handleDisconnect = (error) => {
          console.log("MetaMask disconnect event:", error);
          get().disconnect();
        };

        // Eliminar listeners previos para evitar duplicados
        window.ethereum.removeAllListeners?.("accountsChanged");
        window.ethereum.removeAllListeners?.("chainChanged");
        window.ethereum.removeAllListeners?.("disconnect");

        // Añadir listeners
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("disconnect", handleDisconnect);

        // Verificar conexión cada 5 segundos (reducido de 2 segundos)
        const connectionCheckInterval = setInterval(async () => {
          const isConnected = await walletService.isConnected();
          if (!isConnected && get().isConnected) {
            // Desconexión detectada
            get().disconnect();
          }
        }, 5000);

        // Guardar función de limpieza
        set({
          removeListeners: () => {
            window.ethereum.removeListener(
              "accountsChanged",
              handleAccountsChanged
            );
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener("disconnect", handleDisconnect);
            clearInterval(connectionCheckInterval);
          },
        });
      },

      // Cambiar a red de Ganache
      switchToGanache: async () => {
        try {
          await walletService.switchToGanache();

          // Actualizar el símbolo después de cambiar a Ganache
          const currencySymbol = await walletService.getCurrencySymbol(1337);
          set({ currencySymbol });

          // La actualización del chainId vendrá por el evento chainChanged
          return true;
        } catch (error) {
          set({ error: `Error al cambiar a Ganache: ${error.message}` });
          return false;
        }
      },

      // Actualizar balance - MEJORADO
      updateBalance: async () => {
        const { provider, account, chainId } = get();
        if (!provider || !account) {
          console.log(
            "No se puede actualizar balance: falta provider o account"
          );
          return;
        }

        try {
          console.log("Actualizando balance para cuenta:", account);

          const balance = await walletService.getBalance(provider, account);

          // También actualizar el símbolo de la moneda
          const currencySymbol = await walletService.getCurrencySymbol(chainId);

          set({
            balance,
            currencySymbol,
          });

          console.log("Balance actualizado:", balance, currencySymbol);
        } catch (error) {
          console.error("Error al actualizar balance:", error);
          set({ error: `Error actualizando balance: ${error.message}` });
        }
      },

      // Desconectar wallet (versión actualizada para evitar refresco)
      disconnect: () => {
        const { removeListeners } = get();

        // Limpiar listeners si existen
        if (removeListeners) {
          removeListeners();
        }

        console.log("Desconectando wallet y reseteando estado");

        // Resetear estado completamente (sin refrescar página)
        set({
          account: null,
          provider: null,
          signer: null,
          chainId: null,
          balance: "0",
          currencySymbol: "ETH", // Resetear a valor por defecto
          isConnected: false,
          error: null,
          removeListeners: null,
        });

        // Limpiar localStorage para evitar reconexiones no deseadas
        if (typeof window !== "undefined") {
          localStorage.removeItem("wallet-storage");
        }
      },
    }),
    {
      name: "wallet-storage",
      // Guardar información mínima para reconexión
      partialize: (state) => ({
        isConnected: state.isConnected,
      }),
    }
  )
);

export default useWalletStore;
