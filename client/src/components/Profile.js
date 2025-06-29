import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';

function Profile() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('https://artify-api-pkxy.onrender.com/user', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  const [editData, setEditData] = useState({ email: '', password: '' });
  const updateMutation = useMutation({
    mutationFn: (data) => axios.put('https://artify-api-pkxy.onrender.com/user', data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }),
    onSuccess: () => toast.success('Profile updated!'),
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-300">Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
        <p>Username: {user.username}</p>
        <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" className="p-2 rounded-lg border border-gray-300 text-black mt-2" />
        <input type="password" value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} placeholder="New Password" className="p-2 rounded-lg border border-gray-300 text-black mt-2" />
        <motion.button
          onClick={() => updateMutation.mutate(editData)}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          whileHover={{ scale: 1.05 }}
        >
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Profile;