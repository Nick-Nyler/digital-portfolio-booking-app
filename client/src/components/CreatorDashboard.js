import React, { useEffect, useState } from 'react';

function CreatorDashboard() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/portfolio-items')
      .then(response => response.json())
      .then(data => setPortfolioItems(data));
    fetch('http://localhost:5555/bookings')
      .then(response => response.json())
      .then(data => setBookings(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Portfolio Items</h2>
      <ul className="space-y-4">
        {portfolioItems.map(item => (
          <li key={item.id} className="bg-white p-4 rounded shadow">
            <h3>{item.title}</h3>
            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mt-6 mb-4">Your Bookings</h2>
      <ul className="space-y-4">
        {bookings.map(booking => (
          <li key={booking.id} className="bg-white p-4 rounded shadow">
            <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
            <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Accept</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreatorDashboard;