"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BookNavbar from "@/components/navbar/default-nav-variants/book-navbar";
import { endpoints, BASE_URL } from '@/config/endpoints.config'; 
import Cookies from "js-cookie"; 
import axios from "axios"; 
import { AiFillStar } from "react-icons/ai";

// (สมมติว่า import 'endpoints' มาจากที่นี่)
// import { endpoints } from "@/utils/endpoints";

/* -------------------- types (เพิ่มจากหน้า Payment) -------------------- */
type RoomOption = {
  id: string;
  roomId: string;
  hotelId: string;
  name: string;
  bed: string;
  maxGuest: number;
  price: string;
};

type HotelRoom = {
  id: string;
  options: RoomOption[];
  hotelId: string;
  description: string;
  image: string;
  facilities: string[];
  name: string;
  pictures: string[];
  sizeSqm: number;
};

type HotelData = {
  id: string;
  rooms: HotelRoom[];
  name: string;
  description: string;
  rating: string;
  image: string;
  breakfast: string;
  checkIn: string;
  checkOut: string;
  locationSummary: string;
  petAllow: boolean;
  pictures: string[];
  star: number;
  subtopicRatings: {
    value: number;
    [key: string]: number;
  };
  type: string;
  service: {
    serviceImg: string;
    [key: string]: any;
  };
  status: "pending" | "successed" | "cancelled";
};

type ServiceData = {
  id: string;
  name: string;
  serviceImg: string;
  type: string;
  // (เพิ่ม field อื่นๆ ถ้ามี)
};

type BookingData = {
  id: string;
  serviceId: string;
  subServiceId: string;
  optionId: string;
  groupId: string;
  startBookingDate: string;
  endBookingDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  status: string; // <-- ข้อมูล status ที่เราต้องการ
  price: string;
  service: ServiceData;
};

/* -------------------- types (ของเดิม) -------------------- */
type PriceRow = {
  label: string;
  amount: number;
  discount?: boolean;
  strong?: boolean;
};
type SpecialItem = { label: string; value: string };

