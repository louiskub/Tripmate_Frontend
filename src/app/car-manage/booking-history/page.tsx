"use client";

import SideNavbar from "@/components/car-manage/sidenav/sidenav";
import Navbar from "@/components/navbar/navbar";
import BookingHistoryItem from "@/components/car-manage/booking/BookingHistoryItem";
import { ChevronDown, List, LayoutGrid } from "lucide-react";
import React, { useState, useEffect } from "react"; // --- [NEW] ---
import axios from "axios"; // --- [NEW] ---
import { authJsonHeader } from "@/utils/service/get-header"; // --- [NEW] ---
import { endpoints } from "@/config/endpoints.config"; // --- [NEW] ---

// --- [NEW] ---
// ประเภทข้อมูลที่ได้จาก Backend (ตามที่คุณให้มา)
type BackendBooking = {
  id: string;
  serviceId: string;
  subServiceId: string;
  optionId: string | null;
  groupId: string;
  startBookingDate: string;
  endBookingDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  price: string;
};

// --- [NEW] ---
// ประเภทข้อมูลที่ Component 'BookingHistoryItem' ต้องการ
// (อ้างอิงจาก mockBookings เดิม)
type ProcessedBooking = {
  id: string;
  carName: string;
  renterName: string;
  rentDate: string;
  returnDate: string;
  price: number;
  imageUrl: string;
};

// --- [REMOVED] ---
// ลบ mockBookings เดิมออก
// const mockBookings = [ ... ];

export default function BookingHistoryPage() {
  // --- [NEW] ---
  // State สำหรับเก็บข้อมูลที่ดึงมาและประมวลผลแล้ว
  const [bookings, setBookings] = useState<ProcessedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- [NEW] ---
  // Function สำหรับจัดรูปแบบวันที่
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // --- [NEW] ---
  // useEffect สำหรับดึงข้อมูล
  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        // 1. ดึงรายการจองทั้งหมด
        // !!! (สมมติว่านี่คือ endpoint ของคุณ)
        const res = await axios.get(
          endpoints.booking.getAllFromService(localStorage.getItem("serviceId")), // <--- สมมติ Endpoint
          authJsonHeader()
        );
        const backendBookings: BackendBooking[] = res.data;
        console.log("res data", res.data)
        // 2. สร้าง Array ของ Promises เพื่อดึงรายละเอียดรถ
        const bookingPromises = backendBookings.map(
          async (booking): Promise<ProcessedBooking | null> => {
            try {
              // 3. ดึงรายละเอียดของรถ/บริการ
              // !!! (สมมติว่านี่คือ endpoint ของคุณ)
              // คุณอาจจะต้องใช้ serviceId หรือ subServiceId
              const detailRes = await axios.get(
                endpoints.rental_car.detail(booking.subServiceId), // <--- สมมติ Endpoint
                authJsonHeader()
              );
              const carDetails = detailRes.data; // สมมติ data คือ { name: "Toyota Yaris", imageUrl: "..." }

              // 4. ประกอบร่างข้อมูลให้ตรงกับที่ Component ต้องการ
              return {
                id: booking.id,
                carName: `${carDetails.name} (${booking.subServiceId})`,
                renterName: "Unknown Renter", // <--- Backend ไม่มีข้อมูลนี้
                rentDate: formatDate(booking.startBookingDate),
                returnDate: formatDate(booking.endBookingDate),
                price: parseFloat(booking.price),
                imageUrl:
                  carDetails.imageUrl ||
                  "https://placehold.co/180x180/3B82F6/FFFFFF?text=Car",
              };
            } catch (err) {
              console.error(
                `Failed to fetch details for booking ${booking.id}:`,
                err
              );
              return null; // คืนค่า null ถ้า fetch ย่อยล้มเหลว
            }
          }
        );

        // 5. รอให้ทุก Promises ทำงานเสร็จ
        const resolvedBookings = await Promise.all(bookingPromises);
        const validBookings = resolvedBookings.filter(
          (b) => b !== null
        ) as ProcessedBooking[];

        setBookings(validBookings);
      } catch (error) {
        console.error("Failed to fetch booking history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavbar />

        <main className="flex-1 p-7 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Booking History
              </h1>
              {/* --- [MODIFIED] --- */}
              <p className="text-base text-gray-500">
                {bookings.length} Bookings
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {/* ...ส่วนของ Sort และ View options ... */}
              <button className="text-gray-600 hover:text-black">
                Sort by
              </button>
              <button className="text-gray-600 hover:text-black">View</button>
            </div>
          </div>

          {/* Booking List */}
          {/* --- [MODIFIED] --- */}
          {isLoading ? (
            <div className="text-center p-10">Loading booking history...</div>
          ) : (
            <div className="flex flex-col gap-5">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <BookingHistoryItem key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center p-10 text-gray-500">
                  No booking history found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

