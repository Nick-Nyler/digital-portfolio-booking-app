import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ isAuthenticated, setIsAuthenticated }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <nav>
      <div className="brand">
        <span className="sr-only">Artify Logo</span>
        <span>Artify</span>
      </div>
      <div>
        <Link to="/" aria-label="Explore">Explore</Link>
        <Link to="/pricing" aria-label="Pricing">Pricing</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" aria-label="Dashboard">Dashboard</Link>
            <Link to="/client-dashboard" aria-label="Client Dashboard">Client Dashboard</Link>
            <button onClick={handleLogout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin" aria-label="Sign In">Sign In</Link>
            <Link to="/signup" aria-label="Sign Up">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;