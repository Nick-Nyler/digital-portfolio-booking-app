import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function CreatorDashboard() {
  const queryClient = useQueryClient();

  const { data: portfolioItemsRaw, isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: () => fetch('http://localhost:5555/portfolio-items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => fetch('http://localhost:5555/bookings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  // Fallback to empty array if not valid
  const portfolioItems = Array.isArray(portfolioItemsRaw) ? portfolioItemsRaw : [];

  console.log('portfolioItems:', portfolioItems);  // Debug output

  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    title: '', image_url: '', description: '', category: '', price: 0, rating: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`http://localhost:5555/portfolio-items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['portfolioItems']),
    onError: (error) => toast.error(`Delete failed: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => axios.put(`http://localhost:5555/portfolio-items/${data.id}`, data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['portfolioItems']);
      setEditItem(null);
    },
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  const createMutation = useMutation({
    mutationFn: (data) => axios.post('http://localhost:5555/portfolio-items', { ...data, user_id: getJwtIdentity() }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['portfolioItems']);
      setNewItem({ title: '', image_url: '', description: '', category: '', price: 0, rating: 0 });
    },
    onError: (error) => toast.error(`Create failed: ${error.message}`),
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => fetch(`http://localhost:5555/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    }).then(res => {
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['bookings']),
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  function getJwtIdentity() {
    // Dummy parser — replace with actual user ID if needed
    return parseInt(localStorage.getItem('token')?.split('.')[1], 16) % 1000;
  }

  if (itemsLoading || bookingsLoading) return <p className="text-center">Loading...</p>;
  if (itemsError || bookingsError) return <p className="text-center text-red-300">Error: {itemsError?.message || bookingsError?.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Creator Dashboard</h2>
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Portfolio</h3>
          {/* Form Inputs */}
          <div className="mb-4">
            {/* ... New item input fields (same as before) ... */}
          </div>

          {/* Render items safely */}
          {portfolioItems.length > 0 ? (
            portfolioItems.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-2 flex justify-between items-center">
                <span>{item.title}</span>
                <div>
                  <button onClick={() => setEditItem(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">Edit</button>
                  <button onClick={() => deleteMutation.mutate(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 italic">No portfolio items yet.</p>
          )}

          {/* Edit form remains the same */}
        </motion.div>

        {/* Bookings section remains unchanged */}
      </AnimatePresence>
    </div>
  );
}

export default CreatorDashboard;
