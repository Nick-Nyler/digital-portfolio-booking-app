import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

function PortfolioItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(http://localhost:5555/portfolio-items/${id})
      .then(response => response.json())
      .then(data => setItem(data))
      .catch(error => console.error('Fetch error:', error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-container"><Skeleton height={400} /></div>;
  if (!item) return <div className="detail-container">Item not found</div>;

  return (
    <div className="detail-container">
      <img src={item.image_url} alt={item.title} />
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <Link to="/booking">Book a Session</Link>
    </div>
  );
}

export default PortfolioItemDetail;