import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const BookingSchema = Yup.object().shape({
  date: Yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
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
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(() => {
        toast.success('Booking submitted!');
        navigate('/booking/confirm', { state: values });
      })
      .catch(error => toast.error(`Error: ${error.message}`))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="detail-container" role="form" aria-label="Booking Form">
      <h2>Book a Session</h2>
      <Formik
        initialValues={{ date: '', time: '', clientName: '' }}
        validationSchema={BookingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <div>
              <label htmlFor="date">Date</label>
              <Field type="date" name="date" className="input-field" aria-invalid={touched.date && !!errors.date} />
              <ErrorMessage name="date" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="time">Time</label>
              <Field type="time" name="time" className="input-field" aria-invalid={touched.time && !!errors.time} />
              <ErrorMessage name="time" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="clientName">Client Name</label>
              <Field type="text" name="clientName" className="input-field" aria-invalid={touched.clientName && !!errors.clientName} />
              <ErrorMessage name="clientName" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-btn" aria-label="Submit booking">
              Submit Booking
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BookingForm;