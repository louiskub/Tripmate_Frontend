"use client"

import { useState } from "react"
import Navbar from '@/components/navbar/nav';
import VendorSideNav from '@/components/navbar/vendorsidenav';
import Link from "next/link";

export default function HotelSearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hotels = [
    { id: 1, name: "name", tag: "tag", rating: 10.0, ratingText: "Excellent", location: "location", price: "4,412.00" },
    { id: 2, name: "name", tag: "tag", rating: 10.0, ratingText: "Excellent", location: "location", price: "4,412.00" },
    { id: 3, name: "name", tag: "tag", rating: 10.0, ratingText: "Excellent", location: "location", price: "4,412.00" },
    { id: 4, name: "name", tag: "tag", rating: 10.0, ratingText: "Excellent", location: "location", price: "4,412.00" },
  ]

  const filterSections = [
    { items: ["text", "text", "text", "text"] },
    { items: ["text", "text", "text", "text"] },
    { items: ["text", "text", "text", "text"] },
    { items: ["text", "text", "text", "text"] },
    { items: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text"] },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="flex">
        {/* Left Sidebar - Categories */}
        <VendorSideNav />

        {/* Main Content */}
        <main className="mt-1 flex-1 px-4 sm:px-6 md:px-12 lg:px-24 py-2.5">
          {/* Search Bar */}
          <div className="bg-white rounded-[10px] border border-gray-200 p-2 sm:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">My Hotel</h1>
              <Link href="/hotelmanagement/createhotel/" className="px-4 py-2 bg-sky-700 text-white text-base font-bold rounded-[10px] shadow-lg hover:bg-sky-800">
                New Hotel
              </Link>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-2.5">
            {/* Hotel Listings */}
            <div className="mt-2 flex-1 flex flex-col gap-2.5">
              {/* Header */}
              <div className="px-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-slate-900 text-base font-medium">Found 9999 hotels</div>
                <div className="flex items-center gap-2.5">
                  <div className="text-slate-900 text-base font-medium">Sort by option1</div>
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="xl:hidden text-slate-900 text-base font-medium hover:text-blue-700"
                  >
                    Filters
                  </button>
                  <div className="hidden sm:block text-slate-900 text-base font-medium">View</div>
                </div>
              </div>

              {/* Hotel Cards */}
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-[10px] border border-gray-200 p-2.5 flex flex-col sm:flex-row gap-2.5"
                >
                  {/* Hotel Image */}
                  <div className="w-full sm:w-44 h-44 relative bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]">
                    <button className="absolute right-2 top-2 w-6 h-6 bg-white rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] flex items-center justify-center hover:bg-gray-100">
                      <div className="w-3 h-2.5 bg-slate-900" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      <div className="w-[5px] h-[5px] bg-gray-50 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)]" />
                      <div className="w-[5px] h-[5px] bg-zinc-100/50 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)]" />
                      <div className="w-[5px] h-[5px] bg-zinc-100/50 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)]" />
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-2">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1">
                        <div className="text-slate-900 text-lg font-semibold">{hotel.name}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-2 py-0.5 bg-sky-50 rounded-[20px]">
                          <div className="text-blue-700 text-xs font-medium">{hotel.tag}</div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-sky-700" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-2 py-0.5 bg-sky-50 rounded-[20px]">
                          <div className="text-blue-700 text-xs font-medium">{hotel.rating}</div>
                        </div>
                        <div className="text-blue-700 text-xs">{hotel.ratingText}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-3 bg-slate-900" />
                        <div className="text-slate-900 text-xs">{hotel.location}</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end items-end gap-1">
                      <div className="flex items-end gap-0.5">
                        <div className="text-gray-600 text-xs">From</div>
                        <div className="flex items-start gap-0.5">
                          <div className="text-blue-700 text-sm">฿</div>
                          <div className="text-blue-700 text-sm font-medium">{hotel.price}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar - Map & Filters */}
            <aside className={`${filtersOpen ? "block" : "hidden"} mt-3 xl:block w-full xl:w-60 flex flex-col gap-2.5`}>
              {/* Map */}
              <div className="w-full h-40 relative shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] rounded-[10px] overflow-hidden">
                <img className="w-full h-full object-cover" src="https://placehold.co/240x160" alt="Map" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-12 bg-gradient-to-b from-blue-700 to-cyan-500" />
                </div>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-white rounded-[20px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] flex items-center gap-1 hover:bg-gray-50">
                  <div className="text-slate-900 text-sm font-semibold">View on map</div>
                  <div className="w-4 h-3.5 bg-slate-900" />
                </button>
              </div>

              {/* Filter Sections */}
              {filterSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="py-1.5 bg-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] flex flex-col gap-1"
                >
                  {section.items.map((item, itemIndex) => (
                    <label
                      key={itemIndex}
                      className="h-7 px-2.5 py-[2.50px] flex items-center gap-1 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="w-5 h-5 bg-gray-200 rounded" />
                      <div className="text-gray-600 text-sm font-medium">{item}</div>
                    </label>
                  ))}
                </div>
              ))}
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
