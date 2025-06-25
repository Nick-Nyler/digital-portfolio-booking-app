import React from 'react';
import { useQuery } from '@tanstack/react-query';

function ClientDashboard() {
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['clientBookings'],
    queryFn: () => fetch('http://localhost:5555/bookings/client', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (!res.ok) throw new Error('Failed to fetch client bookings');
      return res.json();
    }),
    retry: 1,
  });

  if (isLoading) return <div className="dashboard-container"><p>Loading...</p></div>;
  if (error) return <div className="dashboard-container">Error loading bookings: {error.message}</div>;

  return (
    <div className="dashboard-container" role="region" aria-label="Client Dashboard">
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