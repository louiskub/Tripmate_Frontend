"use client"

import SideNav from '@/components/restaurant-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import BookingHistoryItem from '@/components/restaurant-manage/BookingHistoryItem';
import { ChevronDown, List, LayoutGrid } from 'lucide-react';

// --- Mock Data: Sample booking information ---
const mockBookings = [
  { 
    id: 1, 
    restaurantName: 'Gaggan Anand (sd-2568)', 
    renterName: 'Alice Johnson',
    rentDate: '12-03-2025',
    time: '12:00',
    price: 8500, 
    imageUrl: 'https://placehold.co/180x180/7C3AED/FFFFFF?text=Rest+1' 
  },
  { 
    id: 2, 
    restaurantName: 'Sorn (sr-1121)', 
    renterName: 'Bob Williams',
    rentDate: '18-03-2025',
    time: '19:30',
    price: 9999, 
    imageUrl: 'https://placehold.co/180x180/DB2777/FFFFFF?text=Rest+2'
  },
   { 
    id: 3, 
    restaurantName: 'Le Du (ld-7890)', 
    renterName: 'Charlie Brown',
    rentDate: '22-03-2025',
    time: '20:00',
    price: 12500, 
    imageUrl: 'https://placehold.co/180x180/059669/FFFFFF?text=Rest+3'
  },
];

export default function BookingHistoryPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        
        <main className="flex-1 p-7 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Booking History</h1>
              <p className="text-base text-gray-500">{mockBookings.length} Bookings</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black">
                <span>Sort by: Date</span>
                <ChevronDown size={16} />
              </button>
              <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-md">
                <button className="p-1.5 bg-white rounded shadow"><LayoutGrid size={16} /></button>
                <button className="p-1.5 text-gray-500"><List size={16} /></button>
              </div>
            </div>
          </div>

          {/* Booking List */}
          <div className="flex flex-col gap-5">
            {mockBookings.map(booking => (
              <BookingHistoryItem key={booking.id} booking={booking} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}