/* -------------------- helpers -------------------- */
const formatTHB = (n: number) =>
  new Intl.NumberFormat("en-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* -------------------- component -------------------- */
export default function CompleteBookingHotelPage() {
  const params = useSearchParams();

  // ---- query values passed from previous pages ----
  const bookingIdQ = params.get("bookingId") ?? "";
  const paymentIdQ = params.get("paymentId") ?? "";
  // (query 'roomTypeQ' และ 'bedSizeQ' จะถูกแทนที่ด้วยข้อมูล fetch)
  const totalQ = params.get("total"); // (fallback)

  // ---- ui state ----
  const [loading, setLoading] = useState<boolean>(!!bookingIdQ);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- (เปลี่ยน) States สำหรับเก็บข้อมูลที่ Fetch มา ---
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [roomData, setRoomData] = useState<HotelRoom | null>(null);
  const [selectedOption, setSelectedOption] = useState<RoomOption | null>(null);

  // ---- fallback display data ----
  const fallbackTotal = useMemo<number>(() => {
    const n = totalQ ? Number(totalQ) : NaN;
    return Number.isFinite(n) ? n : 5192.92;
  }, [totalQ]);

  // ---- (เปลี่ยน) fetch booking detail (3-step logic) ----
  useEffect(() => {
    if (!bookingIdQ) {
      setLoading(false);
      setErrorMsg("Booking ID not found.");
      return;
    }

    const ac = new AbortController();
    const signal = ac.signal;

    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // --- 1. Get Booking Details ---
        const bookingRes = await axios.get(
          endpoints.searchbook(bookingIdQ),
          { signal }
        );
        const booking = bookingRes.data as BookingData;
        setBookingData(booking);

        if (!booking.subServiceId || !booking.serviceId) {
          throw new Error("Booking data is missing required IDs.");
        }

        // --- 2. Get Room (subServiceId) ---
        const roomRes = await axios.get(
          endpoints.searchroom(booking.subServiceId, booking.serviceId),
          { signal }
        );
        const room = roomRes.data as HotelRoom;
        setRoomData(room);

        // --- 3. Get Hotel (from booking.serviceId) ---
        const hotelRes = await axios.get(
          endpoints.hotel.detail(booking.serviceId),
          { signal }
        );
        const hotel = hotelRes.data as HotelData;
        setHotelData(hotel);

        // --- 4. Find Selected Option ---
        const option = room.options.find((o) => o.id === booking.optionId);
        setSelectedOption(option || null);
      } catch (e: unknown) {
        if (axios.isCancel(e)) return;
        const msg = e instanceof Error ? e.message : String(e);
        setErrorMsg(msg || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, [bookingIdQ]);

  // ---- (เปลี่ยน) derive values for UI (from fetched states or fallbacks) ----
  const STARS = Array.from({ length: hotelData?.star || 5 });

  // (Price breakdown ไม่มีใน 3-step fetch, เราจะใช้ fallback)
  const priceMain: PriceRow = {
    label: `${roomData?.name || "1 room"} (${
      bookingData?.startBookingDate ? "1 night" : ""
    })`,
    amount: 4412, // (Fallback)
  };
  const priceBefore: PriceRow[] = [
    { label: "price before discount", amount: 5786.74, discount: false },
    { label: "discount", amount: 1374.74, discount: true },
  ];
  const taxesAndFees: PriceRow[] = [
    { label: "VAT", amount: 4412.0 },
    { label: "Service charge", amount: 4412.0, strong: true },
  ];

  // (Total เรามีข้อมูลจริงจาก bookingData)
  const total: number = bookingData ? Number(bookingData.price) : fallbackTotal;

  const special: SpecialItem[] = [
    {
      label: "Room type",
      value: roomData?.name || "—",
    },
    {
      label: "Bed size",
      value: selectedOption?.bed || "—",
    },
  ];

  // (Guest name ไม่มีใน 3-step fetch, ใช้ fallback)
  const guestName = "Emily Chow";

  const hotelName =
    hotelData?.name ?? "Centara Grand Mirage Beach Resort Pattaya";

  const nights = bookingData ? 1 : 1; // (ควรคำนวณจาก start/end date)

  const checkInStr = bookingData
    ? formatDate(bookingData.startBookingDate)
    : "Sat, 25 Aug 2025";
  const checkInFrom = hotelData?.checkIn
    ? `from ${hotelData.checkIn}`
    : "from 15.00";

  const checkOutStr = bookingData
    ? formatDate(bookingData.endBookingDate)
    : "Sun, 26 Aug 2025";
  const checkOutBefore = hotelData?.checkOut
    ? `before ${hotelData.checkOut}`
    : "before 12.00";

  const viewBookingsHref =
    process.env.NEXT_PUBLIC_VIEW_BOOKINGS_PATH || "/bookhotel/bookinghistory";

  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={3} />

      <main className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-5">
        <h1 className="text-gray-900 text-xl md:text-2xl font-extrabold">
          Hotel Booking
        </h1>

        {/* status banners */}
        {!!paymentIdQ && (
          <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
            Payment confirmed. ID:{" "}
            <span className="font-semibold">{paymentIdQ}</span>
          </div>
        )}
        {errorMsg && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Big card */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
          {/* Title */}
          <div className="border-b border-gray-200 pb-2 space-y-1">
            <div className="text-gray-900 text-lg md:text-xl font-bold">
              Your booking is complete.
            </div>
            <div className="text-gray-500 text-sm md:text-base">
              Enjoy your stay!
            </div>
            {bookingIdQ && (
              <div className="text-xs text-gray-400">
                Booking ID: {bookingIdQ}
              </div>
            )}
          </div>

          {/* Top row: Hotel + Guest name + Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* Hotel card */}
            <div className="bg-white rounded-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <img
                  src={
                    hotelData?.image ||
                    hotelData?.pictures[0] ||
                    "/placeholder.jpg"
                  }
                  alt={hotelName}
                  className="w-full sm:w-36 md:w-44 h-36 sm:h-36 md:h-44 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-gray-900 font-semibold text-sm md:text-base">
                    {hotelName}
                  </div>

                  <div className="w-14 h-3 flex">
                    {STARS.map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 flex items-center px-[1px]"
                      >
                      <AiFillStar className="text-yellow-400"/>
                      </div>
                    ))}
                  </div>

                  {hotelData?.rating && (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                        {hotelData.rating}
                      </span>
                      <span className="text-sky-700 text-xs">Excellent</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <span>{hotelData?.locationSummary ?? "location"}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                    {hotelData?.type ?? "type"}
                  </span>
                </div>
              </div>

              {/* Small booking box */}
              <div className="mt-3 rounded-xl bg-gray-50 p-2 md:p-3 relative">
                <div className="flex gap-2">
                  <img
                    src={
                      roomData?.image || roomData?.pictures[0] || "/placeholder.jpg"
                    }
                    alt={roomData?.name || "Room"}
                    className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-900 text-xs sm:text-sm font-medium">
                      {roomData?.name ??
                        "Mirage Premium Explorer King View,sea"}
                    </div>
                    <div className="pt-1.5 space-y-1 text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <span>
                          {roomData?.sizeSqm
                            ? `${roomData.sizeSqm} m²`
                            : "42.0 m²"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{selectedOption?.bed ?? "1 king bed"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{selectedOption?.maxGuest ?? 5} guests</span>
                      </div>
                    </div>
                  </div>
                </div>

                {hotelData?.breakfast && (
                  <div className="mt-2 w-40 flex items-center gap-1 text-xs text-green-600">
                    <div className="w-4 h-3 bg-green-500" />
                    <span>{hotelData.breakfast}</span>
                  </div>
                )}

                <div className="absolute right-2 bottom-2 text-xs text-gray-700">
                  x 1
                </div>
              </div>
            </div>

            {/* Guest name + Status */}
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-gray-900 font-semibold mb-2 text-sm md:text-base">
                  Guest Name
                </div>
                <div className="h-10 px-3 flex items-center rounded-md border border-gray-200 text-sm md:text-base">
                  {guestName}
                </div>
              </div>
              
              {/* --- (เพิ่ม) แสดง Status --- */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-gray-900 font-semibold mb-2 text-sm md:text-base">
                  Booking Status
                </div>
                <div className="h-10 px-3 flex items-center rounded-md border border-gray-200 text-sm md:text-base">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <span className="font-medium capitalize text-blue-700">
                      {bookingData?.status || "Unknown"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Check-in / Check-out */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="self-center w-full lg:w-auto rounded-xl border border-gray-200 p-3 md:p-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <div>
                  <div className="text-xs text-gray-500">Check-in</div>
                  <div className="text-xs sm:text-sm text-gray-900">
                    {checkInStr}
                  </div>
                  <div className="text-xs text-gray-500">{checkInFrom}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs sm:text-sm text-gray-900">
                    {nights} night{nights > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Check-out</div>
                  <div className="text-xs sm:text-sm text-gray-900">
                    {checkOutStr}
                  </div>
                  <div className="text-xs text-gray-500">{checkOutBefore}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Price details */}
          <div className="rounded-xl border border-gray-200 p-4 md:p-5 space-y-3">
            <div className="text-gray-900 text-lg md:text-xl font-bold">
              Price Details
            </div>

            <div className="h-px bg-gray-200" />

            {/* (ใช้ Total จริง) */}
            <div className="flex items-center justify-between">
              <div className="text-gray-900 text-base font-bold">Total</div>
              <div className="flex items-start gap-0.5">
                <span className="text-gray-500 text-base">฿</span>
                <span className="text-gray-900 text-base font-bold">
                  {formatTHB(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Request summary */}
          <div className="rounded-xl border border-gray-200 p-4 md:p-5 space-y-2">
            <div className="text-gray-900 font-bold text-sm md:text-base">
              Special Request
            </div>
            <div className="space-y-2">
              {special.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                >
                  <div className="text-sm text-gray-900 font-medium sm:w-24">
                    {s.label}
                  </div>
                  <div className="text-sm text-gray-500">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <Link
            href="http://localhost:3000/"
            className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <span className="text-sm sm:text-base font-bold text-gray-50">
              Back
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}