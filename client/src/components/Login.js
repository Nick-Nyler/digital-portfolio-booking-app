// components/Login.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

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
        localStorage.setItem('role', data.role);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
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

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-300 text-sm mt-1"
              />
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
            </motion.button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default Login;
