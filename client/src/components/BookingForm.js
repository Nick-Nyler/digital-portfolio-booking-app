// src/components/BookingForm.js
import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../api';

const BookingSchema = Yup.object().shape({
  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Date must be in the future'),
  time: Yup.string().required('Time is required'),
  clientName: Yup.string().required('Your name is required').min(2, 'Too short'),
});

export default function BookingForm() {
  const { creatorId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const creatorName = state?.creatorName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-4 text-center">
        Book {creatorName || 'Session'}
      </h2>

      <Formik
        initialValues={{ date: '', time: '', clientName: '' }}
        validationSchema={BookingSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await fetch(
              `${API_URL}/bookings`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                  creatorId: Number(creatorId),
                  ...values,
                }),
              }
            );

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.message || `Status ${res.status}`);
            }
            await res.json();

            toast.success('Booking submitted!');
            // refresh client dashboard bookings
            qc.invalidateQueries(['clientBookings']);
            navigate('/booking/confirm', { state: values });
          } catch (err) {
            toast.error(`Booking failed: ${err.message}`);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-6 rounded-lg space-y-6">
            {/* Calendar date picker */}
            <div>
              <label className="block text-white mb-2">Pick a Date</label>
              <Calendar
                onChange={date => setFieldValue('date', date.toISOString().split('T')[0])}
                value={values.date ? new Date(values.date) : null}
                minDate={new Date()}
                className="mx-auto mb-2"
              />
              <ErrorMessage name="date" component="div" className="text-red-300 text-sm mt-1" />
            </div>

            {/* Time input */}
            <div>
              <label htmlFor="time" className="block text-white mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={values.time}
                onChange={e => setFieldValue('time', e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage name="time" component="div" className="text-red-300 text-sm mt-1" />
            </div>

            {/* Client name */}
            <div>
              <label htmlFor="clientName" className="block text-white mb-2">Your Name</label>
              <input
                type="text"
                name="clientName"
                value={values.clientName}
                onChange={e => setFieldValue('clientName', e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage name="clientName" component="div" className="text-red-300 text-sm mt-1" />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Submitting…' : 'Confirm Booking'}
            </motion.button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
