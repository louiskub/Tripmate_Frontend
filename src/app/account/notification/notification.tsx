"use client";

import React, { useEffect, useState } from "react";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  type: "hotel" | "restaurant" | "tour";
  imageUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock fetch API
  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);

      // จำลองการ fetch ข้อมูลจาก backend
      const mockResponse: NotificationItem[] = [
        {
          id: 1,
          title: "Your hotel booking is confirmed",
          message:
            "You have booked a room at Centara Grand Mirage Beach Resort Pattaya.",
          date: "Sat, 25 Aug 2025 21:00",
          type: "hotel",
          imageUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
        },
        {
          id: 2,
          title: "Your restaurant reservation is confirmed",
          message:
            "You’ve reserved a table for 2 at Blue Elephant Bangkok Restaurant.",
          date: "Fri, 12 Sep 2025 18:30",
          type: "restaurant",
          imageUrl:
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400",
        },
        {
          id: 3,
          title: "Your tour booking is confirmed",
          message: "You’re booked for Phi Phi Island full-day tour.",
          date: "Mon, 30 Sep 2025 08:00",
          type: "tour",
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
        },
        {
          id: 4,
          title: "Your booking has been updated",
          message:
            "Your check-in time at Hotel Nikko Bangkok has been changed to 2:00 PM.",
          date: "Tue, 05 Nov 2025 13:20",
          type: "hotel",
          imageUrl:
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
        },
      ];

      // จำลอง network delay
      setTimeout(() => {
        setNotifications(mockResponse);
        setLoading(false);
      }, 1200);
    }

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-lg text-gray-500 animate-pulse">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col gap-3">
      <h1 className="text-center text-custom-black text-2xl sm:text-3xl font-extrabold font-[Manrope]">
        Notifications
      </h1>

      <div className="bg-custom-white rounded-xl shadow-sm flex flex-col divide-y divide-neutral-200 overflow-hidden">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <div className="text-custom-black text-base sm:text-lg font-bold font-[Manrope]">
                {item.title}
              </div>

              <div className="text-custom-black text-sm font-medium leading-snug">
                {item.message}
              </div>

              <button className="text-dark-blue text-sm font-medium hover:underline self-start">
                View details
              </button>

              <div className="text-right text-custom-black text-xs font-normal mt-1">
                {item.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
