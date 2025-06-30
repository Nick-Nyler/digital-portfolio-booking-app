// src/components/PortfolioForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { API_URL } from '../api';

const PortfolioForm = () => {
  const [form, setForm] = useState({
    title: '',
    image_url: '',
    description: '',
    category: '',
    price: '',
    rating: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/portfolio-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: form.title,
          image_url: form.image_url,
          description: form.description,
          category: form.category,
          price: parseFloat(form.price),
          rating: parseFloat(form.rating) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add portfolio item');
      }
      toast.success('Portfolio item added!');
      // Invalidate cache so home refetches
      queryClient.invalidateQueries(['portfolioItems']);
      // Go back to home to see it
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Add Portfolio Item</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto flex flex-col gap-4 bg-white/80 p-6 rounded-lg"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-2 rounded-lg border border-gray-300 text-black"
          required
        />
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Image URL"
          className="p-2 rounded-lg border border-gray-300 text-black"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded-lg border border-gray-300 text-black"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded-lg border border-gray-300 text-black"
          required
        >
          <option value="">Select Category</option>
          <option value="Painting">Painting</option>
          <option value="Photography">Photography</option>
          <option value="Sculpture">Sculpture</option>
        </select>
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 rounded-lg border border-gray-300 text-black"
          required
        />
        <input
          name="rating"
          type="number"
          step="0.1"
          max="5"
          value={form.rating}
          onChange={handleChange}
          placeholder="Rating (0–5)"
          className="p-2 rounded-lg border border-gray-300 text-black"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          {isSubmitting ? 'Adding…' : 'Add Item'}
        </button>
      </form>
    </div>
  );
};

export default PortfolioForm;
