import Statenav from "@/components/navbar/bookingrestaurantstatenav"
import Link from "next/link"

export default function RestaurantBookingCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      <main className="px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5">
        <div className="flex flex-col justify-center items-start gap-0.5 mb-5">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-extrabold">Restaurant Booking</h1>
        </div>

        <div className="max-w-[1240px] mx-auto flex flex-col justify-start items-center gap-2.5">
          <div className="w-full pb-2.5 flex flex-col justify-start items-start gap-5">
            {/* Main Content Card */}
            <div className="w-full px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-2.5">
              {/* Header */}
              <div className="w-full pb-2.5 border-b border-gray-200 flex flex-col justify-center items-start gap-2">
                <div className="flex justify-start items-center gap-1">
                  <h2 className="text-slate-900 text-lg sm:text-xl font-bold">Your booking is complete.</h2>
                </div>
              </div>

              {/* Restaurant Card and Guest Info */}
              <div className="w-full flex flex-col xl:flex-row justify-start items-start gap-2.5">
                {/* Restaurant Card */}
                <div className="w-full xl:flex-1 p-2.5 bg-white rounded-[10px] flex flex-col sm:flex-row justify-start items-start gap-2.5 overflow-hidden">
                  {/* Restaurant Image */}
                  <div className="w-full sm:w-44 h-44 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px] flex-shrink-0" />

                  {/* Restaurant Details */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                    <div className="flex justify-start items-center gap-1 flex-wrap">
                      <h3 className="text-slate-900 text-base sm:text-lg font-semibold">name</h3>
                    </div>
                    <div className="flex justify-center items-center gap-[3px]">
                      <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex justify-center items-center gap-0.5">
                        <span className="text-blue-700 text-xs font-medium">10.0</span>
                      </div>
                      <span className="text-blue-700 text-xs">Excellent</span>
                    </div>
                    <div className="flex justify-start items-start gap-[3px]">
                      <div className="w-2.5 h-3 bg-slate-900" />
                      <span className="text-slate-900 text-xs">location</span>
                    </div>
                    <div className="flex justify-start items-center gap-0.5">
                      <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex justify-center items-center gap-0.5">
                        <span className="text-blue-700 text-xs font-medium">tag</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="w-full xl:flex-1 flex flex-col justify-start items-start gap-2.5">
                  {/* Guest Name */}
                  <div className="w-full px-4 sm:px-5 py-2.5 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start">
                    <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-2">Guest Name</h3>
                    <div className="w-full p-2.5 bg-white rounded-[10px] flex justify-start items-center gap-1">
                      <span className="text-slate-900 text-sm sm:text-base font-medium">Emily Chow</span>
                    </div>
                  </div>

                  {/* Date, Time, and Guest Count */}
                  <div className="w-full px-4 sm:px-5 py-2.5 bg-white rounded-[10px] border border-gray-200 flex flex-col justify-center items-center gap-2.5">
                    <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2.5">
                      {/* Date */}
                      <div className="flex-1 w-full flex flex-col justify-center items-start gap-1">
                        <label className="text-slate-900 text-sm font-medium">Date *</label>
                        <div className="w-full px-2.5 py-1.5 bg-gray-50 rounded-lg flex justify-between items-center">
                          <span className="text-slate-900 text-sm font-medium">Sat, 25 Aug 2025</span>
                          <div className="w-4 h-4 bg-slate-900" />
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex-1 w-full flex flex-col justify-center items-start gap-1">
                        <label className="text-slate-900 text-sm font-medium">Time *</label>
                        <div className="w-full px-2.5 py-1.5 bg-gray-50 rounded-lg flex justify-between items-center">
                          <span className="text-slate-900 text-sm font-medium">18.30</span>
                          <div className="w-4 h-4 bg-slate-900" />
                        </div>
                      </div>
                    </div>

                    {/* Guest Count */}
                    <div className="w-full flex justify-start items-center gap-2.5">
                      <label className="text-slate-900 text-sm font-medium">Guest *</label>
                      <div className="flex-1 px-2.5 py-1 bg-gray-50 rounded-[10px] flex justify-between items-center">
                        <div className="flex justify-start items-center gap-2.5">
                          <div className="w-4 h-4 bg-slate-900" />
                          <span className="text-slate-900 text-sm font-semibold">2</span>
                        </div>
                        <div className="w-2.5 h-1.5 bg-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="w-full flex flex-col justify-start items-start gap-2.5">
                <div className="w-full px-4 sm:px-6 py-4 bg-white rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-2.5">
                  <div className="flex flex-col justify-center items-start gap-2">
                    <h3 className="text-slate-900 text-base font-medium">Note</h3>
                  </div>
                  <div className="w-full min-h-[56px] p-2.5 bg-gray-50 rounded-[10px] flex justify-start items-start">
                    <p className="text-slate-900 text-sm font-medium">Private table please</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View Bookings Button */}
            <div className="w-full px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-2.5">
              <Link href="/bookguide/payment" className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <span className="text-sm sm:text-base font-bold text-gray-50">View your bookings</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
