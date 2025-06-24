import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PortfolioItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5555/portfolio-items/${id}`)
      .then(response => response.json())
      .then(data => setItem(data));
  }, [id]);

  if (!item) return <div>Loading...</div>;

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