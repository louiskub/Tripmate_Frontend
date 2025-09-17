import Navbar from '@/components/navbar/nav'
import SideNav from '@/components/navbar/sidenav'

export default function BookingDetail() {
  return (
    <div className="w-full h-screen relative bg-gray-50">
    <Navbar />

      <div className="flex h-[calc(100%-56px)]">
        <SideNav />

        <main className="flex-1 p-7 flex flex-col gap-5 overflow-auto">
          <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
            <h2 className="text-xl font-bold text-black">Booking Detail</h2>
            <div className="flex gap-5">
              <div className="flex-1 bg-white rounded-lg p-2.5 flex flex-col gap-2.5">
                <div className="bg-gradient-to-b from-gray-800/0 to-black/30 rounded-lg h-44"></div>
                <div className="text-black text-lg font-semibold">
                  Centara Grand Mirage Beach Resort Pattaya
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    10.0
                  </span>
                  <span className="text-xs text-blue-800">Excellent</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                <div className="bg-white rounded-lg p-5 outline outline-1 outline-gray-200">
                  <div className="text-xl font-bold text-black">Guest Name</div>
                  <div className="h-9 p-2.5 bg-white rounded-lg text-base font-medium text-black">
                    Emily Chow
                  </div>
                </div>
                <div className="bg-white rounded-lg p-5 outline outline-1 outline-gray-200 flex flex-col gap-2.5">
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-medium">Pick-up</span>
                    <span className="text-sm text-gray-500">Sat, 25 Aug 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-medium">Drop-off</span>
                    <span className="text-sm text-gray-500">Mon, 27 Aug 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 flex flex-col gap-2.5">
            <h3 className="text-base font-bold text-black">Special Request</h3>
            <div className="flex gap-2">
              <span className="text-sm text-black font-medium">Room type</span>
              <span className="text-sm text-gray-500">Non-smoking</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-black font-medium">Bed size</span>
              <span className="text-sm text-gray-500">Large bed</span>
            </div>
          </div>

          <div className="self-stretch px-6 py-4 bg-custom-white rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5">
            <button className="h-10 w-50 px-5 bg-blue-500 text-white font-bold rounded-2xl shadow-md hover:bg-blue-700">
              View your bookings
            </button>
            <button className="h-10 w-50 px-5 bg-red-500 text-white font-bold rounded-2xl shadow-md hover:bg-red-600">
              Cancel Booking
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
