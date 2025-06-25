// components/Login.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  role: Yup.string().oneOf(['user', 'client']).required('Role is required'),
});

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const endpoint =
      values.role === 'client'
        ? 'http://localhost:5000/login/client'
        : 'http://localhost:5000/login/user';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Login failed');
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toast.success('Logged in successfully!');

        // Navigate to different dashboards based on role
        if (values.role === 'client') {
          navigate('/client-dashboard');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => toast.error(`Error: ${error.message}`));
  };

  return (
    <div className="detail-container">
      <h2>Sign In</h2>
      <Formik
        initialValues={{ email: '', password: '', role: 'user' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
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
            <div>
              <label htmlFor="role">Login as:</label>
              <Field as="select" name="role" className="input-field">
                <option value="user">User</option>
                <option value="client">Client</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              Sign In
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
