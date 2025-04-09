import { create } from "zustand";
import Web3 from "web3";
import RewardTokenAbi from "@/abis/RewardToken.json";
import { useWeb3Store } from "./useWeb3Store";

interface IRewardTokenState {
  rewardToken: any | null;
  rewardTokenBalance: string;
  loadRewardToken: () => Promise<void>;
}

export const useRewardTokenStore = create<IRewardTokenState>((set) => ({
  rewardToken: null,
  rewardTokenBalance: "0.00",

  loadRewardToken: async () => {
    const { walletAddress, networkId } = useWeb3Store.getState();
    if (!window.ethereum || !walletAddress || !networkId) {
      console.error("🔴 No hay conexión a Web3.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);

      // Obtener la información del contrato RewardToken según la red actual
      const rewardTokenData = RewardTokenAbi.networks[networkId];
      if (!rewardTokenData) {
        console.error("🔴 RewardToken no disponible en esta red.");
        return;
      }

      // Crear la instancia del contrato RewardToken
      const rewardToken = new web3.eth.Contract(
        RewardTokenAbi.abi as any,
        rewardTokenData.address
      );

      // Obtener el balance de RWD del usuario
      const balanceWei = (await rewardToken.methods
        .balanceOf(walletAddress)
        .call()) as string;

      const balance = web3.utils.fromWei(balanceWei, "ether");

      set({ rewardToken, rewardTokenBalance: balance });
      console.log("✅ RewardToken Balance:", balance);
    } catch (error) {
      console.error("❌ Error cargando RewardToken:", error);
    }
  },
}));
