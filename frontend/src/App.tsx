import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Layout/Navbar';
import HomePage from './components/Home/HomePage';
import ApproachesList from './pages/ApproachesList';
import Home from './pages/Home';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import ApproachDetail from './components/Approaches/ApproachDetail';


const AppContainer = styled.div`
  min-height: 100vh;
  font-family: 'Vazir', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route index element={<Dashboard />} />
            <Route path="approaches" element={<ApproachesList />} />
            <Route path="approaches/:id" element={<ApproachDetail />} />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/results" element={<div>Results Page</div>} />
            <Route path="/process" element={<div>Process Page</div>} />
            <Route path="/strategy" element={<div>Strategy Page</div>} />
            <Route path="/objectives" element={<div>Objectives Page</div>} />
            <Route path="/documents" element={<div>Documents Page</div>} />
            <Route path="/settings" element={<div>setting Page</div>} />
            <Route path="/users" element={<div>Users Profiles</div>} />
          </Route>
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
