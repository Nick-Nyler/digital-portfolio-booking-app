import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';

function PortfolioItemDetail() {
  const { id } = useParams();
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['portfolioItem', id],
    queryFn: () => fetch(`http://localhost:5555/portfolio-items/${id}`).then(res => {
      if (!res.ok) throw new Error('Failed to fetch portfolio item');
      return res.json();
    }),
    retry: 1,
  });

  if (isLoading) return <div className="detail-container"><Skeleton height={300} /></div>;
  if (error) return <div className="detail-container">Error loading item: {error.message}</div>;
  if (!item) return <div className="detail-container">Item not found.</div>;

  return (
    <div className="detail-container" role="article" aria-label={`${item.title} Details`}>
      <img src={item.image_url} alt={item.title} />
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <a href="/booking" aria-label={`Book ${item.title} session`}>Book a Session</a>
    </div>
  );
}

export default PortfolioItemDetail;