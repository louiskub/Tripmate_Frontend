"use client"

import SideNavbar from '@/components/car-manage/sidenav/sidenav'; 
import Navbar from '@/components/navbar/navbar';
import StatCard from '@/components/car-manage/dashboard/stat-card';

// -- Component ย่อยสำหรับหน้า Dashboard --
const ReviewProgressBar = ({ label, value, percentage }) => (
  <div className="flex items-center gap-4">
    <span className="w-28 text-gray-600 font-medium">{label}</span>
    <div className="flex-1 h-2 bg-gray-200 rounded-full">
      <div 
        className="h-full bg-blue-500 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-8 text-right text-gray-700 font-semibold">{value.toFixed(1)}</span>
  </div>
);

const ReviewsSection = () => (
  // 1. เพิ่ม flex flex-col เพื่อให้การ์ดเป็น flex container ในแนวตั้ง
  <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col">
    <h2 className="text-xl font-bold mb-4 text-gray-800">Reviews</h2>
    
    {/* 2. เพิ่ม wrapper div 
        - flex-1: ให้ยืดเต็มพื้นที่ที่เหลือ
        - flex items-center: จัดเนื้อหาข้างใน (ลูก) ให้อยู่ตรงกลางแนวตั้ง
    */}
    <div className="flex-1 flex items-center">
      
      {/* 3. เพิ่ม w-full ให้กับเนื้อหาเดิม เพื่อให้มันขยายเต็ม wrapper */}
      <div className="flex flex-col md:flex-row gap-6 w-full"> 
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r pr-6 pb-4 md:pb-0">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-4xl font-extrabold">
            8.8
          </div>
          <div>
            <p className="text-blue-600 text-xl font-bold">Excellent</p>
            <p className="text-gray-500 text-sm">from 1,234 reviews</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4">
          <ReviewProgressBar label="Quality" value={8.0} percentage={80} />
          <ReviewProgressBar label="Service" value={9.2} percentage={92} />
          <ReviewProgressBar label="Price" value={8.5} percentage={85} />
        </div>
      </div>

    </div>
  </div>
);

const MapSection = () => (
  <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center">
    <h2 className="text-xl font-bold mb-4">Location</h2>
     <img 
        className="w-full h-48 object-cover rounded-lg" 
        src="https://placehold.co/240x239" 
        alt="Map placeholder" 
      />
  </div>
);

const FinancialSection = () => (
  <div className="mt-6 p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
    <h2 className="text-xl font-bold mb-4">Financial</h2>
    <p className="text-gray-400">Financial chart goes here...</p>
  </div>
);


export default function RentalCarPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavbar />
        
        <main className="flex-1 p-7 overflow-y-auto">
          <h1 className="text-gray-800 text-3xl font-bold mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Cars" value={12} />
            <StatCard title="Available Cars" value={10} />
            <StatCard title="Active Rentals" value={2} />
            <StatCard title="Under Repair" value={0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ReviewsSection />
            <MapSection />
          </div>
          
          <FinancialSection />
        </main>
      </div>
    </div>
  );
}