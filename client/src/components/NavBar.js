import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavBar({ isAuthenticated, setIsAuthenticated }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-blue-700 sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">Artify</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-orange-300 transition">Explore</Link>
          <Link to="/pricing" className="text-white hover:text-orange-300 transition">Pricing</Link>
          {isAuthenticated ? (
            <>
              <Link to="/creator-dashboard" className="text-white hover:text-orange-300 transition">Creator Dashboard</Link>
              <Link to="/client-dashboard" className="text-white hover:text-orange-300 transition">Client Dashboard</Link>
              <button onClick={handleLogout} className="text-white hover:text-orange-300 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-orange-300 transition">Login</Link>
              <Link to="/signup" className="text-white hover:text-orange-300 transition">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
