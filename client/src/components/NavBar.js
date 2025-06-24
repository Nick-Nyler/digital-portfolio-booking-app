import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <div className="brand">
        <span role="img" aria-label="art">🎨</span>
        <span>Artify</span>
      </div>
      <div>
        <Link to="/">Explore</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/signin">Sign In</Link>
        <button>Get Started</button>
      </div>
    </nav>
  );
}

export default NavBar;