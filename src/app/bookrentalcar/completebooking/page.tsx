"use client";
import Statenav from "@/components/navbar/statenav";

import React from "react";

export default function HotelBookingCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      {/* MAIN: เว้นที่ให้ header ด้วย pt-16; โครง 2 คอลัมน์ */}
      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 xl:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24 py-7">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Rental Car Booking
            </h1>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {/* กล่องหลัก */}
            <section className="w-full bg-white rounded-[10px] p-6 space-y-4">
              {/* Title */}
              <div className="pb-2.5 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-slate-900">
                  Your booking is complete.
                </h2>
              </div>

              {/* แถวบน: การ์ด + ข้อมูลแขก/ช่วงเวลา */}
              <div className="flex flex-col lg:flex-row gap-2.5">
                {/* การ์ดภาพ/โรงแรม */}
                <div className="flex-1 min-w-[280px] bg-white rounded-[10px] p-2.5 flex gap-2.5">
                  <div className="w-44 h-44 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-lg font-semibold text-slate-900">
                      name
                    </div>

                    <div className="flex gap-1 w-14">
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">
                        10.0
                      </span>
                      <span className="text-blue-700 text-xs">Excellent</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-3 bg-slate-900" />
                      <span className="text-xs text-slate-900">location</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">
                        tag
                      </span>
                    </div>
                  </div>
                </div>

                {/* กล่องข้อมูลแขก / เวลา */}
                <div className="flex-1 min-w-[280px] flex flex-col gap-2.5">
                  <div className="w-full rounded-[10px] border border-neutral-200 p-5 space-y-2">
                    <div className="text-xl font-bold text-slate-900">
                      Guest Name
                    </div>
                    <div className="w-full h-9 bg-gray-50 rounded-[10px] px-3 flex items-center text-slate-900">
                      Emily Chow
                    </div>
                  </div>

                  <div className="w-full rounded-[10px] border border-neutral-200 p-5">
                    <div className="flex items-center">
                      <div className="px-1 flex-1">
                        <div className="text-xs text-gray-500">Pick-up</div>
                        <div className="text-base font-medium text-slate-900">
                          Sat, 25 Aug 2025
                        </div>
                        <div className="text-sm text-gray-600">from 09.00</div>
                      </div>

                      <div className="w-16 flex flex-col items-center">
                        <div className="text-sm font-medium text-slate-900">
                          2 days
                        </div>
                        <div className="w-4 h-4 bg-slate-900 mt-1" />
                      </div>

                      <div className="px-1 flex-1">
                        <div className="text-xs text-gray-500">Drop-off</div>
                        <div className="text-base font-medium text-slate-900">
                          Mon, 27 Aug 2025
                        </div>
                        <div className="text-sm text-gray-600">
                          before 20.00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* แถวกลาง: ราคา */}
              <div className="w-full rounded-[10px] border border-neutral-200 p-5 space-y-3.5">
                <div>
                  <div className="text-xl font-bold text-slate-900">
                    Price Details
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">
                      Rental Car (2 days)
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">
                        18,000.00
                      </span>
                    </div>
                  </div>

                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">
                      price before discount
                    </div>
                    <div className="flex items-baseline gap-0.5 text-gray-500">
                      <span className="text-xs">฿</span>
                      <span className="text-xs">20,000.00</span>
                    </div>
                  </div>

                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">discount</div>
                    <div className="flex items-baseline gap-0.5 text-red-600">
                      <span className="text-xs">-</span>
                      <span className="text-xs">฿</span>
                      <span className="text-xs">2,000.00</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">Total</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base text-gray-500">฿</span>
                    <span className="text-base font-bold text-slate-900">
                      5,192.92
                    </span>
                  </div>
                </div>
              </div>

              {/* แถวล่าง: Note */}
              <div className="w-full">
                <div className="w-full h-32 flex">
                  <div className="flex-1 bg-white rounded-[10px] border border-neutral-200 p-6 space-y-2.5">
                    <div className="text-base font-medium text-slate-900">
                      Note
                    </div>
                    <div className="w-full min-h-10 bg-gray-50 rounded-[10px] px-3 py-2 text-sm text-slate-900">
                      Private table please
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="w-full bg-white rounded-[10px] p-6">
              <button
                type="button"
                className="h-9 md:h-10 w-full rounded-[10px] bg-sky-600 text-white text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700"
              >
                View your bookings
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
