import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './components/NavBar';
import Home from './components/Home';
import PortfolioDetail from './components/PortfolioDetail';
import BookingForm from './components/BookingForm';
import BookingConfirm from './components/BookingConfirm';
import Login from './components/Login';
import Signup from './components/Signup';
import CreatorDashboard from './components/CreatorDashboard';
import ClientDashboard from './components/ClientDashboard';
import Pricing from './components/Pricing';
import Profile from './components/Profile';
import Calendar from './components/Calendar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/booking/confirm" element={<BookingConfirm />} />
          <Route path="/creator-dashboard" element={<PrivateRoute><CreatorDashboard /></PrivateRoute>} />
          <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        </Routes>
      </motion.div>
      <footer className="bg-gray-800 text-center py-4 mt-6">
        <p>© 2025 Artify | <a href="/pricing" className="text-blue-300 hover:underline">Subscribe</a> | Contact: info@artify.com</p>
      </footer>
    </div>
  );
}

export default App;
