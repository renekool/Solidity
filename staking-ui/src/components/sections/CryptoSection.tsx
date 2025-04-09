import styled from "styled-components";

export default function CryptoSection() {
  return (
    <CryptoSectionContainer>
      <ContentWrapper>
        <Title>Grow your crypto</Title>
        <Subtitle>
          Your crypto deserves more.
          <br />
          Stake it today and unlock its full potential.
        </Subtitle>
      </ContentWrapper>
    </CryptoSectionContainer>
  );
}

const CryptoSectionContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: fade-in 0.5s ease-in-out;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 2.5rem; /* text-4xl */
  font-weight: bold;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, #111827, #374151);
  text-align: center;
  max-width: 42rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    font-size: 3rem; /* md:text-5xl */
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem; /* text-lg */
  color: #4b5563; /* text-gray-600 */
  text-align: center;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.75rem;

  @media (min-width: 768px) {
    font-size: 1.25rem; /* md:text-xl */
  }
`;
