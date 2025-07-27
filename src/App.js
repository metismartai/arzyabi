import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Approaches from './components/Approaches';
import Results from './components/Results';
import ApproachesTable from './components/ApproachesTable';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/approaches" element={<Approaches />} />
          <Route path="/results" element={<Results />} />
          <Route path="/ApproachesTable" element={<ApproachesTable />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
