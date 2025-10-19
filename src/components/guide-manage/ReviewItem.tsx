"use client"

import { Star, ThumbsUp, Calendar } from 'lucide-react';

// --- Reusable Star Rating Component ---
const StarRating = ({ rating, className = "" }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {[...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={24} 
        className={index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ))}
  </div>
);

// --- Main Review Item Card ---
export default function ReviewItem({ review }) {
  return (
    <div className="w-full p-4 bg-blue-50 rounded-2xl flex gap-4">
      {/* Avatar */}
      <img className="w-12 h-12 rounded-full mt-1" src={review.avatarUrl} alt={review.customerName} />
      
      <div className="flex-1">
        {/* Header: Name and Rating */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800">{review.customerName}</h2>
            <h3 className="text-lg font-semibold text-gray-700 mt-1">{review.tourName}</h3>
          </div>
          <StarRating rating={review.rating} />
        </div>

        {/* Review Comment */}
        <p className="text-base text-gray-600 mt-2">
          {review.comment}
        </p>

        {/* Footer: Helpful count and Date */}
        <div className="flex items-center gap-5 mt-3 text-base font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <ThumbsUp size={16} />
            <span>{review.helpfulCount} helpful</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{review.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}