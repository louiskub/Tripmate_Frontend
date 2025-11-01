import Navbar from "@/components/navbar/nav"
import VendorSideNav from '@/components/navbar/vendorsidenav';

export default function BookingHistory({ bookings = defaultBookings }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <VendorSideNav />
      <div className="flex-1 p-4 md:p-7">
        <div className="flex bg-white rounded-lg p-2 md:p-4 shadow-sm gap-4">
          <section className="flex-1 p-3 md:p-5 flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-extrabold">Booking History</h1>

            <div className="w-full bg-white rounded-md shadow px-3 py-2 overflow-x-auto">
              <div className="inline-flex gap-3 items-center min-w-max">
                <button className="px-4 py-1 rounded-md bg-sky-100 text-sky-800 font-medium hover:bg-blue-50 whitespace-nowrap">
                  Hotel
                </button>
                <button className="px-4 py-1 rounded-md text-gray-500 hover:bg-blue-50 whitespace-nowrap">
                  Restaurant
                </button>
                <button className="px-4 py-1 rounded-md text-gray-500 hover:bg-blue-50 whitespace-nowrap">
                  Rental Car
                </button>
                <button className="px-4 py-1 rounded-md text-gray-500 hover:bg-blue-50 whitespace-nowrap">Guide</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-sm md:text-base font-medium">{bookings.length} bookings</div>
              <div className="flex gap-4 text-xs md:text-sm">
                <div>Sort by option1</div>
                <div>View</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-auto max-h-[60vh] md:max-h-[65vh] pr-2">
              {bookings.map((b) => (
                <article
                  key={b.id}
                  className="bg-white rounded-lg p-3 md:p-4 outline outline-1 outline-offset-[-1px] outline-sky-100 flex flex-col gap-3"
                >
                  <div className="flex justify-end">
                    <span className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full">{b.status}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-44 h-44 bg-gradient-to-b from-black/0 to-black/30 rounded-lg" />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">{b.title}</h3>

                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-3 bg-black" />
                            <span className="text-xs text-gray-600">location</span>
                          </div>

                          <div className="sm:ml-4 px-3 py-2 bg-sky-50 rounded-lg inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Check-in</span>
                              <span className="text-sm text-gray-900">{b.checkIn}</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-sm font-medium text-gray-900">
                                {b.nights} night{b.nights > 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Check-out</span>
                              <span className="text-sm text-gray-900">{b.checkOut}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row gap-3 mt-3">
                        <button className="flex-1 h-10 rounded-2xl border border-sky-600 text-sky-700 font-bold">
                          Review
                        </button>
                        <button className="flex-1 h-10 rounded-2xl bg-sky-200 text-sky-800 font-bold">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
  )
}

const defaultBookings = [
  {
    id: 1,
    title: "Centara Grand Mirage Beach Resort Pattaya",
    location: "Pattaya",
    checkIn: "Sat, 25 Aug 2025",
    checkOut: "Sun, 26 Aug 2025",
    nights: 1,
    status: "Status",
  },
  {
    id: 2,
    title: "Centara Grand Mirage Beach Resort Pattaya",
    location: "Pattaya",
    checkIn: "Sat, 25 Aug 2025",
    checkOut: "Sun, 26 Aug 2025",
    nights: 1,
    status: "Status",
  },
]
