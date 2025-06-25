import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  role: Yup.string().oneOf(['user', 'client']).required('Role is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  username: Yup.string().when('role', {
    is: 'user',
    then: (schema) => schema.required('Username is required'),
    otherwise: (schema) => schema.strip(), // remove it if not used
  }),
  name: Yup.string().when('role', {
    is: 'client',
    then: (schema) => schema.required('Name is required'),
    otherwise: (schema) => schema.strip(),
  }),
});

function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    const endpoint = values.role === 'user' ? '/signup/user' : '/signup/client';

    const payload =
      values.role === 'user'
        ? {
            username: values.username,
            email: values.email,
            password: values.password,
          }
        : {
            name: values.name,
            email: values.email,
            password: values.password,
          };

    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Signup failed');
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        navigate(values.role === 'user' ? '/dashboard' : '/client-dashboard');
      })
      .catch((error) => toast.error(`Error: ${error.message}`))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="detail-container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={{
          role: 'user',
          username: '',
          name: '',
          email: '',
          password: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div>
              <label htmlFor="role">Sign up as:</label>
              <Field
                as="select"
                name="role"
                onChange={(e) => {
                  setFieldValue('role', e.target.value);
                }}
                className="input-field"
              >
                <option value="user">User</option>
                <option value="client">Client</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>

            {values.role === 'user' && (
              <div>
                <label htmlFor="username">Username</label>
                <Field type="text" name="username" className="input-field" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>
            )}

            {values.role === 'client' && (
              <div>
                <label htmlFor="name">Full Name</label>
                <Field type="text" name="name" className="input-field" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
            )}

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
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
