import styled from "styled-components";
import ConnectWalletSection from "@/components/sections/ConnectWalletSection";
import StakingFormSection from "@/components/sections/StakingFormSection";
import { Card } from "@/components/ui/card";
import { useWeb3Store } from "@/store/useWeb3Store";
import { useStakingPlatformStore } from "@/store/useStakingPlatform";
import { useEffect } from "react";

const StakingCard = () => {
  // 🔹 Usar selectores para evitar re-renderizaciones innecesarias
  const isUserConnected = useWeb3Store((state) => state.isUserConnected);
  const isMetaMaskConnected = useWeb3Store(
    (state) => state.isMetaMaskConnected
  );

  // 🔹 Obtener funciones del store de staking
  const { startAutoUpdate, stopAutoUpdate } = useStakingPlatformStore();

  // 🔹 Controlar el ciclo de vida del auto-update
  useEffect(() => {
    if (isMetaMaskConnected && isUserConnected) {
      startAutoUpdate(); // Iniciar auto-update si ambas conexiones son exitosas
    } else {
      stopAutoUpdate(); // Detener auto-update si alguna conexión falla
    }

    return () => {
      stopAutoUpdate(); // Asegurar que se detenga en el desmontaje del componente
    };
  }, [isMetaMaskConnected, isUserConnected, startAutoUpdate, stopAutoUpdate]);

  return (
    <StyledCard>
      <CardContent>
        <Title>Stake Tokens</Title>
        <Subtitle>Earn rewards by staking your tokens</Subtitle>

        {!isMetaMaskConnected || !isUserConnected ? (
          <ConnectWalletSection />
        ) : (
          <StakingFormSection />
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StakingCard;

// Styled Components
const StyledCard = styled(Card)`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  animation: fade-in 0.5s ease-in-out;
`;

const CardContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
  margin-top: -1rem;
`;
