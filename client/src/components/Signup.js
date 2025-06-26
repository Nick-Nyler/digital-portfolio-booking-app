import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Required').min(3, 'Too short'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required').min(6, 'Too short'),
});

function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('http://localhost:5555/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(res => {
        if (!res.ok) throw new Error('Signup failed');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toast.success('Account created!');
        navigate('/login');
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
      <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-6 rounded-lg">
            <div className="mb-4">
              <label htmlFor="username" className="block text-white mb-2">Username</label>
              <Field type="text" name="username" className="w-full p-2 rounded-lg border border-gray-300 text-black" />
              <ErrorMessage name="username" component="div" className="text-red-300 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <Field type="email" name="email" className="w-full p-2 rounded-lg border border-gray-300 text-black" />
              <ErrorMessage name="email" component="div" className="text-red-300 text-sm mt-1" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <Field type="password" name="password" className="w-full p-2 rounded-lg border border-gray-300 text-black" />
              <ErrorMessage name="password" component="div" className="text-red-300 text-sm mt-1" />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default Signup;
