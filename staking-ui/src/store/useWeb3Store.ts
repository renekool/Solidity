import { create } from "zustand";
import Web3 from "web3";

// 🔹 Definir la estructura del estado con INTERFACE
interface IWeb3State {
  walletAddress: string | null;
  networkId: string | null;
  isMetaMaskInstalled: boolean;
  isMetaMaskConnected: boolean;
  isUserConnected: boolean;

  // Funciones para interactuar con MetaMask
  checkMetaMaskStatus: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// 🔹 Crear el store con Zustand
export const useWeb3Store = create<IWeb3State>((set) => ({
  walletAddress: localStorage.getItem("walletAddress") || null,
  networkId: localStorage.getItem("networkId") || null,
  isUserConnected: localStorage.getItem("isUserConnected") === "true",

  isMetaMaskInstalled: typeof window !== "undefined" && !!window.ethereum,
  isMetaMaskConnected: localStorage.getItem("isMetaMaskConnected") === "true",

  // 🔹 Verificar si MetaMask está disponible y conectado
  checkMetaMaskStatus: async () => {
    if (!window.ethereum) {
      set({ isMetaMaskInstalled: false, isMetaMaskConnected: false });

      localStorage.setItem("isMetaMaskConnected", "false");
      console.error("🔴 MetaMask no está instalado.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      const isConnected = accounts.length > 0;

      set({
        isMetaMaskInstalled: true,
        isMetaMaskConnected: isConnected,
        networkId: networkId.toString(),
      });

      localStorage.setItem(
        "isMetaMaskConnected",
        isConnected ? "true" : "false"
      );

      if (isConnected) {
        set({ walletAddress: accounts[0] });
        localStorage.setItem("walletAddress", accounts[0]);
        localStorage.setItem("networkId", networkId.toString());
      } else {
        set({ walletAddress: null, isUserConnected: false });
        localStorage.removeItem("walletAddress");
        localStorage.setItem("isUserConnected", "false");
      }
    } catch (error) {
      console.error("🔴 Error al verificar MetaMask:", error);
    }
  },

  // 🔹 Conectar la wallet (solo cuando el usuario haga clic)
  connectWallet: async () => {
    if (!window.ethereum) {
      console.error("MetaMask no está instalado.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      set({
        walletAddress: accounts[0],
        networkId: networkId.toString(),
        isMetaMaskConnected: true,
        isUserConnected: true,
      });

      localStorage.setItem("walletAddress", accounts[0]);
      localStorage.setItem("networkId", networkId.toString());
      localStorage.setItem("isUserConnected", "true");
      localStorage.setItem("isMetaMaskConnected", "true");

      console.log("WalletAddress:", accounts[0]);
      console.log("Network:", networkId);
    } catch (error) {
      console.error("🔴 Error al conectar la wallet:", error);
    }
  },

  // 🔹 Desconectar la wallet
  disconnectWallet: () => {
    set({
      walletAddress: null,
      networkId: null,
      isMetaMaskConnected: false,
      isUserConnected: false,
    });

    localStorage.removeItem("walletAddress");
    localStorage.removeItem("networkId");
    localStorage.setItem("isUserConnected", "false");
    localStorage.setItem("isMetaMaskConnected", "false");

    console.log("🔌 Wallet desconectada.");
  },
}));

// 🚀 **Detectar cambios en MetaMask**
if (typeof window !== "undefined" && window.ethereum) {
  (window.ethereum as any).on("accountsChanged", async (accounts: string[]) => {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();

    if (accounts.length === 0) {
      useWeb3Store.setState({
        walletAddress: null,
        isMetaMaskConnected: false,
        isUserConnected: false,
      });

      localStorage.removeItem("walletAddress");
      localStorage.removeItem("networkId");
      localStorage.setItem("isUserConnected", "false");
      localStorage.setItem("isMetaMaskConnected", "false");

      console.log("🔴 Wallet desconectada desde MetaMask.");
    } else {
      useWeb3Store.setState({
        walletAddress: accounts[0],
        isMetaMaskConnected: true,
        networkId: networkId.toString(),
        isUserConnected: false,
      });

      localStorage.setItem("walletAddress", accounts[0]);
      localStorage.setItem("networkId", networkId.toString());
      localStorage.setItem("isUserConnected", "false");
      localStorage.setItem("isMetaMaskConnected", "true");

      console.log("🟡 Cuenta cambiada a:", accounts[0], "pero no reconectada.");
    }
  });

  (window.ethereum as any).on("disconnect", () => {
    useWeb3Store.setState({
      walletAddress: null,
      isMetaMaskConnected: false,
      isUserConnected: false,
    });

    localStorage.removeItem("walletAddress");
    localStorage.removeItem("networkId");
    localStorage.setItem("isUserConnected", "false");
    localStorage.setItem("isMetaMaskConnected", "false");

    console.log("🔴 MetaMask se ha desconectado.");
  });
}
