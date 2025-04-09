import { create } from "zustand";
import Web3 from "web3";
import StakingPlatformAbi from "@/abis/StakingPlatform.json";
import { useWeb3Store } from "./useWeb3Store";
import { useStakingTokenStore } from "./useStakingTokenStore";

let autoUpdateInterval: NodeJS.Timeout | null = null; // Guardar el intervalo

interface IStakingPlatformState {
  stakingPlatform: any | null;
  stakedAmount: string;
  earnedRewards: string;
  currentAPR: string; // APR actual en basis points, como string

  // Funciones para interactuar con el contrato
  stake: (amount: string) => Promise<boolean>;
  unstake: () => Promise<boolean>;
  loadStakingPlatform: () => Promise<void>;
  getStakerInfo: () => Promise<void>;
  getAPR: () => Promise<void>;
  startAutoUpdate: () => Promise<void>;
  stopAutoUpdate: () => void;
  hasStaked: () => Promise<boolean>;
}

export const useStakingPlatformStore = create<IStakingPlatformState>(
  (set, get) => ({
    stakingPlatform: null,
    stakedAmount: "0.00",
    earnedRewards: "0.00",
    currentAPR: "0",

    // Cargar el contrato
    loadStakingPlatform: async () => {
      const { walletAddress, networkId } = useWeb3Store.getState();
      if (!window.ethereum || !walletAddress || !networkId) {
        console.error("🔴 No hay conexión a Web3.");
        return;
      }
      try {
        const web3 = new Web3(window.ethereum);
        const stakingPlatformData = StakingPlatformAbi.networks[networkId];
        if (!stakingPlatformData) {
          console.error("🔴 StakingPlatform no disponible en esta red.");
          return;
        }
        const stakingPlatform = new web3.eth.Contract(
          StakingPlatformAbi.abi as any,
          stakingPlatformData.address
        );
        set({ stakingPlatform });
        console.log("✅ StakingPlatform cargado.");
      } catch (error) {
        console.error("❌ Error cargando StakingPlatform:", error);
      }
    },

    // Consultar información del staker con cálculo de recompensas
    getStakerInfo: async () => {
      const { walletAddress } = useWeb3Store.getState();
      const { stakingPlatform } = get();
      if (!stakingPlatform || !walletAddress) {
        console.error("🔴 No hay conexión al contrato StakingPlatform.");
        return;
      }
      try {
        const stakerInfo = await stakingPlatform.methods
          .stakers(walletAddress)
          .call();
        console.log("🔍 Información del staker obtenida:", stakerInfo);

        const rewardsFromBlockchain = await stakingPlatform.methods
          .calculateRewards(walletAddress)
          .call();
        console.log("🔍 Recompensas calculadas:", rewardsFromBlockchain);

        set({
          stakedAmount: Web3.utils.fromWei(stakerInfo.amount, "ether"),
          earnedRewards: Web3.utils.fromWei(rewardsFromBlockchain, "ether"),
        });
        console.log("✅ Staker Info actualizado:", {
          stakedAmount: Web3.utils.fromWei(stakerInfo.amount, "ether"),
          earnedRewards: Web3.utils.fromWei(rewardsFromBlockchain, "ether"),
        });
      } catch (error) {
        console.error("❌ Error obteniendo información del staker:", error);
      }
    },

    // Nueva función para obtener el APR actual desde el contrato
    getAPR: async () => {
      const { walletAddress } = useWeb3Store.getState();
      const { stakingPlatform } = get();
      if (!stakingPlatform || !walletAddress) {
        console.error("🔴 No hay conexión al contrato StakingPlatform.");
        return;
      }
      try {
        const aprValue = await stakingPlatform.methods.apr().call();
        set({ currentAPR: aprValue });
        console.log("✅ APR actualizado:", aprValue);
      } catch (error) {
        console.error("❌ Error obteniendo APR:", error);
      }
    },

    // Verificar si el usuario ha realizado staking
    hasStaked: async () => {
      const { walletAddress } = useWeb3Store.getState();
      const { stakingPlatform } = get();
      if (!stakingPlatform || !walletAddress) {
        console.error("🔴 No hay conexión al contrato StakingPlatform.");
        return false;
      }
      try {
        const stakerInfo = await stakingPlatform.methods
          .stakers(walletAddress)
          .call();
        return parseFloat(stakerInfo.amount) > 0;
      } catch (error) {
        console.error(
          "❌ Error verificando si el usuario ha realizado staking:",
          error
        );
        return false;
      }
    },

    // Iniciar actualización automática: ahora refresca tanto stakerInfo como APR cada 5 segundos.
    startAutoUpdate: async () => {
      const { hasStaked } = get();
      const staked = await hasStaked();
      if (!staked) {
        console.log("🛑 No se inicia el auto-update sin staking.");
        return;
      }
      if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
      }
      autoUpdateInterval = setInterval(() => {
        const { getStakerInfo: getStakerInfo, getAPR: getAPR } = get();
        getStakerInfo();
        getAPR();
      }, 5000);
    },

    // Detener actualización automática
    stopAutoUpdate: () => {
      if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
        console.log("🛑 Auto-update detenido.");
      }
    },

    // Función para realizar staking
    stake: async (amount: string) => {
      const { walletAddress } = useWeb3Store.getState();
      const { stakingToken, loadStakingToken } =
        useStakingTokenStore.getState();
      const { stakingPlatform } = get();
      if (!stakingPlatform || !stakingToken || !walletAddress) {
        console.error("🛑 No se puede realizar staking sin conexión.");
        return false;
      }
      try {
        const web3 = new Web3(window.ethereum);

        console.log("⏳ Aprobando tokens...");
        await stakingToken.methods
          .approve(
            stakingPlatform.options.address,
            web3.utils.toWei(amount, "ether")
          )
          .send({ from: walletAddress, gas: 300000 });
        console.log("✅ Aprobación confirmada.");

        console.log("⏳ Realizando staking...");
        await stakingPlatform.methods
          .stake(web3.utils.toWei(amount, "ether"))
          .send({ from: walletAddress });
        console.log("✅ Staking confirmado.");

        const { getStakerInfo: fetchStakerInfo, startAutoUpdate } = get();
        await fetchStakerInfo();
        await loadStakingToken();
        await startAutoUpdate();
        return true;
      } catch (error: any) {
        if (error && error.message && error.message.includes("User denied")) {
          console.log("⛔ Transacción de stake cancelada por el usuario.");
          return false;
        } else {
          console.error("❌ Error durante el staking:", error);
          throw error;
        }
      }
    },

    // Función para realizar unstake
    unstake: async () => {
      const { walletAddress } = useWeb3Store.getState();
      const { stakingPlatform } = get();
      if (!stakingPlatform || !walletAddress) {
        console.error("🛑 No se puede realizar unstaking sin conexión.");
        return false;
      }
      try {
        const web3 = new Web3(window.ethereum);
        console.log("⏳ Realizando unstake...");
        await stakingPlatform.methods
          .unStake()
          .send({ from: walletAddress, gas: 300000 });
        console.log("✅ Unstake confirmado.");

        const { getStakerInfo: fetchStakerInfo, stopAutoUpdate } = get();
        const { loadStakingToken } = useStakingTokenStore.getState();
        await fetchStakerInfo();
        await loadStakingToken();
        stopAutoUpdate();

        return true;
      } catch (error: any) {
        if (error && error.message && error.message.includes("User denied")) {
          console.log("⛔ Transacción cancelada por el usuario.");
          return false;
        } else {
          console.error("❌ Error durante el unstake:", error);
          throw error;
        }
      }
    },
  })
);

// Monitorización de desconexión en Web3Store
const { isMetaMaskConnected, isUserConnected } = useWeb3Store.getState();
if (!isMetaMaskConnected || !isUserConnected) {
  const { stopAutoUpdate } = useStakingPlatformStore.getState();
  stopAutoUpdate();
}
