import { useEffect } from "react";
import styled from "styled-components";
import StakingCard from "@/components/sections/StakingCard";
import CryptoSection from "@/components/sections/CryptoSection";
import favicon from "@/img/icons/favicon.png"; // Importa el favicon

const Index = () => {
  // Agregar dinámicamente el favicon al cargar la página
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = favicon;
    document.head.appendChild(link);
  }, []);

  return (
    <PageContainer>
      <ContentWrapper>
        <CryptoSection />
        <StakingCard />
      </ContentWrapper>
    </PageContainer>
  );
};

export default Index;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(
    to bottom right,
    rgba(139, 92, 246, 0.2),
    rgba(236, 72, 153, 0.1),
    rgba(99, 102, 241, 0.2)
  );
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 64rem; /* 4xl */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem; /* space-y-12 */
`;
