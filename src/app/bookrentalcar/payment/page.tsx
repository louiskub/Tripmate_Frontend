"use client";

import React from "react";
import Statenav from '@/components/navbar/statenav'

export default function HotelConfirmPaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER: fixed, ไม่ใช้ absolute วางสเต็ปเปอร์ด้วย flex */}
      <Statenav/>

      {/* MAIN: เว้นที่ให้ header ด้วย pt-16, ใช้คอนเทนเนอร์ไม่ fix width */}
      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 lg:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24 py-7">
          {/* Title */}
          <div className="flex flex-col gap-0.5 mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Rental Car Booking
            </h1>
            <p className="text-lg font-semibold text-gray-500">
              Make sure bla bla
            </p>
          </div>

          {/* 2 columns */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Confirm Payment */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Confirm Payment
                </h2>

                <div className="rounded border border-neutral-200">
                  <div className="w-full bg-blue-50 py-3.5">
                    <div className="px-3 flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded-sm bg-blue-700" />
                      <span className="text-base font-bold text-blue-700">
                        Credit/Debit Card
                      </span>
                    </div>
                  </div>

                  <div className="px-7 py-5 border-t border-neutral-200 flex flex-col items-end gap-5">
                    {/* Card holder name */}
                    <div className="w-full">
                      <label className="block text-sm text-gray-600 mb-1">
                        Card holder name *
                      </label>
                      <div className="h-12 rounded-md border border-neutral-200 px-3 flex items-center text-slate-900">
                        Emily Chow
                      </div>
                    </div>

                    {/* Card number */}
                    <div className="w-full">
                      <label className="block text-sm text-gray-600 mb-1">
                        Credit/debit card number *
                      </label>
                      <div className="h-12 rounded-md border border-neutral-200 px-3 flex items-center text-slate-900">
                        1234567890123
                      </div>
                    </div>

                    {/* Exp / CVV */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Expiration date *
                        </label>
                        <div className="h-10 rounded-md border border-neutral-200 px-3 flex items-center text-slate-900">
                          01/28
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          CVV/CVC *
                        </label>
                        <div className="h-10 rounded-md border border-neutral-200 px-3 flex items-center text-slate-900">
                          123
                        </div>
                      </div>
                    </div>

                    {/* Charge text */}
                    <div className="w-full flex items-center gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-sm font-medium text-slate-900">
                          5,192.92
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        will be charged to the credit/debit card you provided.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <section className="w-full rounded-[10px] bg-white p-6">
                <button
                  type="button"
                  disabled
                  className="h-9 md:h-10 w-full rounded-[10px] bg-sky-600 text-white text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700"
                >
                  Complete Booking
                </button>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="w-full lg:max-w-[384px] flex flex-col gap-2.5">
              {/* Card */}
              <div className="rounded-[10px] bg-white border border-neutral-200 p-2.5 flex gap-2.5">
                <div className="w-44 h-44 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
                <div className="flex-1 flex flex-col">
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
              </div>

              {/* Pick-up / Drop-off */}
              <div className="rounded-[10px] bg-white p-2.5 space-y-3">
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
                    <div className="text-sm text-gray-600">before 20.00</div>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="rounded-[10px] bg-white px-5 py-2.5 space-y-3.5">
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
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
