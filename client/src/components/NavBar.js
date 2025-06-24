import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-purple-400 text-2xl mr-2">🎨</span>
        <span className="font-bold">Artify</span>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-purple-300">Explore</Link>
        <Link to="/pricing" className="hover:text-purple-300">Pricing</Link>
        <Link to="/signin" className="hover:text-purple-300">Sign In</Link>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default NavBar;