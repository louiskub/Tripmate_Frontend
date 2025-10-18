"use client"

import SideNavbar from '@/components/car-manage/sidenav/sidenav'; 
import Navbar from '@/components/navbar/navbar';
import BookingHistoryItem from '@/components/car-manage/booking/BookingHistoryItem';
import { ChevronDown, List, LayoutGrid } from 'lucide-react';

// --- Mock Data: ข้อมูลการจองสมมติสำหรับแสดงผล ---
const mockBookings = [
  { 
    id: 1, 
    carName: 'Toyota Yaris Ativ (sd-2568)', 
    renterName: 'John Doe',
    rentDate: '12-03-2025',
    returnDate: '15-03-2025',
    price: 8500, 
    imageUrl: 'https://placehold.co/180x180/3B82F6/FFFFFF?text=Car+A' 
  },
  { 
    id: 2, 
    carName: 'Honda Civic (hc-1121)', 
    renterName: 'Jane Smith',
    rentDate: '18-03-2025',
    returnDate: '20-03-2025',
    price: 9999, 
    imageUrl: 'https://placehold.co/180x180/10B981/FFFFFF?text=Car+B'
  },
   { 
    id: 3, 
    carName: 'Ford Ranger (fr-7890)', 
    renterName: 'Peter Jones',
    rentDate: '22-03-2025',
    returnDate: '25-03-2025',
    price: 12500, 
    imageUrl: 'https://placehold.co/180x180/F59E0B/FFFFFF?text=Car+C'
  },
];

export default function BookingHistoryPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavbar />
        
        <main className="flex-1 p-7 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Booking History</h1>
              <p className="text-base text-gray-500">{mockBookings.length} Bookings</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
                  {/* ...ส่วนของ Sort และ View options ... */}
                  <button className="text-gray-600 hover:text-black">Sort by</button>
                  <button className="text-gray-600 hover:text-black">View</button>
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