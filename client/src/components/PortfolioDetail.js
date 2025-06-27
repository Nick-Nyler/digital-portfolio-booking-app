import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

function PortfolioDetail() {
  const { id } = useParams();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['portfolioItem', id],
    queryFn: () =>
      fetch(`http://localhost:5555/public-portfolio-items/${id}`).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch portfolio item');
        return res.json();
      }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !item) return <p>Error loading portfolio item.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">{item.title}</h2>

      <img
        src={item.image_url}
        alt={item.title}
        className="w-full max-w-lg mb-4 rounded-lg shadow"
      />

      <p className="mb-2"><strong>Description:</strong> {item.description}</p>
      <p className="mb-2"><strong>Category:</strong> {item.category}</p>
      <p className="mb-2"><strong>Price:</strong> ${item.price}</p>
      <p className="mb-4"><strong>Rating:</strong> {item.rating ?? 'N/A'}</p>

      {/* Book Now button links to booking form with creatorId */}
      <Link
        to={`/booking/${item.user_id}`}
        state={{ creatorName: item.title }}
        className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Book This Creator
      </Link>
    </div>
  );
}

export default PortfolioDetail;
