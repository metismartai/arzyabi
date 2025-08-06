import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Home, BarChart3, Target, TrendingUp, Workflow, FileText, Archive } from 'lucide-react';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : 'transparent'};

  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'خانه', icon: Home },
    { path: '/dashboard', label: 'داشبورد', icon: BarChart3 },
    { path: '/approaches', label: 'رویکردها', icon: Target },
    { path: '/results', label: 'نتایج', icon: TrendingUp },
    { path: '/process', label: 'فرایند', icon: Workflow },
    { path: '/strategy', label: 'استراتژی', icon: FileText },
    { path: '/objectives', label: 'اهداف راهبردی BSC', icon: FileText },
    { path: '/documents', label: 'مستندات و شواهد', icon: Archive },
  ];

  return (
    <NavbarContainer>
      <NavContent>
        <Logo>سامانه رادار تعالی سازمانی</Logo>
        <NavLinks>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink 
              key={path} 
              to={path} 
              $active={location.pathname === path}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </NavLinks>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
