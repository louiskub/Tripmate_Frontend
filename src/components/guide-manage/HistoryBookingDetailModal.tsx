"use client"

import { X, User, Briefcase } from 'lucide-react';

export default function BookingDetailModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  // --- Sub-component for neatly displaying rows of data ---
  const DetailRow = ({ label, value }) => (
    <div className="grid grid-cols-[80px_10px_1fr] items-start text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="font-medium text-gray-500">:</span>
      <span className="font-medium text-gray-800 break-words">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-['Manrope']">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl relative p-6">
        {/* --- Close Button --- */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        {/* --- Header --- */}
        <h2 className="text-2xl font-extrabold text-gray-800">Booking Details</h2>
        <hr className="my-3 border-gray-200" />
        
        {/* --- Sub-header with Tour Name and Status --- */}
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">{booking.tourName}</h3>
                <p className="text-xs font-medium text-gray-500 mt-1">Booking ID: {booking.bookingId}</p>
            </div>
            <div className="flex gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{booking.status}</span>
                {booking.paid && <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-green-100 text-green-800">Paid</span>}
            </div>
        </div>
        
        {/* --- Main Content Box --- */}
        <div className="p-5 bg-blue-50 rounded-2xl space-y-4">
            {/* Customer Info Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-700" />
                    <h4 className="text-base font-semibold text-gray-800">Customer Information</h4>
                </div>
                <DetailRow label="Name" value={booking.customerName} />
                <DetailRow label="Email" value={booking.email} />
                <DetailRow label="Phone" value={booking.phone} />
            </div>

            <hr className="border-gray-300/70" />

            {/* Booking Info Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-gray-700" />
                    <h4 className="text-base font-semibold text-gray-800">Booking Detail</h4>
                </div>
                <DetailRow label="Date" value={booking.date} />
                <DetailRow label="Time" value={booking.time} />
                <DetailRow label="Guests" value={`${booking.guests} people`} />
                <div className='pt-2'>
                    <p className="text-sm font-medium text-gray-600">Total Price</p>
                    <p className="text-2xl font-extrabold text-green-600">$ {booking.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};