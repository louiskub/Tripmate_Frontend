"use client"

import Navbar from '@/components/navbar/nav';
import StatCard from '@/components/hotelmanagement/StatCard';
import ChartCard from '@/components/hotelmanagement/ChartCard';
import VendorSideNav from '@/components/navbar/vendorsidenav';

// --- Mock Data สำหรับ Stat Cards ---
const statCardsData = [
  { title: "Total Restaurants", value: 18 },
  { title: "Available Restaurants", value: 10 },
  { title: "Unavailable", value: 0 },
  { title: "Full Booking", value: 8 },
];

// --- Mock Data สำหรับกราฟ Peak Days ---
const peakDaysData = [
  { day: 'Mon', bookings: 65 }, { day: 'Tue', bookings: 40 },
  { day: 'Wed', bookings: 25 }, { day: 'Thu', bookings: 40 },
  { day: 'Fri', bookings: 70 }, { day: 'Sat', bookings: 85 },
  { day: 'Sun', bookings: 95 },
];

// --- Mock Data สำหรับกราฟ Monthly Earnings ---
const monthlyEarningsData = [
    { month: 'Jan', earnings: 4500 }, { month: 'Feb', earnings: 3000 },
    { month: 'Mar', earnings: 5200 }, { month: 'Apr', earnings: 2800 },
    { month: 'May', earnings: 4800 }, { month: 'Jun', earnings: 6000 },
    { month: 'Jul', earnings: 5500 }, { month: 'Aug', earnings: 7000 },
    { month: 'Sep', earnings: 6200 }, { month: 'Oct', earnings: 8000 },
    { month: 'Nov', earnings: 9500 }, { month: 'Dec', earnings: 11000 },
];

type ReviewProgressBarProps = {
  label: string
  value: number
  percentage: number
}

// --- Component ย่อยสำหรับ Progress Bar ---
const ReviewProgressBar = ({ label, value, percentage }: ReviewProgressBarProps) => (
  <div className="flex items-center gap-3 w-full">
    <span className="w-24 text-gray-600 font-medium text-sm shrink-0">{label}</span>
    <div className="flex-1 h-2 bg-gray-200 rounded-full">
      <div
        className="h-full bg-blue-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-8 text-right text-gray-700 font-semibold text-sm">
      {value.toFixed(1)}
    </span>
  </div>
)

// --- Component ของ ReviewsSection ---
const ReviewsSection = () => (
    <div className="lg:col-span-2 p-6 pb-10 bg-white rounded-xl border border-neutral-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-2 flex items-center gap-4 justify-center md:justify-start">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-4xl font-extrabold flex-shrink-0">
            9.5
          </div>
          <div>
            <p className="text-blue-600 text-xl font-bold">Excellent</p>
            <p className="text-gray-500 text-sm">from 1,840 reviews</p>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col justify-center gap-4">
          <ReviewProgressBar label="Cleanliness" value={9.4} percentage={94} />
          <ReviewProgressBar label="Comfort" value={9.6} percentage={96} />
          <ReviewProgressBar label="Meal" value={9.8} percentage={98} />
          <ReviewProgressBar label="Location" value={9.2} percentage={92} />
          <ReviewProgressBar label="Service" value={9.8} percentage={98} />
          <ReviewProgressBar label="Facilities" value={9.0} percentage={90} />
        </div>
      </div>
    </div>
);

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <VendorSideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <h1 className="text-gray-800 text-3xl font-bold mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCardsData.map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ReviewsSection />
            <ChartCard 
              title="Peak Days"
              subtitle="Your busiest booking times and days"
              data={peakDaysData}
            />
          </div>
          
          <div className="h-115">
            <ChartCard 
              title="Monthly Earnings"
              subtitle="Your earnings over the last 12 months"
              data={monthlyEarningsData}
            />
          </div>
        </main>
      </div>
    </div>
  );
}