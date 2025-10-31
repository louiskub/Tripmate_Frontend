"use client"

import { ThumbsUp, Calendar } from 'lucide-react';

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
          
          {/* [แก้ไขตรงนี้] แสดงคะแนนแบบวงกลม */}
          <div className="flex items-center justify-center w-12 h-7 bg-blue-300/35 rounded-xl shrink-0">
            <span className="text-xl font-extrabold text-blue-700">
              {review.rating}
            </span>
          </div>

        </div>

        {/* Review Comment */}
        <p className="text-base text-gray-600 mt-2 mt-4"> {/* เพิ่ม mt-4 ให้มีระยะห่างจากชื่อเล็กน้อย */}
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