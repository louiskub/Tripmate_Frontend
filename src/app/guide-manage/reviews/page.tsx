"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "@/components/guide-manage/sidenav";
import Navbar from "@/components/navbar/navbar";
import ReviewItem from "@/components/guide-manage/ReviewItem";

const API_URL = "http://161.246.5.236:8800/review";

// ✅ รูป fallback ถ้ารูปไม่โหลดหรือไม่มี
const FALLBACK_AVATAR = "https://placehold.co/52x52/999/FFF?text=User";

export default function GuideReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(API_URL);
        console.log("📦 Data from /review:", res.data);

        const formatted = res.data.map((r: any) => ({
          id: r.id,
          customerName: `User ${r.userId?.slice(0, 5) || "Anonymous"}`,
          avatarUrl: FALLBACK_AVATAR,
          tourName: r.status ? r.status.toUpperCase() : "Service",
          comment: r.comment || "No comment provided.",
          rating: r.rating || 0,
          helpfulCount: Math.floor(Math.random() * 10), // mock ค่า
          date: new Date(r.createdAt).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          images:
            Array.isArray(r.image) && r.image.length > 0
              ? r.image
              : [FALLBACK_AVATAR],
        }));

        setReviews(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />

        <main className="flex-1 p-7 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Customer Reviews
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Manage and respond to customer feedback
            </p>
          </div>

          {/* Review List */}
          <div className="mt-6 space-y-5">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            ) : (
              <p className="text-gray-500 text-base mt-4">
                No reviews available.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
