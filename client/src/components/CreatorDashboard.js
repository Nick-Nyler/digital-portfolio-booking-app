import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function CreatorDashboard() {
  const queryClient = useQueryClient();
  const { data: portfolioItems = [], isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: () => fetch('http://localhost:5555/portfolio-items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (!res.ok) throw new Error('Failed to fetch portfolio items');
      return res.json();
    }),
    retry: 1,
  });
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => fetch('http://localhost:5555/bookings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    }),
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`http://localhost:5555/portfolio-items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (!res.ok) throw new Error('Failed to delete item');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['portfolioItems']),
    onError: (error) => toast.error(`Delete failed: ${error.message}`),
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => fetch(`http://localhost:5555/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status }),
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update booking');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['bookings']),
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  if (itemsLoading || bookingsLoading) return <div className="dashboard-container"><p>Loading...</p></div>;
  if (itemsError || bookingsError) return <div className="dashboard-container">Error loading data: {itemsError?.message || bookingsError?.message}</div>;

  return (
    <div className="dashboard-container" role="region" aria-label="Creator Dashboard">
      <h2>Your Portfolio Items</h2>
      <ul>
        {portfolioItems.map(item => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <button className="edit-btn" aria-label={`Edit ${item.title}`}>Edit</button>
            <button className="delete-btn" onClick={() => deleteMutation.mutate(item.id)} aria-label={`Delete ${item.title}`}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
            <button className="accept-btn" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'accepted' })} aria-label={`Accept booking on ${booking.date}`}>Accept</button>
            <button className="decline-btn" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'declined' })} aria-label={`Decline booking on ${booking.date}`}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreatorDashboard;