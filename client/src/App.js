import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import PortfolioItemDetail from './components/PortfolioItemDetail';
import CreatorDashboard from './components/CreatorDashboard';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/:id" element={<PortfolioItemDetail />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;