import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too short')
    .max(50, 'Too long')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['client', 'creator'], 'Please select a role')
    .required('Role is required'),
});

function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('https://artify-api-pkxy.onrender.com/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          // server might return { message: "Username already exists" }
          throw new Error(payload.message || 'Signup failed');
        }
        return payload;
      })
       .then(() => {
        toast.success('Account created! Please sign in.');
        navigate('/login');               // ← Redirect to Sign In
      })
      .catch((error) => {
        // if username/email not unique, server returns 400 with that message
        toast.error(error.message);
      })
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
        initialValues={{ username: '', email: '', password: '', role: '' }}
        validationSchema={SignupSchema}
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

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-300 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
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

            {/* Role Selector */}
            <div className="mb-6">
              <label htmlFor="role" className="block text-white mb-2">
                I am a
              </label>
              <Field
                as="select"
                name="role"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              >
                <option value="" label="Select role" />
                <option value="client" label="Client" />
                <option value="creator" label="Creator" />
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-300 text-sm mt-1"
              />
            </div>

            {/* Submit */}
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