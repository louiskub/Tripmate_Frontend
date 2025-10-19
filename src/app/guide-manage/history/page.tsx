"use client"

import { useState } from 'react';
import SideNav from '@/components/guide-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import BookingItem from '@/components/guide-manage/HistoryBookingItem';
import BookingDetailModal from '@/components/guide-manage/HistoryBookingDetailModal';

// --- MOCK DATA ---
const mockBookings = [
    { id: 1, bookingId: '#BK001', customerName: 'Ms. Name Surname', email: 'name.surname@example.com', phone: '+66 89-123-4567', avatarUrl: 'https://placehold.co/52x52/7C3AED/FFFFFF', tourName: 'Bangkok Temple Tour', date: '02-09-2025', time: '09:00 AM', guests: 4, price: 180.00, duration: '4 hours', status: 'Confirmed', paid: true },
    { id: 2, bookingId: '#BK002', customerName: 'Mr. John Smith', email: 'john.smith@example.com', phone: '+66 81-234-5678', avatarUrl: 'https://placehold.co/52x52/DB2777/FFFFFF', tourName: 'Floating Market Adventure', date: '03-09-2025', time: '08:00 AM', guests: 2, price: 200.00, duration: '6 hours', status: 'Pending', paid: false },
    { id: 3, bookingId: '#BK003', customerName: 'Mrs. Emily Jones', avatarUrl: 'https://placehold.co/52x52/059669/FFFFFF', tourName: 'Ancient Temples Tour', date: '01-09-2025', time: '10:00 AM', guests: 3, price: 120.00, duration: '3 hours', status: 'Completed', paid: true, email: 'emily.jones@example.com', phone: '+66 82-345-6789' },
];

export default function GuideHistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            Booking History
          </h1>
          
          <div className="space-y-5">
            {mockBookings.map((booking) => (
              <BookingItem 
                key={booking.id} 
                booking={booking}
                onViewDetails={handleViewDetails} 
              />
            ))}
          </div>
        </main>
      </div>

      <BookingDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
      />
    </div>
  );
}