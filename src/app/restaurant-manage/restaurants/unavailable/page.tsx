"use client"

import { useState } from 'react';
import Link from 'next/link';
import SideNav from '@/components/restaurant-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import ManageResNav from '@/components/restaurant-manage/ManageResSideNav';
import AddNewRestaurantModal from '@/components/restaurant-manage/AddNewRestaurantModal';
import RestaurantCard from '@/components/services/service-card/restaurant-card'
import { restaurants } from '@/mocks/restaurants';

export default function RestaurantsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateRestaurant = (formData) => {
    // ... โค้ดส่วนนี้เหมือนเดิม ...
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <div className="flex h-full gap-6 p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
            <ManageResNav onAddNew={() => setIsAddModalOpen(true)} />
            <div className='flex w-full gap-2.5 mt-2'>
              <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
                <span className='flex justify-between  p-2.5'>
                  <div className='text-xl font-bold'>Unavailable Restaurant</div>
                  <p>Sort by</p>
                </span>
                {restaurants.map((restaurant, idx) => (
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

      <AddNewRestaurantModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateRestaurant}
      />
    </div>
  );
}