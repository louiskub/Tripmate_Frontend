import React from 'react';

const STARS = Array.from({ length: 5 });

const priceMain = { label: '1 room (1 night)', amount: '4,412.00' };
const priceBefore = [
  { label: 'price before discount', amount: '5,786.74', discount: false },
  { label: 'discount', amount: '1,374.74', discount: true },
];
const taxesAndFees = [
  { label: 'VAT', amount: '4,412.00' },
  { label: 'Service charge', amount: '4,412.00', strong: true },
];
const special = [
  { label: 'Room type', value: 'Non-smoking' },
  { label: 'Bed size', value: 'Large bed' },
];

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 px-7 h-14 grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-2 text-2xl font-extrabold">
          <div>Logo</div>
          <div className="text-sky-600">TripMate</div>
        </div>

        <div className="flex flex-col items-center gap-1">
            <div className="w-64 flex items-center gap-2">
                <button className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] leading-none flex items-center justify-center transition-transform duration-200 ease-out hover:scale-120">1</button>
                <div className="flex-1 h-px bg-gray-300" />
                <button className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] leading-none flex items-center justify-center transition-transform duration-200 ease-out hover:scale-120">2</button>
                <div className="flex-1 h-px bg-gray-300" />
                <button className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] leading-none flex items-center justify-center transition-transform duration-200 ease-out hover:scale-120">3</button>
            </div>
            <div className="w-72 flex justify-between text-xs">
                <span className="text-sky-600">Your data</span>
                <span className="text-sky-600">Payment</span>
                <span className="text-sky-600">Complete</span>
            </div>
        </div>

        <div className="flex justify-end items-center gap-5">
          <div className="w-7 h-7 bg-black/90 rounded" />
          <div className="w-2.5 h-2.5 bg-black/90 rounded-full" />
          <div className="w-7 h-7 bg-black/90 rounded" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1240px] mx-auto px-6 md:px-8 py-6 space-y-5">
        <h1 className="text-gray-900 text-2xl font-extrabold">Hotel Booking</h1>

        {/* Big card */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
          {/* Title */}
          <div className="border-b border-gray-200 pb-2 space-y-1">
            <div className="text-gray-900 text-xl font-bold">Your booking is complete.</div>
            <div className="text-gray-500">Enjoy your stay!</div>
          </div>

          {/* Top row: Hotel + Guest name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Hotel card */}
            <div className="bg-white rounded-xl">
              <div className="flex gap-3">
                <div className="w-44 h-44 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400" />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-gray-900 font-semibold">
                    Centara Grand Mirage Beach Resort Pattaya
                  </div>

                  <div className="w-14 h-3 flex">
                    {STARS.map((_, i) => (
                      <div key={i} className="flex-1 flex items-center px-[1px]">
                        <div className="h-2.5 w-full bg-sky-600" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                      10.0
                    </span>
                    <span className="text-sky-700 text-xs">Excellent</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <div className="w-2.5 h-3 bg-gray-900" />
                    <span>location</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                    type
                  </span>
                </div>
              </div>

              {/* Small booking box */}
              <div className="mt-3 rounded-xl bg-gray-50 p-2 relative">
                <div className="flex gap-2">
                  <div className="w-28 h-28 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400" />
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-900 text-sm font-medium">
                      Mirage Premium Explorer King View,sea
                    </div>
                    <div className="pt-1.5 space-y-1 text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-900" />
                        <span>42.0 m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-900" />
                        <span>1 king bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-900" />
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 w-40 flex items-center gap-1 text-xs text-green-600">
                  <div className="w-4 h-3 bg-green-500" />
                  <span>Breakfast included</span>
                </div>

                <div className="absolute right-2 bottom-2 text-xs text-gray-700">x 1</div>
              </div>
            </div>

            {/* Guest name */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-900 font-semibold mb-2">Guest Name</div>
              <div className="h-10 px-3 flex items-center rounded-md border border-gray-200">
                Emily Chow
              </div>
            </div>
          </div>

          {/* Pick-up / Drop-off */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="self-center rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-3 items-center">
                <div>
                  <div className="text-xs text-gray-500">Pick-up</div>
                  <div className="text-sm text-gray-900">Sat, 25 Aug 2025</div>
                  <div className="text-xs text-gray-500">from 09.00</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-900">2 days</div>
                  <div className="w-4 h-3 bg-gray-900" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Drop-off</div>
                  <div className="text-sm text-gray-900">Mon, 27 Aug 2025</div>
                  <div className="text-xs text-gray-500">before 20.00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Price details */}
          <div className="rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="text-gray-900 text-xl font-bold">Price Details</div>

            <div className="space-y-1.5">
              <div className="flex items-start justify-between">
                <div className="text-gray-900 text-sm font-medium">{priceMain.label}</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-sm">฿</span>
                  <span className="text-gray-900 text-sm font-medium">{priceMain.amount}</span>
                </div>
              </div>

              {priceBefore.map((row) => (
                <div key={row.label} className="pl-5 flex items-start justify-between">
                  <div
                    className={`text-xs ${
                      row.discount ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {row.label}
                  </div>
                  <div className="flex items-start gap-0.5">
                    {row.discount && <span className="text-red-500 text-xs">-</span>}
                    <span
                      className={`text-xs ${
                        row.discount ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      ฿
                    </span>
                    <span
                      className={`text-xs ${
                        row.discount ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      {row.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start justify-between">
                <div className="text-gray-900 text-sm font-medium">Taxes & fees</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-sm">฿</span>
                  <span className="text-gray-900 text-sm font-medium">4,412.00</span>
                </div>
              </div>

              {taxesAndFees.map((row) => (
                <div key={row.label} className="pl-5 flex items-start justify-between">
                  <div className="text-gray-500 text-xs">{row.label}</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-xs">฿</span>
                    <span className={`text-xs ${row.strong ? 'text-gray-900' : 'text-gray-500'}`}>
                      {row.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex items-center justify-between">
              <div className="text-gray-900 text-base font-bold">Total</div>
              <div className="flex items-start gap-0.5">
                <span className="text-gray-500 text-base">฿</span>
                <span className="text-gray-900 text-base font-bold">5,192.92</span>
              </div>
            </div>
          </div>

          {/* Special Request summary */}
          <div className="rounded-xl border border-gray-200 p-5 space-y-2">
            <div className="text-gray-900 font-bold">Special Request</div>
            <div className="space-y-2">
              {special.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="text-sm text-gray-900 font-medium w-24">{s.label}</div>
                  <div className="text-sm text-gray-500">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <button
            className="h-10 w-full rounded-[10px] bg-sky-600 text-white font-bold shadow
                       transition-transform duration-500 ease-out hover:scale-[1.02] hover:bg-sky-700"
          >
            View your bookings
          </button>
        </section>
      </main>
    </div>
  );
}
