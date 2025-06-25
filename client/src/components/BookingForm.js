import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

const BookingSchema = Yup.object().shape({
  date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
  time: Yup.string().required('Time is required'),
  clientName: Yup.string().required('Client name is required').min(2, 'Too short'),
});

function BookingForm() {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('http://localhost:5555/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(values),
    })
      .then(res => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      })
      .then(() => {
        toast.success('Booking submitted!');
        navigate('/booking/confirm', { state: values });
      })
      .catch(error => toast.error(`Error: ${error.message}`))
      .finally(() => setSubmitting(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Book Your Session</h2>
      <Formik
        initialValues={{ date: '', time: '', clientName: '' }}
        validationSchema={BookingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-6 rounded-lg">
            <div className="mb-4">
              <label htmlFor="date" className="block text-white mb-2">Date</label>
              <Field type="date" name="date" className="w-full p-2 rounded-lg border border-gray-300 text-black" />
              <ErrorMessage name="date" component="div" className="text-red-300 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block text-white mb-2">Time</label>
              <Field type="time" name="time" className="w-full p-2 rounded-lg border border-gray-300 text-black" />
              <ErrorMessage name="time" component="div" className="text-red-300 text-sm mt-1" />
            </div>
            <div className="mb-6">
              <label htmlFor="clientName" className="block text-white mb-2">Your Name</label>
              <Field type="text" name="clientName" className="w-full p-2 rounded-lg border border-gray-300 text-black" />
              <ErrorMessage name="clientName" component="div" className="text-red-300 text-sm mt-1" />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Booking
            </motion.button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default BookingForm;
