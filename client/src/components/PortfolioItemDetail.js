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
    <div className="max-w-4xl mx-auto p-6">
      <img src={item.image_url} alt={item.title} className="w-full h-96 object-cover rounded mb-4" />
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="text-gray-600 mb-4">{item.description}</p>
      <p className="text-gray-600">Category: {item.category}</p>
      <Link to="/booking" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-4 inline-block">
        Book a Session
      </Link>
    </div>
  );
}

export default PortfolioItemDetail;