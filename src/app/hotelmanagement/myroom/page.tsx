"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Navbar from '@/components/navbar/nav';
import VendorSideNav from '@/components/navbar/vendorsidenav';
import Link from "next/link";

export default function RoomsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const rooms = [
    {
      id: 1,
      name: "Mirage Premium Explorer King View,sea",
      features: ["Sea view", "Non-smoking", "Balcony", "Free Wi-Fi", "Bathtub", "42.0 m²", "Private bathroom"],
      breakfast: "Breakfast included",
      bedType: "1 king bed",
      guests: 5,
      price: "THB 4,416",
      originalPrice: "THB 5,197",
      available: "34/50",
    },
    {
      id: 2,
      name: "Mirage Premium Explorer King View,sea",
      features: ["Sea view", "Non-smoking", "Balcony", "Free Wi-Fi", "Bathtub", "42.0 m²", "Private bathroom"],
      breakfast: "Breakfast included",
      bedType: "1 king bed",
      guests: 5,
      price: "THB 4,416",
      originalPrice: "THB 5,197",
      available: "34/50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <Navbar />

      <div className="flex">
        <VendorSideNav />
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-7">
          <div className="bg-white rounded-[10px] border border-gray-200 p-4 sm:p-5">
            {/* Header with New Room button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Room</h1>
              <Link href="/hotelmanagement/createroom/" className="px-4 py-2 bg-sky-700 text-white text-base font-bold rounded-[10px] shadow-lg hover:bg-sky-800">
                New Room
              </Link>
            </div>

            {/* Room Cards */}
            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-[10px] border border-gray-200 p-4">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">{room.name}</h2>

                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left: Image and Features */}
                    <div className="flex flex-col gap-2.5">
                      {/* Room Image */}
                      <div className="w-full sm:w-60 h-44 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px] relative">
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-50 rounded-full shadow" />
                          <div className="w-1.5 h-1.5 bg-zinc-100/50 rounded-full shadow" />
                          <div className="w-1.5 h-1.5 bg-zinc-100/50 rounded-full shadow" />
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="flex flex-col gap-1">
                        {room.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-900" />
                            <span className="text-xs text-black">{feature}</span>
                          </div>
                        ))}
                        <button className="text-blue-700 text-sm font-medium text-left mt-1">See room detail</button>
                      </div>
                    </div>

                    {/* Right: Room Details Grid */}
                    <div className="flex-1">
                      <div className="border border-gray-200 rounded-[10px] overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                          {/* Breakfast & Bed Type */}
                          <div className="p-2.5 flex flex-col justify-start">
                            <div className="flex items-center gap-0.5 py-0.5">
                              <span className="text-base font-bold text-slate-900">{room.breakfast}</span>
                              <div className="w-3 h-3 bg-gray-600" />
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-slate-900" />
                              <span className="text-xs text-slate-900">{room.bedType}</span>
                            </div>
                          </div>

                          {/* Guests */}
                          <div className="p-2.5 flex justify-center items-center">
                            <div className="flex items-center gap-0.5">
                              <div className="w-5 h-5 bg-slate-900" />
                              <span className="text-sm font-medium text-slate-900">{room.guests}</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="p-2.5 flex flex-col justify-end items-end">
                            <span className="text-base font-medium text-slate-900">{room.price}</span>
                            <div className="flex items-center gap-0.5">
                              <span className="text-[10px] text-slate-900">incl. taxes & fees</span>
                              <span className="text-[10px] text-slate-900">{room.originalPrice}</span>
                            </div>
                          </div>

                          {/* Available */}
                          <div className="p-2.5 flex flex-col justify-end items-start">
                            <span className="text-base font-medium text-slate-900 whitespace-pre-line">
                              {room.available}
                              {"\n"}Available
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <div className="flex justify-end mt-3">
                        <button className="px-6 py-2 bg-sky-700 text-white text-base font-bold rounded-2xl hover:bg-sky-800">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
