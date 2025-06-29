// src/components/BookingConfirm.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function BookingConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) 
    return <p className="text-center text-red-300">No booking details available</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 text-center"
    >
      <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
      <p className="text-lg mb-2">Date: {state.date}</p>
      <p className="text-lg mb-2">Time: {state.time}</p>
      <p className="text-lg mb-4">Client: {state.clientName}</p>
      <p className="text-gray-300 mb-6">
        Thank you! A creator will contact you soon.
      </p>

      <button
        onClick={() => navigate('/client-dashboard')}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Back to Dashboard
      </button>
    </motion.div>
  );
}

export default BookingConfirm;
