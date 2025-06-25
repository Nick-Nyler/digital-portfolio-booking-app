import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import PortfolioItemDetail from './components/PortfolioItemDetail';
import CreatorDashboard from './components/CreatorDashboard';
import BookingForm from './components/BookingForm';
import BookingConfirm from './components/BookingConfirm';
import Login from './components/Login';
import Signup from './components/Signup';
import ClientDashboard from './components/ClientDashboard';
import Pricing from './components/Pricing';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (!token) console.warn('No authentication token found');
  }, []);

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/:id" element={<PortfolioItemDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/signin" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/booking/confirm" element={<BookingConfirm />} />
        <Route path="/dashboard" element={<PrivateRoute><CreatorDashboard /></PrivateRoute>} />
        <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
      </Routes>
      <footer><p>Contact: info@artify.com | © 2025 Artify | <a href="/pricing">Subscribe</a></p></footer>
    </Router>
  );
}

export default App;