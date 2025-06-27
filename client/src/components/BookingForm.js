import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

// 1) Validation schema stays the same
const BookingSchema = Yup.object().shape({
  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Date must be in the future'),
  time: Yup.string().required('Time is required'),
  clientName: Yup.string().required('Client name is required').min(2, 'Too short'),
});

function BookingForm() {
  const { creatorId } = useParams();            // grabs :creatorId from the URL
  const location = useLocation();               // to read state.creatorName
  const navigate = useNavigate();
  const creatorName = location.state?.creatorName;

  const handleSubmit = (values, { setSubmitting }) => {
    // **DEBUG LOG**: show exactly what we plan to send
    console.log('→ Booking payload:', {
      ...values,
      creatorId: Number(creatorId),
    });

    const token = localStorage.getItem('token'); // your JWT

    fetch('http://localhost:5555/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,       // include your token
      },
      body: JSON.stringify({
        ...values,
        creatorId: Number(creatorId),
      }),
    })
      .then(res => {
        // **DEBUG LOG**: show HTTP status code
        console.log('← Booking response status:', res.status);
        if (!res.ok) {
          throw new Error(`Booking failed (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        // **DEBUG LOG**: show any JSON response
        console.log('← Booking response data:', data);
        toast.success('Booking submitted!');
        navigate('/booking/confirm', { state: values });
      })
      .catch(error => {
        // **DEBUG LOG**: catch and show any network or parsing errors
        console.error('‼ Booking error:', error);
        toast.error(`Error: ${error.message}`);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Book Your Session</h2>
      {creatorName && (
        <p className="text-white text-center mb-4">
          Booking a session with <strong>{creatorName}</strong>
        </p>
      )}

      <Formik
        initialValues={{ date: '', time: '', clientName: '' }}
        validationSchema={BookingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-6 rounded-lg">
            {/* Date Field */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-white mb-2">Date</label>
              <Field
                type="date"
                name="date"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage name="date" component="div" className="text-red-300 text-sm mt-1" />
            </div>

            {/* Time Field */}
            <div className="mb-4">
              <label htmlFor="time" className="block text-white mb-2">Time</label>
              <Field
                type="time"
                name="time"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage name="time" component="div" className="text-red-300 text-sm mt-1" />
            </div>

            {/* Client Name Field */}
            <div className="mb-6">
              <label htmlFor="clientName" className="block text-white mb-2">Your Name</label>
              <Field
                type="text"
                name="clientName"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage name="clientName" component="div" className="text-red-300 text-sm mt-1" />
            </div>

            {/* Submit Button */}
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
