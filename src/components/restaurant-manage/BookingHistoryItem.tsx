import { Calendar, User, Clock } from 'lucide-react';

export default function BookingHistoryItem({ booking }) {
  return (
    <div className="flex w-full gap-4 p-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
      {/* Restaurant Image */}
      <div className="w-44 h-44 relative flex-shrink-0">
        <img 
          src={booking.imageUrl} 
          alt={booking.restaurantName} 
          className="w-full h-full rounded-md object-cover"
        />
      </div>
      
      {/* Booking Details */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{booking.restaurantName}</h3>
          
          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span><strong>Date:</strong> {booking.rentDate}</span>
            </div>
            <div className="flex items-center gap-2">
               <Clock size={14} className="text-gray-400" />
              <span><strong>Time:</strong> {booking.time}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <User size={14} className="text-gray-400" />
            <span><strong>Renter:</strong> {booking.renterName}</span>
          </div>
        </div>

        <div className="mt-2 text-right">
          <span className="text-lg font-bold text-gray-800">
            {booking.price.toLocaleString('en-US', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })}
          </span>
          <span className="text-sm text-gray-500">/person</span>
        </div>
      </div>
    </div>
  );
}