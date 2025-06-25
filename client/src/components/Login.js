import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required').min(3, 'Too short'),
  password: Yup.string().required('Required').min(6, 'Too short'),
});

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('http://localhost:5555/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(response => {
        if (!response.ok) throw new Error('Login failed');
        return response.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toast.success('Logged in successfully!');
        navigate('/');
      })
      .catch(error => toast.error(`Error: ${error.message}`))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="detail-container" role="form" aria-label="Login Form">
      <h2>Sign In</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" className="input-field" aria-invalid={touched.username && !!errors.username} />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="input-field" aria-invalid={touched.password && !!errors.password} />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-btn" aria-label="Sign in">
              Sign In
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;