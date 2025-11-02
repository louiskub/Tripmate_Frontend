import { Calendar, User } from 'lucide-react';

export default function BookingHistoryItem({ booking }) {
  return (
    <div className="flex gap-4 p-3 bg-white rounded-lg border border-neutral-200 shadow-sm w-full">
      {/* Car Image */}
      <div className="w-44 h-44 relative flex-shrink-0">
        <img 
          src={booking.imageUrl} 
          alt={booking.carName} 
          className="w-full h-full rounded-md object-cover"
        />
      </div>
      
      {/* Booking Details */}
      <div className="flex flex-col flex-1 justify-between py-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{booking.carName}</h3>
          
          <div className="text-sm text-gray-600 mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span><strong>Rent:</strong> {booking.rentDate}</span>
            </div>
            <div className="flex items-center gap-2">
               <Calendar size={14} className="text-gray-400" />
              <span><strong>Return:</strong> {booking.returnDate}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-3 flex items-center gap-2">
            <User size={14} className="text-gray-400" />
            <span><strong>Renter:</strong> {booking.renterName}</span>
          </div>
        </div>

        <div className="text-right mt-2">
          <span className="text-lg font-bold text-gray-800">
            {booking.price.toLocaleString('en-US', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })}
          </span>
          <span className="text-sm text-gray-500">/day</span>
        </div>
      </div>
    </div>
  );
}