import { Star, MapPin } from 'lucide-react';

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

export default function CarListItem({ car, onClick }) {
  return (
    // --- ✅ [แก้ไข] เปลี่ยนกลับไปใช้ <div> และเพิ่ม cursor-pointer ---
    <div 
      onClick={onClick}
      className="
        flex gap-4 p-3 bg-white rounded-lg w-full text-left 
        border border-neutral-200 shadow-sm 
        transition-colors duration-150 
        hover:bg-gray-100 cursor-pointer
      "
    >
      <div className="w-44 h-44 relative flex-shrink-0">
        <img 
          src={car.imageUrl} 
          alt={car.name} 
          className="w-full h-full rounded-md object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <div>
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