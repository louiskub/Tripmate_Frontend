"use client"

// 1. IMPORT STATE และ MODAL
import { useState } from 'react';
import Link from 'next/link';
import SideNav from '@/components/guide-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import RestaurantCard from '@/components/services/service-card/restaurant-card'
import { restaurants } from '@/mocks/restaurants';
import { Plus } from 'lucide-react'; 
import CreateServiceModal from '@/components/guide-manage/CreateServiceModal';

// (สมมติ Type ของ restaurant)
type RestaurantType = {
  restaurant_id: string | number;
  [key: string]: any;
}

export default function RestaurantsPage() {
  // 2. สร้าง STATE สำหรับควบคุม Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // (เพิ่ม relative เพื่อให้ Modal ซ้อนทับได้ถูกต้อง)
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope'] relative">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
            <div className='flex w-full gap-2.5 mt-2'>
              <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
                
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-800'>My Services</h2>
                    <p className='text-sm text-gray-500 mt-1'>Manage your tour offerings and pricing</p>
                  </div>
                  
                  {/* 3. ลบ <Link> ออก และเปลี่ยนเป็น <button> ที่มี onClick */}
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'
                  >
                    <Plus size={18} />
                    <span>Add New Service</span>
                  </button>
                  
                </div>
                
                <div className='p-4 space-y-4'>
                  {(restaurants as RestaurantType[]).map((restaurant, idx) => (
                    <Link 
                      key={idx} 
                      href={`/restaurant/${restaurant.restaurant_id}?from=manage`}
                      passHref
                    >
                      <RestaurantCard key={idx} {...restaurant} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
        </main>
      </div>

      {/* 4. แสดง MODAL แบบมีเงื่อนไข */}
      {isModalOpen && (
        <CreateServiceModal onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}