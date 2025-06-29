// src/components/PortfolioItemDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5555';

function PortfolioItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/public-portfolio-items`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch portfolio items');
        return res.json();
      })
      .then(data => {
        const found = data.find(i => i.id === Number(id));
        setItem(found || null);
      })
      .catch(error => console.error('Fetch error:', error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-container"><Skeleton height={400} /></div>;
  if (!item) return <div className="detail-container">Item not found</div>;

  return (
    <div className="detail-container">
      {/* ← Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        ← Back
      </button>

      <img src={item.image_url} alt={item.title} className="w-full max-w-lg mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
      <p className="mb-2">{item.description}</p>
      <p className="mb-2"><strong>Category:</strong> {item.category}</p>

      <Link
        to={`/booking/${item.user_id}`}
        state={{ creatorName: item.creator }}
        className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Book a Session
      </Link>
    </div>
  );
}

export default PortfolioItemDetail;
