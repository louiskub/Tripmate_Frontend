"use client"

import SideNav from '@/components/guide-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import ReviewItem from '@/components/guide-manage/ReviewItem';

// --- MOCK DATA FOR CUSTOMER REVIEWS ---
const mockReviews = [
  {
    id: 1,
    customerName: 'Ms. Name Surname',
    avatarUrl: 'https://placehold.co/52x52/7C3AED/FFFFFF',
    tourName: 'Bangkok City Tour',
    comment: 'Amazing experience! The guide was knowledgeable and friendly. Highly recommend!',
    rating: 10,
    helpfulCount: 12,
    date: '09-02-2025',
  },
  {
    id: 2,
    customerName: 'Mr. John Smith',
    avatarUrl: 'https://placehold.co/52x52/DB2777/FFFFFF',
    tourName: 'Floating Market Adventure',
    comment: 'A truly authentic experience. Our guide, was fantastic and showed us all the best spots. The boat ride was a highlight!',
    rating: 9.5,
    helpfulCount: 8,
    date: '05-02-2025',
  },
  {
    id: 3,
    customerName: 'Mrs. Emily Jones',
    avatarUrl: 'https://placehold.co/52x52/059669/FFFFFF',
    tourName: 'Ancient Temples Tour',
    comment: 'A good tour, but it felt a bit rushed. We would have liked more time at the main temple.',
    rating: 7,
    helpfulCount: 3,
    date: '01-02-2025',
  },
];

// --- MAIN PAGE COMPONENT ---
export default function GuideReviewsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          {/* --- Header --- */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Customer Reviews
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Manage and respond to customer feedback
            </p>
          </div>
          
          {/* --- Review List --- */}
          <div className="mt-6 space-y-5">
            {mockReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}