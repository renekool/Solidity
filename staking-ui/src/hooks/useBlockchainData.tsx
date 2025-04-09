import { useEffect, useState } from "react";
import Web3 from "web3";
import StakingTokenAbi from "@/abis/StakingToken.json";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

const useBlockchainData = (walletAddress: string) => {
  const [stakingToken, setStakingToken] = useState<any>(null);
  const [stakingTokenBalance, setStakingTokenBalance] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (!walletAddress) return;

    const loadBlockchainData = async () => {
      try {
        const web3 = new Web3(window.ethereum);

        // Obtener cuenta y red
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        console.log("Connected Account:", accounts[0]);

        // Buscar el contrato en la red actual
        const stakingTokenData = StakingTokenAbi.networks[networkId.toString()];
        if (stakingTokenData) {
          const stakingToken = new web3.eth.Contract(
            StakingTokenAbi.abi,
            stakingTokenData.address
          );
          setStakingToken(stakingToken);

          // Obtener saldo del usuario en StakingToken
          const balanceWei = (await stakingToken.methods
            .balanceOf(walletAddress)
            .call()) as string;
          const balance = web3.utils.fromWei(balanceWei, "ether");
          setStakingTokenBalance(balance);

          //console.log("StakingToken Address:", stakingToken.options.address);
          console.log("StakingToken Balance:", balance);
        } else {
          // Notificación de error si no se encuentra el contrato
          toast({
            description: (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-white" />
                  <span className="font-semibold">Contract Not Found</span>
                </div>
                <span>
                  StakingToken contract is not deployed on this network.
                </span>
              </div>
            ),
            className: "bg-[#d97706] border-none text-white",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error loading blockchain data:", error);

        // Notificación de error en caso de fallo en la carga de datos
        toast({
          description: (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-white" />
                <span className="font-semibold">Error Loading Data</span>
              </div>
              <span>An error occurred while retrieving blockchain data.</span>
            </div>
          ),
          className: "bg-[#b91c1c] border-none text-white",
          duration: 5000,
        });
      }
    };

    loadBlockchainData();
  }, [walletAddress]);

  return { stakingToken, stakingTokenBalance };
};

export default useBlockchainData;
