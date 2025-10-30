import Statenav from "@/components/navbar/statenav"

export default function GuideBookingCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      <main className="px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5">
        {/* Header */}
        <div className="flex flex-col justify-center items-start gap-0.5 mb-5">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-extrabold font-sans">Guide Booking</h1>
          <p className="text-gray-600 text-base sm:text-lg font-semibold font-sans">Make sure bla bla</p>
        </div>

        {/* Main Content */}
        <div className="max-w-[1240px] mx-auto">
          <div className="pb-2.5 flex flex-col gap-5">
            {/* Booking Complete Card */}
            <div className="px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-2.5">
              {/* Title */}
              <div className="pb-2.5 border-b border-gray-200 flex flex-col justify-center items-start gap-2">
                <h2 className="text-slate-900 text-lg sm:text-xl font-bold font-sans">Your booking is complete.</h2>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2.5">
                {/* Guide Card and Guest Info - Two Column Layout */}
                <div className="flex flex-col xl:flex-row gap-2.5">
                  {/* Guide Card */}
                  <div className="flex-1 p-2.5 bg-white rounded-[10px] border border-gray-300 flex flex-col sm:flex-row gap-2.5 overflow-hidden">
                    {/* Guide Image */}
                    <div className="w-full sm:w-56 h-56 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px] flex-shrink-0" />

                    {/* Guide Details */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-[3px]">
                        <div className="w-3 h-3 bg-gray-400" />
                        <span className="text-gray-600 text-xs font-normal font-sans">full name</span>
                      </div>

                      <h3 className="text-slate-900 text-lg font-semibold font-sans">name</h3>

                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-2 py-0.5 bg-blue-50 rounded-[20px] text-blue-700 text-xs font-medium">
                          tag
                        </span>
                        <div className="flex items-center gap-[3px]">
                          <div className="w-3 h-3 bg-slate-900" />
                          <span className="text-slate-900 text-xs font-normal font-sans">4 hours</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-[3px]">
                        <span className="px-2 py-0.5 bg-blue-50 rounded-[20px] text-blue-700 text-xs font-medium">
                          10.0
                        </span>
                        <span className="text-blue-700 text-xs font-normal font-sans">Excellent</span>
                      </div>

                      <div className="flex items-center gap-[3px]">
                        <div className="w-2.5 h-3 bg-slate-900" />
                        <span className="text-slate-900 text-xs font-normal font-sans">location</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Info Section */}
                  <div className="flex-1 xl:max-w-[400px] flex flex-col gap-2.5">
                    {/* Guest Name */}
                    <div className="px-5 py-2.5 rounded-[10px] border border-gray-200 flex flex-col gap-1">
                      <label className="text-slate-900 text-lg sm:text-xl font-bold font-sans">Guest Name</label>
                      <div className="h-9 px-2.5 py-2 bg-white rounded-[10px] flex items-center">
                        <span className="text-slate-900 text-base font-medium font-sans">Emily Chow</span>
                      </div>
                    </div>

                    {/* From/To Section */}
                    <div className="p-2.5 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-1.5">
                        {/* From */}
                        <div className="flex-1 flex flex-col gap-2.5">
                          <span className="text-gray-600 text-xs font-normal font-sans">From</span>
                          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                            <span className="text-slate-900 text-sm font-medium font-sans">Sat, 25 Aug 2025</span>
                            <div className="w-4 h-4 bg-slate-900" />
                          </div>
                          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-medium font-sans">10.00</span>
                            <div className="w-4 h-4 bg-slate-900" />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex sm:flex-col justify-center items-center gap-2">
                          <span className="text-slate-900 text-sm font-medium font-sans text-center">
                            4<br className="hidden sm:block" />
                            hours
                          </span>
                          <div className="w-4 h-4 bg-slate-900" />
                        </div>

                        {/* To */}
                        <div className="flex-1 flex flex-col gap-2.5">
                          <span className="text-gray-600 text-xs font-normal font-sans">To</span>
                          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                            <span className="text-slate-900 text-sm font-medium font-sans">Sat, 25 Aug 2025</span>
                            <div className="w-4 h-4 bg-slate-900" />
                          </div>
                          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-medium font-sans">10.00</span>
                            <div className="w-4 h-4 bg-slate-900" />
                          </div>
                        </div>
                      </div>

                      {/* Guest Count */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-900 text-sm font-medium font-sans">Guest *</span>
                        <div className="flex-1 h-7 px-2.5 py-1 rounded-[10px] border border-gray-200 flex justify-between items-center">
                          <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 bg-slate-900" />
                            <span className="text-slate-900 text-sm font-semibold font-sans">2</span>
                          </div>
                          <div className="w-2.5 h-1.5 bg-slate-900" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="px-5 py-2.5 rounded-[10px] border border-gray-200 flex flex-col gap-3.5">
                  <h3 className="text-slate-900 text-lg sm:text-xl font-bold font-sans">Price Details</h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-900 text-sm font-medium font-sans">Rental Car (2 days)</span>
                      <div className="flex items-start gap-0.5">
                        <span className="text-gray-600 text-sm font-normal">฿</span>
                        <span className="text-slate-900 text-sm font-medium font-sans">18,000.00</span>
                      </div>
                    </div>

                    <div className="pl-5 flex justify-between items-start">
                      <span className="text-gray-600 text-xs font-normal font-sans">price before discount</span>
                      <div className="flex items-start gap-px">
                        <span className="text-gray-600 text-xs font-normal">฿</span>
                        <span className="text-gray-600 text-xs font-normal font-sans">20,000.00</span>
                      </div>
                    </div>

                    <div className="pl-5 flex justify-between items-start">
                      <span className="text-gray-600 text-xs font-normal font-sans">discount</span>
                      <div className="flex items-start gap-px">
                        <span className="text-red-500 text-xs font-normal font-sans">-</span>
                        <span className="text-red-500 text-xs font-normal">฿</span>
                        <span className="text-red-500 text-xs font-normal font-sans">2,000.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-slate-900 text-base font-bold font-sans">Total</span>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-600 text-base font-normal">฿</span>
                      <span className="text-slate-900 text-base font-bold font-sans">5,192.92</span>
                    </div>
                  </div>
                </div>

                {/* Note Section */}
                <div className="min-h-32 px-6 py-4 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-2.5">
                  <h3 className="text-slate-900 text-base font-medium font-sans">Note</h3>
                  <div className="p-2.5 bg-gray-50 rounded-[10px] flex-1">
                    <p className="text-slate-900 text-sm font-medium font-sans">bla bla bla</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View Bookings Button */}
            <div className="px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col">
              <button className="w-full sm:w-auto h-10 px-2.5 py-3 bg-blue-700 hover:bg-blue-800 rounded-[10px] shadow-lg flex justify-center items-center transition-colors">
                <span className="text-gray-50 text-base font-bold font-sans">View your bookings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
