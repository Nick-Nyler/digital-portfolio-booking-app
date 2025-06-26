import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function PortfolioDetail() {
  const { id } = useParams();
  const [form, setForm] = useState({ date: '', time: '', clientName: '' });

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['portfolioItem', id],
    queryFn: () => fetch(`http://localhost:5555/portfolio-items/${id}`).then(res => res.json()),
  });

  const mutation = useMutation({
    mutationFn: () =>
      fetch('http://localhost:5555/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...form,
          creatorId: item.user_id,  // this is required by your backend
        }),
      }).then(res => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      }),
    onSuccess: () => toast.success('Booking request sent!'),
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading portfolio item.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
      <img src={item.image_url} alt={item.title} className="w-full max-w-lg mb-4" />
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
      <p>Category: {item.category}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}

export default PortfolioDetail;
