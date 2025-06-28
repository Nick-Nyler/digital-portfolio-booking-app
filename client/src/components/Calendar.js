import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';

function CalendarComponent() {
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => fetch('http://localhost:5555/bookings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  const [availableDates, setAvailableDates] = useState([]);
  const updateMutation = useMutation({
    mutationFn: (data) => axios.patch(`http://localhost:5555/bookings/${data.id}`, data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }),
    onSuccess: () => toast.success('Availability updated!'),
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  useEffect(() => {
    if (bookings) {
      setAvailableDates(bookings.map(b => new Date(`${b.date}T${b.time}`)));
    }
  }, [bookings]);

  const tileDisabled = ({ date }) => {
    return !availableDates.some(d => d.toDateString() === date.toDateString());
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-300">Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-6">Availability Calendar</h2>
      <Calendar
        tileDisabled={tileDisabled}
        onChange={(date) => {
          const booking = bookings.find(b => new Date(`${b.date}T${b.time}`).toDateString() === date.toDateString());
          if (booking) {
            updateMutation.mutate({ id: booking.id, status: booking.status === 'pending' ? 'available' : 'pending' });
          }
        }}
      />
    </motion.div>
  );
}

export default CalendarComponent;