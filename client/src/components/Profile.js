// src/components/Profile.js
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../api';  // ← pull in your API_URL

function Profile() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
    retry: 1,
  });

  const [editData, setEditData] = useState({ email: '', password: '' });
  const updateMutation = useMutation({
    mutationFn: (data) =>
      axios.put(`${API_URL}/user`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => toast.success('Profile updated!'),
    onError: (err) => toast.error(`Update failed: ${err.message}`),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)     return <p className="text-center text-red-300">Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
        <p className="mb-4"><strong>Username:</strong> {user.username}</p>
        <input
          type="email"
          value={editData.email}
          placeholder="New Email"
          onChange={e => setEditData(d => ({ ...d, email: e.target.value }))}
          className="w-full p-2 rounded-lg border border-gray-300 text-black mb-2"
        />
        <input
          type="password"
          value={editData.password}
          placeholder="New Password"
          onChange={e => setEditData(d => ({ ...d, password: e.target.value }))}
          className="w-full p-2 rounded-lg border border-gray-300 text-black mb-4"
        />
        <motion.button
          onClick={() => updateMutation.mutate(editData)}
          disabled={updateMutation.isLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
        >
          {updateMutation.isLoading ? 'Saving…' : 'Save Changes'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Profile;
