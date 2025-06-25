import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const BookingSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  clientName: Yup.string().required('Client name is required'),
});

function BookingForm() {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    fetch('http://localhost:5000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      .catch(error => toast.error(`Error: ${error.message}`));
  };

  return (
    <div className="detail-container">
      <h2>Book a Session</h2>
      <Formik
        initialValues={{ date: '', time: '', clientName: '' }}
        validationSchema={BookingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="date">Date</label>
              <Field type="date" name="date" className="input-field" />
              <ErrorMessage name="date" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="time">Time</label>
              <Field type="time" name="time" className="input-field" />
              <ErrorMessage name="time" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="clientName">Client Name</label>
              <Field type="text" name="clientName" className="input-field" />
              <ErrorMessage name="clientName" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              Submit Booking
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BookingForm;