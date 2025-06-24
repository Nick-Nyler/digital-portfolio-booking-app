import React from 'react';
import { useLocation } from 'react-router-dom';

function BookingConfirm() {
  const { state } = useLocation();

  if (!state) return <div className="detail-container">No booking details available</div>;

  return (
    <div className="detail-container">
      <h2>Booking Confirmed</h2>
      <p>Date: {state.date}</p>
      <p>Time: {state.time}</p>
      <p>Client: {state.clientName}</p>
    </div>
  );
}

export default BookingConfirm;