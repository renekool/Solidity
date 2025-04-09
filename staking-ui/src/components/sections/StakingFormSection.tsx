import styled from "styled-components";
import { useEffect, useState } from "react";
import { useWeb3Store } from "@/store/useWeb3Store";
import { useStakingTokenStore } from "@/store/useStakingTokenStore";
import { useRewardTokenStore } from "@/store/useRewardTokenStore";
import { useStakingPlatformStore } from "@/store/useStakingPlatform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAddress, formatLargeNumber } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Coins,
  ChartBar,
  LogOut,
  XCircle,
  CheckCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Circle,
} from "lucide-react";

const StakingFormSection: React.FC = () => {
  // Estados y funciones provenientes de /src/store
  const { walletAddress, disconnectWallet } = useWeb3Store();
  const { rewardTokenBalance, loadRewardToken } = useRewardTokenStore();
  const { stakingTokenBalance, amount, setAmount, loadStakingToken } =
    useStakingTokenStore();
  const {
    stakedAmount,
    earnedRewards,
    currentAPR,
    stake,
    unstake,
    loadStakingPlatform,
    getStakerInfo,
    startAutoUpdate,
    hasStaked,
    getAPR,
  } = useStakingPlatformStore();

  // Estados locales y hooks
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  // Función para refrescar todos los datos de la blockchain (incluyendo APR)
  const refreshData = async () => {
    await Promise.all([
      loadStakingToken(),
      loadRewardToken(),
      getStakerInfo(),
      getAPR(),
    ]);
  };

  /**
   * Cuando se conecta la wallet (walletAddress cambia):
   * 1. Cargamos el contrato y empezamos auto-update.
   * 2. Refrescamos la data (balances, info staker, APR).
   * 3. Verificamos si el usuario está staked para setear isStaking.
   */
  useEffect(() => {
    if (walletAddress) {
      loadStakingPlatform();
      startAutoUpdate();
      refreshData();

      // Verificar si ya está haciendo staking
      (async () => {
        const staked = await hasStaked();
        setIsStaking(staked);
      })();
    } else {
      // Si no hay wallet conectada
      setIsStaking(false);
    }
  }, [walletAddress]);

  // Manejo del input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setAmount(value);
    }
  };

  // Acción de stake/unstake
  const handleStakeAction = async () => {
    setIsLoading(true);
    try {
      const currentStatus = await hasStaked();
      setIsStaking(currentStatus);

      if (!isStaking) {
        // Estamos en modo "Stake"
        if (!amount || parseFloat(amount) <= 0) {
          toast({
            title: (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Input Required
              </div>
            ),
            description: "Please enter an amount to stake",
            className: "bg-[#ef4444] text-white border-none",
          });
          return;
        }
        if (parseFloat(amount) > parseFloat(stakingTokenBalance)) {
          toast({
            title: (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Insufficient Balance
              </div>
            ),
            description: "❌ Insufficient balance to stake.",
            className: "bg-[#ef4444] text-white border-none",
          });
          return;
        }

        const result = await stake(amount);
        if (result) {
          await refreshData();
          toast({
            title: (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Staking Successful
              </div>
            ),
            description: `Successfully staked ${amount} STK tokens`,
            className: "bg-[#22c55e] text-white border-none",
          });
          setIsStaking(true);
          setAmount("");
        } else {
          // Si se cancela la transacción, volvemos al estado anterior
          console.log("Stake cancelado: manteniendo el estado actual.");
        }
      } else {
        // Estamos en modo "Unstake"
        const result = await unstake();
        if (result) {
          await refreshData();
          toast({
            title: (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Unstaking Successful
              </div>
            ),
            description: "Successfully unstaked tokens and claimed rewards",
            className: "bg-[#f59e0b] text-white border-none",
          });
          setIsStaking(false);
        } else {
          // Si se cancela la transacción, volvemos al estado anterior
          console.log("Unstake cancelado: manteniendo el estado actual.");
        }
      }
    } catch (error) {
      console.error("❌ Error during staking:", error);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Error
          </div>
        ),
        description: "An error occurred during staking.",
        className: "bg-[#ef4444] text-white border-none",
      });
    } finally {
      // Siempre volvemos a habilitar el botón (quitamos el "Processing...")
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Container>
        <WalletInfo>
          <WalletText>
            <Circle className="w-2 h-2 fill-[#22C55E] text-[#22C55E]" />
            Connected:{" "}
            <span className="text-[#6366f1]">
              {formatAddress(walletAddress)}
            </span>
          </WalletText>
          <LogOutButton onClick={disconnectWallet}>
            <LogOut className="w-4 h-4" />
          </LogOutButton>
        </WalletInfo>

        <GridContainer>
          <InfoBox>
            <InfoBoxContent>
              <Coins className="w-5 h-5 text-[#6366f1]" />
              <div>
                <InfoText>Available Balance</InfoText>
                <ValueDisplay>
                  {formatLargeNumber(stakingTokenBalance)}
                  <TokenBadge>STK</TokenBadge>
                </ValueDisplay>
              </div>
            </InfoBoxContent>
          </InfoBox>
          <InfoBox>
            <InfoBoxContent>
              <Coins className="w-5 h-5 text-[#22c55e]" />
              <div>
                <InfoText>Rewards Balance</InfoText>
                <ValueDisplay>
                  {formatLargeNumber(rewardTokenBalance)}
                  <TokenBadge $variant="rewards">RWD</TokenBadge>
                </ValueDisplay>
              </div>
            </InfoBoxContent>
          </InfoBox>
        </GridContainer>

        <StakingSection>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {isStaking ? "Staked Amount" : "Stake Amount"}
            </span>
            <ApyBadge>
              <ChartBar className="w-3 h-3" />
              <span>{(Number(currentAPR) / 100).toFixed(2)}% APR</span>
            </ApyBadge>
          </div>
          <InputWrapper>
            <StyledInput
              type="number"
              min="0"
              step="any"
              placeholder="Enter amount to stake"
              value={amount || ""}
              onChange={handleAmountChange}
              disabled={isLoading || isStaking}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
            <TokenLabel>STK</TokenLabel>
          </InputWrapper>
        </StakingSection>

        <StakeButton
          onClick={handleStakeAction}
          $isStaking={isStaking}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="text-white" />
              Processing...
            </>
          ) : isStaking ? (
            <>
              Unstake <ArrowUpFromLine className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              Stake Now <ArrowDownToLine className="w-5 h-5 ml-2" />
            </>
          )}
        </StakeButton>

        <StatsContainer>
          <StatsCard $isMobile={isMobile}>
            <ValueRow>
              <Label>Staked Amount</Label>
              <ValueWrapper>
                <Value>{formatLargeNumber(stakedAmount)}</Value>
                <TokenBadge>STK</TokenBadge>
              </ValueWrapper>
            </ValueRow>
            <Divider />
            <ValueRow>
              <Label>Earned Rewards</Label>
              <ValueWrapper>
                <Value $variant="rewards">
                  {formatLargeNumber(earnedRewards)}
                </Value>
                <TokenBadge $variant="rewards">RWD</TokenBadge>
              </ValueWrapper>
            </ValueRow>
          </StatsCard>
        </StatsContainer>
      </Container>
    </TooltipProvider>
  );
};

export default StakingFormSection;

/* =================== Estilos (Styled Components) =================== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  width: 100%;
  gap: 1rem;
`;

const WalletText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LogOutButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #374151;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  padding: 1.5rem;
  background: #f8f9ff;
  border-radius: 0.75rem;
  width: 100%;
`;

const InfoBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const ValueDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;
  font-size: 1.1rem;
`;

const TokenBadge = styled.span<{ $variant?: "rewards" }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  background: #f1f1f1;
  color: ${(props) => (props.$variant === "rewards" ? "#22C55E" : "#6366F1")};
  min-width: 3rem;
  text-align: center;
  display: inline-block;
`;

const StakingSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ApyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #6366f1;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 1.25rem 5rem 1.25rem 1.25rem;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: white;
    box-shadow: none;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TokenLabel = styled.span`
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6366f1;
  font-weight: 500;
`;

const StakeButton = styled(Button)<{ $isStaking: boolean }>`
  width: 100%;
  height: 3rem;
  font-weight: 500;
  background: ${(props) => (props.$isStaking ? "#F97316" : "#6366F1")};
  color: white;
  border-radius: 0.75rem;

  &:hover {
    background: ${(props) => (props.$isStaking ? "#FB923C" : "#6366F1/90")};
  }
`;

const StatsContainer = styled.div`
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.75rem;
  width: 100%;
`;

const StatsCard = styled.div<{ $isMobile?: boolean }>`
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
`;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Value = styled.span<{ $variant?: "rewards" }>`
  font-weight: 600;
  color: ${(props) => (props.$variant === "rewards" ? "#22C55E" : "#111827")};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
`;
