"use client"

import { Calendar, Clock, DollarSign, Hourglass, Check } from 'lucide-react';

// --- Reusable Status Badge ---
const StatusBadge = ({ status }) => {
    const statusConfig = {
        Confirmed: { text: 'Confirmed', icon: <Check size={14} />, className: 'bg-green-500 text-white' },
        Pending: { text: 'Pending', icon: <Clock size={14} />, className: 'bg-blue-500 text-white' },
        Completed: { text: 'Completed', icon: <Check size={14} />, className: 'bg-emerald-500 text-white' },
    };
    const config = statusConfig[status];

    return (
        <div className={`flex items-center justify-center gap-1.5 w-32 h-10 px-2.5 py-1 rounded-md ${config.className}`}>
            {config.icon}
            <span className="text-base font-semibold">{config.text}</span>
        </div>
    );
};

// --- Main Booking Item Card ---
export default function BookingItem({ booking, onViewDetails }) {
    return (
        <div className="w-full p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
            <img className="w-14 h-14 rounded-full" src={booking.avatarUrl} alt={booking.customerName} />
            
            <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-gray-800">{booking.customerName}</h2>
                <h3 className="text-lg font-semibold text-gray-700 mt-1">{booking.tourName}</h3>
                <div className="flex items-center gap-4 mt-2 text-base font-medium text-gray-600">
                    <div className="flex items-center gap-1.5"><Calendar size={16} /><span>{booking.date}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={16} /><span>{booking.time}</span></div>
                    <div className="flex items-center gap-1.5"><DollarSign size={16} /><span>{booking.price.toFixed(2)}</span></div>
                    <div className="flex items-center gap-1.5"><Hourglass size={16} /><span>{booking.duration}</span></div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <StatusBadge status={booking.status} />
                <button 
                    onClick={() => onViewDetails(booking)}
                    className="w-32 h-10 px-2.5 py-1 bg-blue-100 rounded-md text-base font-semibold text-gray-800 hover:bg-blue-200 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};