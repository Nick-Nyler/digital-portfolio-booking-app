import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    fetch('http://localhost:5555/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(response => {
        if (!response.ok) throw new Error('Signup failed');
        return response.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        navigate('/');
      })
      .catch(error => toast.error(`Error: ${error.message}`));
  };

  return (
    <div className="detail-container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" className="input-field" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="input-field" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="input-field" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;