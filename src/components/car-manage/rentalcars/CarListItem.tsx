"use client" 

import { useState } from 'react'; 
import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'; 
import type React from 'react'; // [ใหม่] Import React type

// [ใหม่] 1. เพิ่ม Component `StatusBadge`
// (เราสามารถคัดลมาจาก CarDetailModal หรือสร้างใหม่ที่นี่ได้)
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Rented: "bg-yellow-100 text-yellow-800",
    "Under Repair": "bg-red-100 text-red-800",
    Unavailable: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

// --- StarRating Component (เหมือนเดิม) ---
const StarRating = ({ rating, maxStars = 5 }) => (
  <div className="flex items-center">
    {[...Array(maxStars)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ))}
    <span className="ml-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
      {rating.toFixed(1)}
    </span>
  </div>
);

// --- CarListItem Component (แก้ไข) ---
export default function CarListItem({ car, onClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ตรวจสอบ `car.imageUrls` ให้เป็น array เสมอ
  const images = Array.isArray(car.imageUrls) ? car.imageUrls : [];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // [สำคัญ] ป้องกันไม่ให้กดแล้ว Modal เปิด
    if (images.length > 0) { // เพิ่มการตรวจสอบ
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // [สำคัญ] ป้องกันไม่ให้กดแล้ว Modal เปิด
    if (images.length > 0) { // เพิ่มการตรวจสอบ
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="
        relative // [ใหม่] 2. เพิ่ม `relative` ที่กล่องหลัก
        flex gap-4 p-3 bg-white rounded-lg w-full text-left 
        border border-neutral-200 shadow-sm 
        transition-colors duration-150 
        hover:bg-gray-100 cursor-pointer
      "
    >
      {/* [ใหม่] 3. เพิ่ม StatusBadge ที่มุมบนขวา */}
      <div className="absolute top-3 right-3 z-10">
        <StatusBadge status={car.status} />
      </div>

      {/* Carousel (เหมือนเดิม) */}
      <div className="w-44 h-44 relative flex-shrink-0 group overflow-hidden rounded-md">
        <img 
          src={images[currentImageIndex] || 'https://placehold.co/430x412/9CA3AF/FFFFFF?text=No+Image'} 
          alt={car.name} 
          className="w-full h-full object-cover transition-transform duration-300"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`
                    w-1.5 h-1.5 rounded-full 
                    ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}
                    transition-all
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- ส่วนข้อความ (เหมือนเดิม) --- */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* [หมายเหตุ] เราจะ "เว้นที่" ให้ badge ที่อยู่ด้านบน
              โดยการไม่ให้ชื่อรถชิดขอบบนเกินไป
              แต่เนื่องจาก badge อยู่ด้านขวา และชื่ออยู่ด้านซ้าย
              จึงไม่น่าจะทับกันครับ */}
          <h3 className="text-lg font-semibold text-gray-800">{car.name}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={12} />
            {car.location}
          </p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {car.description}
          </p>
        </div>
        <div className="flex justify-between items-end mt-2">
          <StarRating rating={car.rating} />
          <div className="text-right">
            <span className="text-lg font-bold text-gray-800">THB {car.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}