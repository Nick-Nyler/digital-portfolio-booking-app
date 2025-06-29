// src/components/Login.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { API_URL } from '../api';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required').min(3, 'Too short'),
  password: Yup.string().required('Required').min(6, 'Too short'),
});

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.message || 'Login failed');
        }
        return payload;
      })
      .then((data) => {
        // store token & role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        setIsAuthenticated(true);
        toast.success('Logged in!');

        // redirect based on role
        if (data.role === 'creator') {
          navigate('/creator-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      })
      .catch((error) => {
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
      <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-6 rounded-lg">
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-white mb-2">
                Username
              </label>
              <Field
                type="text"
                name="username"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-300 text-sm mt-1"
              />
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default Login;
