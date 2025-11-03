"use client"

import SideNav from '@/components/guide-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import ChartCard from '@/components/guide-manage/ChartCard';
import { DollarSign, Book, Star, Eye, ArrowUp } from 'lucide-react';

// --- MOCK DATA FOR GUIDE DASHBOARD ---

const guideStatCardsData = [
  { 
    title: "Total Earning", 
    value: "$20,800", 
    change: "+12%", 
    changeText: "from last month",
    icon: <DollarSign size={20} className="text-gray-500" /> 
  },
  { 
    title: "Total Booking", 
    value: "103", 
    change: "+8%", 
    changeText: "from last month",
    icon: <Book size={20} className="text-gray-500" />
  },
  { 
    title: "Average Rating", 
    value: "8.8", 
    change: "", 
    changeText: "from 1,234 reviews",
    icon: <Star size={20} className="text-gray-500" />
  },
  { 
    title: "Profile Views", 
    value: "1,247", 
    change: "+23%", 
    changeText: "from last month",
    icon: <Eye size={20} className="text-gray-500" />
  },
];

const peakDaysData = [
  { day: 'Mon', bookings: 63 }, { day: 'Tue', bookings: 95 },
  { day: 'Wed', bookings: 106 }, { day: 'Thu', bookings: 95 },
  { day: 'Fri', bookings: 58 }, { day: 'Sat', bookings: 46 },
  { day: 'Sun', bookings: 35 },
];

const monthlyEarningsData = [
    { month: 'Jan', earnings: 4500 }, { month: 'Feb', earnings: 3000 },
    { month: 'Mar', earnings: 5200 }, { month: 'Apr', earnings: 2800 },
    { month: 'May', earnings: 4800 }, { month: 'Jun', earnings: 6000 },
    { month: 'Jul', earnings: 5500 }, { month: 'Aug', earnings: 7000 },
    { month: 'Sep', earnings: 6200 }, { month: 'Oct', earnings: 8000 },
    { month: 'Nov', earnings: 9500 }, { month: 'Dec', earnings: 11000 },
];

// --- UPDATED COMPONENTS FOR GUIDE DASHBOARD ---

const StatCard = ({ title, value, change, changeText, icon }) => (
  <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm grid grid-rows-[auto_1fr_auto] h-32">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {icon}
    </div>
    <div className="flex items-center justify-center">
      <p className="text-3xl font-extrabold text-green-600">{value}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">
        {change && <span className="text-green-600">{change} </span>}
        {changeText}
      </p>
    </div>
  </div>
);

const ReviewProgressBar = ({ label, value, percentage }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="w-28 text-gray-700 font-medium text-base shrink-0">{label}</span>
    <div className="flex-1 h-2.5 bg-blue-100 rounded-full">
      <div 
        className="h-full bg-blue-500 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-8 text-right text-blue-600 font-semibold text-sm">{value.toFixed(1)}</span>
  </div>
);

const ReviewsSection = () => (
    <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-2 flex items-center gap-4 justify-center md:justify-start">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-4xl font-extrabold flex-shrink-0">
            8.8
          </div>
          <div>
            <p className="text-blue-600 text-xl font-bold">Excellent</p>
            <p className="text-gray-500 text-sm">from 1,234 reviews</p>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col justify-center gap-3">
          <ReviewProgressBar label="Knowledge" value={8.0} percentage={80} />
          <ReviewProgressBar label="Communication" value={9.2} percentage={92} />
          <ReviewProgressBar label="Punctuality" value={9.5} percentage={95} />
          <ReviewProgressBar label="Safety" value={8.8} percentage={88} />
          <ReviewProgressBar label="Route Planning" value={8.5} percentage={85} />
          <ReviewProgressBar label="Local Insights" value={9.0} percentage={90} />
        </div>
      </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function GuideDashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <h1 className="text-gray-800 text-3xl font-extrabold mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {guideStatCardsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
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
          
          <div className="h-96">
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