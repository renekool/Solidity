import { create } from "zustand";
import Web3 from "web3";
import StakingTokenAbi from "@/abis/StakingToken.json";
import { useWeb3Store } from "./useWeb3Store";

// 🔹 Definir la estructura del estado con INTERFACE
interface IStakingTokenState {
  stakingToken: any | null;
  stakingTokenBalance: string;
  amount: string;

  // Funciones para interactuar con el contrato
  setAmount: (value: string) => void;
  loadStakingToken: () => Promise<void>;
}

// 🔹 Crear el store con Zustand
export const useStakingTokenStore = create<IStakingTokenState>((set) => ({
  stakingToken: null,
  stakingTokenBalance: "0.00",
  amount: "", // ✅ Inicializamos amount

  // ✅ Función para actualizar el monto del stake
  setAmount: (value) => {
    set({ amount: value });
  },

  // ✅ Función para cargar contrato y balance
  loadStakingToken: async () => {
    const { walletAddress, networkId } = useWeb3Store.getState();
    if (!window.ethereum || !walletAddress || !networkId) {
      console.error("🔴 No hay conexión a Web3.");
      return;
    }

    try {
      // ✅ Usamos Web3.js para interactuar con la blockchain
      const web3 = new Web3(window.ethereum);

      // Obtener dirección del contrato en la red actual
      const stakingTokenData = StakingTokenAbi.networks[networkId];
      if (!stakingTokenData) {
        console.error("🔴 StakingToken no disponible en esta red.");
        return;
      }

      // Crear la instancia del contrato
      const stakingToken = new web3.eth.Contract(
        StakingTokenAbi.abi as any,
        stakingTokenData.address
      );

      // Obtener balance del usuario
      const balanceWei = (await stakingToken.methods
        .balanceOf(walletAddress)
        .call()) as string;

      const balance = web3.utils.fromWei(balanceWei, "ether");

      set({ stakingToken, stakingTokenBalance: balance });
      console.log("✅ StakingToken Balance:", balance);
    } catch (error) {
      console.error("❌ Error cargando StakingToken:", error);
    }
  },
}));
