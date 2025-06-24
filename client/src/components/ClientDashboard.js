import React, { useEffect, useState } from 'react';

function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5555/bookings/client', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.error('Fetch error:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientDashboard;