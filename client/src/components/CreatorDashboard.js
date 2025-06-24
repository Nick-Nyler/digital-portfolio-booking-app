import React, { useEffect, useState } from 'react';

function CreatorDashboard() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5555/portfolio-items'),
      fetch('http://localhost:5555/bookings')
    ])
      .then(([itemsResponse, bookingsResponse]) =>
        Promise.all([itemsResponse.json(), bookingsResponse.json()])
      )
      .then(([itemsData, bookingsData]) => {
        setPortfolioItems(itemsData);
        setBookings(bookingsData);
      })
      .catch(error => console.error('Fetch error:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h2>Your Portfolio Items</h2>
      <ul>
        {portfolioItems.map(item => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
            <button className="accept-btn">Accept</button>
            <button className="decline-btn">Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreatorDashboard;