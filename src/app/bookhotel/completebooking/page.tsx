"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';

/* -------------------- types -------------------- */
type PriceRow = { label: string; amount: number; discount?: boolean; strong?: boolean };
type SpecialItem = { label: string; value: string };

type BookingSummary = {
  bookingId: string;
  guest: { firstName: string; lastName: string };
  hotel: { name: string; rating: number; location?: string; type?: string };
  room: { name: string; sizeSqm?: number; bed?: string; qty?: number };
  checkIn: { dateISO: string; from?: string };
  checkOut: { dateISO: string; before?: string };
  nights: number;
  price: {
    main: PriceRow; // e.g. { label: "1 room (1 night)", amount: 4412 }
    before: PriceRow[]; // price before discount, discount
    taxes: PriceRow[]; // vat, service charge
    total: number;
  };
  special?: { roomType?: string; bedSize?: string };
};

type BookingApiResponse = {
  success: boolean;
  data: BookingSummary;
  message?: string;
};

/* -------------------- helpers -------------------- */
const formatTHB = (n: number) =>
  new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

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
  const roomTypeQ = params.get("roomType") ?? "";
  const bedSizeQ = params.get("bedSize") ?? "";
  const totalQ = params.get("total");

  // ---- ui state ----
  const [loading, setLoading] = useState<boolean>(!!bookingIdQ);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState<BookingSummary | null>(null);

  // ---- fallback display data when API is not provided ----
  const fallbackTotal = useMemo<number>(() => {
    const n = totalQ ? Number(totalQ) : NaN;
    return Number.isFinite(n) ? n : 5192.92;
  }, [totalQ]);

  // ---- fetch booking detail if bookingId is present ----
  useEffect(() => {
    if (!bookingIdQ) return; // no fetch if we didn't get id

    const ac = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // Example endpoint: GET /booking/:id (proxied via next rewrites to Nest)
        const res = await fetch(`/api/booking/${encodeURIComponent(bookingIdQ)}`, {
          method: "GET",
          cache: "no-store",
          signal: ac.signal,
          // credentials: "include", // uncomment if backend uses cookies
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Request failed: ${res.status}`);
        }

        const json = (await res.json()) as BookingApiResponse;
        if (!json.success) throw new Error(json.message || "Failed to get booking.");

        setSummary(json.data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setErrorMsg(msg || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, [bookingIdQ]);

  // ---- derive values for UI (from API or fallback constants) ----
  const STARS = Array.from({ length: 5 });

  const priceMain: PriceRow =
    summary?.price.main ?? { label: "1 room (1 night)", amount: 4412 };

  const priceBefore: PriceRow[] =
    summary?.price.before ?? [
      { label: "price before discount", amount: 5786.74, discount: false },
      { label: "discount", amount: 1374.74, discount: true },
    ];

  const taxesAndFees: PriceRow[] =
    summary?.price.taxes ?? [
      { label: "VAT", amount: 4412.0 },
      { label: "Service charge", amount: 4412.0, strong: true },
    ];

  const total: number = summary?.price.total ?? fallbackTotal;

  const special: SpecialItem[] = [
    {
      label: "Room type",
      value: summary?.special?.roomType || roomTypeQ || "—",
    },
    {
      label: "Bed size",
      value: summary?.special?.bedSize || bedSizeQ || "—",
    },
  ];

  const guestName =
    summary ? `${summary.guest.firstName} ${summary.guest.lastName}` : "Emily Chow";

  const hotelName =
    summary?.hotel.name ?? "Centara Grand Mirage Beach Resort Pattaya";

  const nights = summary?.nights ?? 1;

  const checkInStr = summary
    ? formatDate(summary.checkIn.dateISO)
    : "Sat, 25 Aug 2025";
  const checkInFrom = summary?.checkIn.from ?? "from 15.00";

  const checkOutStr = summary
    ? formatDate(summary.checkOut.dateISO)
    : "Sun, 26 Aug 2025";
  const checkOutBefore = summary?.checkOut.before ?? "before 12.00";

  const viewBookingsHref =
    process.env.NEXT_PUBLIC_VIEW_BOOKINGS_PATH || "/bookhotel/bookinghistory";

  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={3}/>

      <main className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-5">
        <h1 className="text-gray-900 text-xl md:text-2xl font-extrabold">Hotel Booking</h1>

        {/* status banners */}
        {!!paymentIdQ && (
          <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
            Payment confirmed. ID: <span className="font-semibold">{paymentIdQ}</span>
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
            <div className="text-gray-900 text-lg md:text-xl font-bold">Your booking is complete.</div>
            <div className="text-gray-500 text-sm md:text-base">Enjoy your stay!</div>
            {bookingIdQ && (
              <div className="text-xs text-gray-400">Booking ID: {bookingIdQ}</div>
            )}
          </div>

          {/* Top row: Hotel + Guest name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* Hotel card */}
            <div className="bg-white rounded-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-36 md:w-44 h-36 sm:h-36 md:h-44 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 flex-shrink-0" />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-gray-900 font-semibold text-sm md:text-base">
                    {hotelName}
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
                    <span>{summary?.hotel.location ?? "location"}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                    {summary?.hotel.type ?? "type"}
                  </span>
                </div>
              </div>

              {/* Small booking box */}
              <div className="mt-3 rounded-xl bg-gray-50 p-2 md:p-3 relative">
                <div className="flex gap-2">
                  <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 flex-shrink-0" />
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-900 text-xs sm:text-sm font-medium">
                      {summary?.room.name ?? "Mirage Premium Explorer King View,sea"}
                    </div>
                    <div className="pt-1.5 space-y-1 text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-900" />
                        <span>{summary?.room.sizeSqm ? `${summary.room.sizeSqm} m²` : "42.0 m²"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-900" />
                        <span>{summary?.room.bed ?? "1 king bed"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-900" />
                        <span>{summary?.room.qty ?? 5}</span>
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
                {loading ? "Loading..." : guestName}
              </div>
            </div>
          </div>

          {/* Check-in / Check-out */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="self-center w-full lg:w-auto rounded-xl border border-gray-200 p-3 md:p-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <div>
                  <div className="text-xs text-gray-500">Check-in</div>
                  <div className="text-xs sm:text-sm text-gray-900">{checkInStr}</div>
                  <div className="text-xs text-gray-500">{checkInFrom}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs sm:text-sm text-gray-900">{nights} night{nights > 1 ? "s" : ""}</div>
                  <div className="w-4 h-3 bg-gray-900" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Check-out</div>
                  <div className="text-xs sm:text-sm text-gray-900">{checkOutStr}</div>
                  <div className="text-xs text-gray-500">{checkOutBefore}</div>
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
                  <span className="text-gray-900 text-sm font-medium">{formatTHB(priceMain.amount)}</span>
                </div>
              </div>

              {priceBefore.map((row) => (
                <div key={row.label} className="pl-3 md:pl-5 flex items-start justify-between">
                  <div className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.label}</div>
                  <div className="flex items-start gap-0.5">
                    {row.discount && <span className="text-red-500 text-xs">-</span>}
                    <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>฿</span>
                    <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>
                      {formatTHB(row.amount)}
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
                  <span className="text-gray-900 text-sm font-medium">
                    {formatTHB(
                      taxesAndFees.reduce((acc, r) => acc + (r.amount || 0), 0)
                    )}
                  </span>
                </div>
              </div>

              {taxesAndFees.map((row) => (
                <div key={row.label} className="pl-3 md:pl-5 flex items-start justify-between">
                  <div className="text-gray-500 text-xs">{row.label}</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-xs">฿</span>
                    <span className={`text-xs ${row.strong ? "text-gray-900" : "text-gray-500"}`}>
                      {formatTHB(row.amount)}
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
                <span className="text-gray-900 text-base font-bold">{formatTHB(total)}</span>
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
          <Link
            href={viewBookingsHref}
            className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <span className="text-sm sm:text-base font-bold text-gray-50">View your bookings</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
