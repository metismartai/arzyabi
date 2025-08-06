import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  direction: rtl;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const TestSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <ContentWrapper>
        <Header>
          <Title>سامانه رادار تعالی سازمانی</Title>
        </Header>
        
        <TestSection>
          <h2>تست اولیه سامانه</h2>
          <p>اگر این صفحه به درستی نمایش داده می‌شود، frontend به درستی راه‌اندازی شده است.</p>
        </TestSection>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default HomePage;
