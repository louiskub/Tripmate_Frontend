import Statenav from "@/components/navbar/statenav"

const STARS = Array.from({ length: 5 })

const priceMain = { label: "1 room (1 night)", amount: "4,412.00" }
const priceBefore = [
  { label: "price before discount", amount: "5,786.74", discount: false },
  { label: "discount", amount: "1,374.74", discount: true },
]
const taxesAndFees = [
  { label: "VAT", amount: "4,412.00" },
  { label: "Service charge", amount: "4,412.00", strong: true },
]
const special = [
  { label: "Room type", value: "Non-smoking" },
  { label: "Bed size", value: "Large bed" },
]

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      {/* Main */}
      <main className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-5">
        <h1 className="text-gray-900 text-xl md:text-2xl font-extrabold">Hotel Booking</h1>

        {/* Big card */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
          {/* Title */}
          <div className="border-b border-gray-200 pb-2 space-y-1">
            <div className="text-gray-900 text-lg md:text-xl font-bold">Your booking is complete.</div>
            <div className="text-gray-500 text-sm md:text-base">Enjoy your stay!</div>
          </div>

          {/* Top row: Hotel + Guest name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* Hotel card */}
            <div className="bg-white rounded-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-36 md:w-44 h-36 sm:h-36 md:h-44 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 flex-shrink-0" />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-gray-900 font-semibold text-sm md:text-base">
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
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">10.0</span>
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
              <div className="mt-3 rounded-xl bg-gray-50 p-2 md:p-3 relative">
                <div className="flex gap-2">
                  <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 flex-shrink-0" />
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-900 text-xs sm:text-sm font-medium">
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
              <div className="text-gray-900 font-semibold mb-2 text-sm md:text-base">Guest Name</div>
              <div className="h-10 px-3 flex items-center rounded-md border border-gray-200 text-sm md:text-base">
                Emily Chow
              </div>
            </div>
          </div>

          {/* Pick-up / Drop-off */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="self-center w-full lg:w-auto rounded-xl border border-gray-200 p-3 md:p-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <div>
                  <div className="text-xs text-gray-500">Pick-up</div>
                  <div className="text-xs sm:text-sm text-gray-900">Sat, 25 Aug 2025</div>
                  <div className="text-xs text-gray-500">from 09.00</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs sm:text-sm text-gray-900">2 days</div>
                  <div className="w-4 h-3 bg-gray-900" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Drop-off</div>
                  <div className="text-xs sm:text-sm text-gray-900">Mon, 27 Aug 2025</div>
                  <div className="text-xs text-gray-500">before 20.00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Price details */}
          <div className="rounded-xl border border-gray-200 p-4 md:p-5 space-y-3">
            <div className="text-gray-900 text-lg md:text-xl font-bold">Price Details</div>

            <div className="space-y-1.5">
              <div className="flex items-start justify-between">
                <div className="text-gray-900 text-sm font-medium">{priceMain.label}</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-sm">฿</span>
                  <span className="text-gray-900 text-sm font-medium">{priceMain.amount}</span>
                </div>
              </div>

              {priceBefore.map((row) => (
                <div key={row.label} className="pl-3 md:pl-5 flex items-start justify-between">
                  <div className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.label}</div>
                  <div className="flex items-start gap-0.5">
                    {row.discount && <span className="text-red-500 text-xs">-</span>}
                    <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>฿</span>
                    <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.amount}</span>
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
                <div key={row.label} className="pl-3 md:pl-5 flex items-start justify-between">
                  <div className="text-gray-500 text-xs">{row.label}</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-xs">฿</span>
                    <span className={`text-xs ${row.strong ? "text-gray-900" : "text-gray-500"}`}>{row.amount}</span>
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
          <div className="rounded-xl border border-gray-200 p-4 md:p-5 space-y-2">
            <div className="text-gray-900 font-bold text-sm md:text-base">Special Request</div>
            <div className="space-y-2">
              {special.map((s) => (
                <div key={s.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <div className="text-sm text-gray-900 font-medium sm:w-24">{s.label}</div>
                  <div className="text-sm text-gray-500">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <button
            className="h-10 w-full rounded-[10px] bg-sky-600 text-white font-bold shadow text-sm md:text-base
                       transition-transform duration-500 ease-out hover:scale-[1.02] hover:bg-sky-700"
          >
            View your bookings
          </button>
        </section>
      </main>
    </div>
  )
}
