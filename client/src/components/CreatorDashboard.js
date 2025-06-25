import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function CreatorDashboard() {
  const queryClient = useQueryClient();
  const { data: portfolioItems = [], isLoading: itemsLoading, error: itemsError } = useQuery({
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

  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ title: '', image_url: '', description: '', category: '', price: 0, rating: 0 });

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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status }),
    }).then(res => {
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['bookings']),
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  if (itemsLoading || bookingsLoading) return <p className="text-center">Loading...</p>;
  if (itemsError || bookingsError) return <p className="text-center text-red-300">Error: {itemsError?.message || bookingsError?.message}</p>;

  function getJwtIdentity() {
    // Mock function to simulate get_jwt_identity from Flask-JWT-Extended
    return parseInt(localStorage.getItem('token').split('.')[1], 16) % 1000; // Simplified token parsing
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Creator Dashboard</h2>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">Your Portfolio</h3>
          <div className="mb-4">
            <input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Title" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
            <input value={newItem.image_url} onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })} placeholder="Image URL" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
            <input value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="Description" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
            <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="p-2 rounded-lg border border-gray-300 text-black mr-2">
              <option value="">Select Category</option>
              <option value="Painting">Painting</option>
              <option value="Photography">Photography</option>
              <option value="Sculpture">Sculpture</option>
            </select>
            <input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} placeholder="Price" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
            <input type="number" value={newItem.rating} onChange={(e) => setNewItem({ ...newItem, rating: parseFloat(e.target.value) })} placeholder="Rating" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
            <button onClick={() => createMutation.mutate(newItem)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Add Item</button>
          </div>
          {portfolioItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-2 flex justify-between items-center"
            >
              <span>{item.title}</span>
              <div>
                <button onClick={() => { setEditItem(item); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">Edit</button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2">Delete</button>
              </div>
            </motion.div>
          ))}
          {editItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/20 backdrop-blur-md p-4 rounded-lg mb-2"
            >
              <input value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} placeholder="Title" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
              <input value={editItem.image_url} onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })} placeholder="Image URL" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
              <input value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} placeholder="Description" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
              <select value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="p-2 rounded-lg border border-gray-300 text-black mr-2">
                <option value="">Select Category</option>
                <option value="Painting">Painting</option>
                <option value="Photography">Photography</option>
                <option value="Sculpture">Sculpture</option>
              </select>
              <input type="number" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })} placeholder="Price" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
              <input type="number" value={editItem.rating} onChange={(e) => setEditItem({ ...editItem, rating: parseFloat(e.target.value) })} placeholder="Rating" className="p-2 rounded-lg border border-gray-300 text-black mr-2" />
              <button onClick={() => updateMutation.mutate(editItem)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">Save</button>
              <button onClick={() => setEditItem(null)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold mb-2">Your Bookings</h3>
          {bookings.map(booking => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-2"
            >
              <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
              <div className="mt-2">
                <button onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'accepted' })} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2">Accept</button>
                <button onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'declined' })} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Decline</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CreatorDashboard;
