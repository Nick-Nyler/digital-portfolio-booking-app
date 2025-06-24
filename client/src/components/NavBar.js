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
        <span role="img" aria-label="art">:art:</span>
        <span>Artify</span>
      </div>
      <div>
        <Link to="/">Explore</Link>
        <Link to="/pricing">Pricing</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/client-dashboard">Client Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;

