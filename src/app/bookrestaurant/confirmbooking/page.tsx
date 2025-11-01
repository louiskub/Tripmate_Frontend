import Statenav from "@/components/navbar/bookingrestaurantstatenav"
import Link from "next/link"

export default function RestaurantConfirmBookingPage() {
  // const [useAccountInfo, setUseAccountInfo] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Statenav />

      {/* Main Content */}
      <main className="px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-10">
        <div className="flex flex-col items-start gap-0.5 mb-5">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-extrabold ">Restaurant Booking</h1>
          <p className="text-gray-600 text-base sm:text-lg font-semibold ">Make sure bla bla</p>
        </div>

        <div className="max-w-7xl flex flex-col xl:flex-row items-start gap-5 xl:gap-2.5">
          {/* Left Column - Form */}
          <div className="w-full xl:flex-1 flex flex-col gap-5">
            {/* Main Guest Section */}
            <div className="px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h2 className="text-slate-900 text-lg sm:text-xl font-bold ">Main Guest</h2>
                  <button
                    // onClick={() => setUseAccountInfo(!useAccountInfo)}
                    className="py-px flex items-center gap-1.5"
                  >
                    <input type="checkbox" className="w-4 h-4 bg-gray-200 rounded" />
                    <span className="text-gray-600 text-sm sm:text-base font-medium ">
                      use my account info
                    </span>
                  </button>
                </div>
                <p className="text-gray-600 text-sm sm:text-base font-medium ">
                  Please make sure that your name matches your id and the contacts are correct.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="First name*"
                    className="p-2.5 bg-white rounded-[10px] border border-gray-200 text-gray-600 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last name*"
                    className="p-2.5 bg-white rounded-[10px] border border-gray-200 text-gray-600 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone number *"
                  className="p-2.5 bg-white rounded-[10px] border border-gray-200 text-gray-600 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Note Section */}
            <div className="px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-5">
              <div className="flex items-center gap-1">
                <h2 className="text-slate-900 text-lg sm:text-xl font-bold ">Note</h2>
                <span className="text-gray-600 text-base font-medium ">(optional)</span>
              </div>
              <textarea
                placeholder="Add any special requests..."
                className="min-h-14 p-2.5 bg-white rounded-[10px] border border-gray-200 text-gray-600 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            {/* Confirm Button Section */}
            <div className="hidden xl:block py-5.5 px-4 rounded-[10px] bg-white space-y-2.5">
              <div className="-mt-2 text-sm font-medium text-sky-700">You won’t be charged yet</div>
              <Link href="/bookrestaurant/completebooking" className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <span className="text-sm sm:text-base font-bold text-gray-50">Confirm Booking</span>
              </Link>
              <div className="text-sm text-gray-500">By continuing to payment, I agree to TripMate’s{" "}
                <a className="underline" href="#">Terms of Use</a>{" "}and{" "}
                <a className="underline" href="#">Privacy Policy</a>.
              </div>
            </div>
          </div>

          {/* Right Column - Restaurant Details */}
          <div className="w-full xl:w-96 flex flex-col gap-2.5">
            {/* Restaurant Card */}
            <div className="p-2.5 bg-white rounded-[10px] border border-gray-200 flex flex-col sm:flex-row xl:flex-row gap-2.5">
              <div className="w-full sm:w-44 h-44 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]" />
              <div className="flex-1 flex flex-col gap-0.5">
                <h3 className="text-slate-900 text-base sm:text-lg font-semibold ">name</h3>
                <div className="flex items-center gap-[3px]">
                  <div className="px-2 py-0.5 bg-blue-50 rounded-[20px]">
                    <span className="text-blue-700 text-xs font-medium font-['Inter']">10.0</span>
                  </div>
                  <span className="text-blue-700 text-xs font-normal ">Excellent</span>
                </div>
                <div className="flex items-start gap-[3px]">
                  <div className="w-2.5 h-3 bg-slate-900" />
                  <span className="text-slate-900 text-xs font-normal ">location</span>
                </div>
                <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] inline-flex w-fit">
                  <span className="text-blue-700 text-xs font-medium font-['Inter']">tag</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-2.5 bg-white rounded-[10px] flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-900 text-sm font-medium ">Date *</label>
                  <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                    <span className="text-gray-600 text-sm font-medium ">Sat, 25 Aug 2025</span>
                    <div className="w-4 h-4 bg-slate-900 rounded" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-900 text-sm font-medium ">Time *</label>
                  <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                    <span className="text-gray-600 text-sm font-medium ">18.30</span>
                    <div className="w-4 h-4 bg-slate-900 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <label className="text-slate-900 text-sm font-medium ">Guest *</label>
                <div className="flex-1 h-7 px-2.5 py-1 rounded-[10px] border border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 bg-slate-900 rounded" />
                    <span className="text-slate-900 text-sm font-semibold ">2</span>
                  </div>
                  <div className="w-2.5 h-1.5 bg-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CTA for mobile */}
        <div className="block xl:hidden bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 flex flex-col gap-2.5">
          <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
          <Link href="/bookrestaurant/completebooking" className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <span className="text-sm sm:text-base font-bold text-gray-50">Confirm Booking</span>
          </Link>
          <div className="text-sm text-gray-500">By continuing to payment, I agree to TripMate’s{" "}
            <a className="underline" href="#">Terms of Use</a>{" "}and{" "}
            <a className="underline" href="#">Privacy Policy</a>. 
          </div>
        </div>
      </main>
    </div>
  )
}
