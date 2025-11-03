"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "@/components/guide-manage/sidenav";
import Navbar from "@/components/navbar/navbar";
import BookingItem from "@/components/guide-manage/HistoryBookingItem";
import BookingDetailModal from "@/components/guide-manage/HistoryBookingDetailModal";

const API_URL = "http://161.246.5.236:8800/guide/svc-004";

// ✅ รูป fallback ถ้ารูปโหลดไม่ได้
const FALLBACK_IMAGE =
  "https://placehold.co/600x400/cccccc/000000?text=Guide+Image";

export default function GuideHistoryPage() {
  const [guide, setGuide] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(API_URL);
        console.log("📦 Data from /guide/svc-004:", res.data);
        setGuide(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch guide detail:", err);
      }
    };
    fetchGuide();
  }, []);

  const handleViewDetails = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // ✅ แปลงข้อมูล guide → booking card format
  const formatGuideToBooking = (g: any) => ({
    id: g.id,
    bookingId: g.licenseId || "—",
    customerName: g.name,
    email: g.contacts?.email || "—",
    phone: g.contacts?.phone || "—",
    avatarUrl:
      g.image && g.image.startsWith("http") ? g.image : FALLBACK_IMAGE,
    tourName: g.locationSummary || "—",
    date: g.availability?.mon_fri || "N/A",
    time: g.availability?.weekend || "N/A",
    guests: g.experienceYears || 0,
    price: parseFloat(g.dayRate || "0"),
    duration: `${g.experienceYears} yrs`,
    status: "Completed",
    paid: true,
    gallery:
      Array.isArray(g.pictures) && g.pictures.length > 0
        ? g.pictures.filter((p: string) => p.startsWith("http"))
        : [FALLBACK_IMAGE],
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            Booking History
          </h1>

          {guide ? (
            <BookingItem
              booking={formatGuideToBooking(guide)}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <p className="text-gray-500 text-base font-medium">
              Loading guide booking...
            </p>
          )}
        </main>
      </div>

      {guide && (
        <BookingDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          booking={formatGuideToBooking(guide)}
        />
      )}
    </div>
  );
}
