import { useEffect } from "react";
import styled from "styled-components";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeb3Store } from "@/store/useWeb3Store";

const ConnectWalletSection: React.FC = () => {
  const connectWallet = useWeb3Store((state) => state.connectWallet);
  const isMetaMaskConnected = useWeb3Store(
    (state) => state.isMetaMaskConnected
  );
  const checkMetaMaskStatus = useWeb3Store(
    (state) => state.checkMetaMaskStatus
  );

  // Verificar estado de MetaMask
  useEffect(() => {
    checkMetaMaskStatus();
  }, []);

  return (
    <>
      <InfoBox>
        <Wallet className="mx-auto h-12 w-12 text-primary" />
        <InfoText>
          Connect your wallet to start staking and earning rewards
        </InfoText>
      </InfoBox>
      <StyledButton onClick={connectWallet}>
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </StyledButton>
    </>
  );
};

export default ConnectWalletSection;

// Estilos para la sección de conexión de billetera
const InfoBox = styled.div`
  padding: 1.5rem;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 0.75rem;
  text-align: center;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 3rem;
  background: #6366f1;
  color: white;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #4f46e5;
    transform: scale(1.02);
  }

  &:disabled {
    background: #a5b4fc;
    cursor: not-allowed;
    transform: none;
  }
`;
