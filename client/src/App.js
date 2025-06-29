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
import RateCard from './components/RateCard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-6"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

          <Route path="/book/:creatorId" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
          <Route path="/booking/:creatorId" element={<BookingForm />} />
          <Route path="/booking/confirm" element={<PrivateRoute><BookingConfirm /></PrivateRoute>} />
          <Route path="/ratecard/:id" element={<PrivateRoute><RateCard /></PrivateRoute>} />

          <Route path="/creator-dashboard" element={<PrivateRoute><CreatorDashboard /></PrivateRoute>} />
          <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />

          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />

          <Route path="*" element={<div className="text-center text-red-500 text-xl">Page not found</div>} />
        </Routes>
      </motion.main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>
          © 2025 Artify | <a href="/pricing" className="text-blue-300 hover:underline">Subscribe</a> | 
          Contact: <a href="mailto:info@artify.com" className="hover:underline">info@artify.com</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
