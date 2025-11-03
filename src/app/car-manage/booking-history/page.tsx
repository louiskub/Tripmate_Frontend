"use client";

import SideNavbar from "@/components/car-manage/sidenav/sidenav";
import Navbar from "@/components/navbar/navbar";
import BookingHistoryItem from "@/components/car-manage/booking/BookingHistoryItem";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { authJsonHeader } from "@/utils/service/get-header";
import { endpoints } from "@/config/endpoints.config";

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

type ProcessedBooking = {
  id: string;
  carName: string;
  rentDate: string;
  returnDate: string;
  price: number;
  note: string;
  status: string;
};

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<ProcessedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const serviceId = localStorage.getItem("serviceId");
        console.log("🆔 serviceId:", serviceId);

        if (!serviceId) {
          console.warn("⚠️ ไม่มี serviceId ใน localStorage");
          return;
        }

        // ✅ เรียก API getAllFromService
        const res = await axios.get(
          endpoints.booking.getAllFromService(serviceId),
          authJsonHeader()
        );

        console.log("📦 Raw booking response:", res);
        const backendBookings: BackendBooking[] = res.data;

        // ✅ แปลงข้อมูลให้อยู่ในรูปแบบที่จะแสดงผลได้
        const processed = backendBookings.map((b) => ({
          id: b.id,
          carName: b.subServiceId, // subServiceId เป็นทะเบียนรถ เช่น "ขจ4567"
          rentDate: formatDate(b.startBookingDate),
          returnDate: formatDate(b.endBookingDate),
          price: parseFloat(b.price),
          note: b.note,
          status: b.status,
        }));

        console.log("✅ Processed bookings:", processed);
        setBookings(processed);
      } catch (err) {
        console.error("❌ ดึงข้อมูล booking ไม่สำเร็จ:", err);
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Booking History
              </h1>
              <p className="text-base text-gray-500">
                {bookings.length} Bookings
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center p-10">Loading booking history...</div>
          ) : bookings.length > 0 ? (
            <div className="flex flex-col gap-5">
              {bookings.map((b) => (
                <BookingHistoryItem
                  key={b.id}
                  booking={{
                    id: b.id,
                    carName: b.carName,
                    renterName: "Customer",
                    rentDate: b.rentDate,
                    returnDate: b.returnDate,
                    price: b.price,
                    imageUrl:
                      "https://placehold.co/180x180/3B82F6/FFFFFF?text=Car",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-10 text-gray-500">
              No booking history found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
