"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';
import Link from "next/link";

/* =========================
 * Types
 * ========================= */
type Currency = "THB";

type BookingSummaryDTO = {
  id: string;
  title: string;
  rating: number;
  ratingText: string;
  location: string;
  tag?: string;
  days: number;
  pickup: { date: string; timeLabel: string };
  dropoff: { date: string; timeLabel: string };
  price: {
    beforeDiscount: number;
    discounted: number;
    discount: number;
    currency: Currency;
  };
  guestName?: string;
  note?: string;
};

type BookingSummaryResp =
  | { success: true; data: BookingSummaryDTO }
  | { success: false; message?: string };

type PaymentStatusResp =
  | { success: true; status: "processing" | "succeeded" | "failed" | "requires_action" }
  | { success: false; message?: string };

/* =========================
 * Utils
 * ========================= */
const THB = (n: number) =>
  new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

/* =========================
 * Page
 * ========================= */
export default function RentalCarBookingCompletePage() {
  const sp = useSearchParams();
  const router = useRouter();

  const bookingId = sp.get("bookingId") ?? "";
  const paymentId = sp.get("paymentId") ?? "";

  const [summary, setSummary] = useState<BookingSummaryDTO | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [payStatus, setPayStatus] = useState<PaymentStatusResp | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fallback เมื่อ API ยังไม่มา
  const fallbackSummary: BookingSummaryDTO = useMemo(
    () => ({
      id: bookingId || "unknown",
      title: "name",
      rating: 10.0,
      ratingText: "Excellent",
      location: "location",
      tag: "tag",
      days: 2,
      pickup: { date: "Sat, 25 Aug 2025", timeLabel: "from 09.00" },
      dropoff: { date: "Mon, 27 Aug 2025", timeLabel: "before 20.00" },
      price: { beforeDiscount: 20000, discounted: 18000, discount: 2000, currency: "THB" },
      guestName: "Emily Chow",
      note: "Private table please",
    }),
    [bookingId]
  );

  const s = summary ?? fallbackSummary;

  /* =========================
   * FETCH: Booking summary
   * ========================= */
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!bookingId) return;
      setLoadingSummary(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/rental/booking/${encodeURIComponent(bookingId)}`, { method: "GET" });
        if (!res.ok) throw new Error(`Fetch booking failed: ${res.status}`);
        const json = (await res.json()) as BookingSummaryResp;
        if (!json.success) throw new Error(json.message || "Cannot load booking summary.");
        if (!ignore) setSummary(json.data);
      } catch (e) {
        if (!ignore) setInfoMsg(e instanceof Error ? e.message : String(e));
      } finally {
        if (!ignore) setLoadingSummary(false);
      }
    };
    void run();
    return () => {
      ignore = true;
    };
  }, [bookingId]);

  /* =========================
   * FETCH: Payment status
   * ========================= */
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!paymentId) return;
      setLoadingStatus(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/payments/${encodeURIComponent(paymentId)}/status`, { method: "GET" });
        if (!res.ok) throw new Error(`Fetch payment status failed: ${res.status}`);
        const json = (await res.json()) as PaymentStatusResp;
        if (!ignore) setPayStatus(json);
      } catch (e) {
        if (!ignore) setInfoMsg(e instanceof Error ? e.message : String(e));
      } finally {
        if (!ignore) setLoadingStatus(false);
      }
    };
    void run();
    return () => {
      ignore = true;
    };
  }, [paymentId]);

  /* =========================
   * Handlers
   * ========================= */
  const handleGoToMyBookings = () => {
    router.push("/mybookings"); // ปรับ path ให้ตรงโปรเจกต์จริง
  };

  /* =========================
   * Render
   * ========================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={3}/>

      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 xl:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Rental Car Booking</h1>
            {bookingId && (
              <div className="text-xs text-gray-500">
                Booking ID: <span className="font-medium text-gray-700">{bookingId}</span>
              </div>
            )}
            {paymentId && (
              <div className="text-xs text-gray-500">
                Payment ID: <span className="font-medium text-gray-700">{paymentId}</span>
              </div>
            )}
          </div>

          {/* Banners */}
          {errorMsg && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          {infoMsg && (
            <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {infoMsg}
            </div>
          )}
          {loadingStatus && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Checking payment status…
            </div>
          )}
          {payStatus?.success && (
            <div
              className={`mt-3 rounded-md px-3 py-2 text-sm ${
                payStatus.status === "succeeded"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : payStatus.status === "failed"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              Payment status: <span className="font-semibold">{payStatus.status}</span>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2.5">
            {/* กล่องหลัก */}
            <section className="w-full bg-white rounded-[10px] p-6 space-y-4">
              {/* Title */}
              <div className="pb-2.5 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-slate-900">
                  {payStatus?.success && payStatus.status === "succeeded"
                    ? "Your booking is complete."
                    : "We have received your booking."}
                </h2>
                {!paymentId && (
                  <p className="mt-1 text-sm text-gray-500">
                    (No payment id provided — showing booking details only)
                  </p>
                )}
              </div>

              {/* แถวบน: การ์ด + ข้อมูลแขก/ช่วงเวลา */}
              <div className="flex flex-col lg:flex-row gap-2.5">
                {/* การ์ดรถ/แพ็กเกจ */}
                <div className="flex-1 min-w-[280px] bg-white rounded-[10px] p-2.5 flex gap-2.5">
                  <div
                    className="w-44 h-44 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30"
                    aria-hidden
                  />
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-lg font-semibold text-slate-900">
                      {loadingSummary ? <span className="animate-pulse">Loading…</span> : s.title}
                    </div>

                    <div className="flex gap-1 w-14" aria-hidden>
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">
                        {s.rating.toFixed(1)}
                      </span>
                      <span className="text-blue-700 text-xs">{s.ratingText}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-3 bg-slate-900" aria-hidden />
                      <span className="text-xs text-slate-900">{s.location}</span>
                    </div>

                    {s.tag && (
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">
                          {s.tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* กล่องข้อมูลแขก / เวลา */}
                <div className="flex-1 min-w-[280px] flex flex-col gap-2.5">
                  <div className="w-full rounded-[10px] border border-neutral-200 p-5 space-y-2">
                    <div className="text-xl font-bold text-slate-900">Guest Name</div>
                    <div className="w-full h-9 bg-gray-50 rounded-[10px] px-3 flex items-center text-slate-900">
                      {s.guestName || "—"}
                    </div>
                  </div>

                  <div className="w-full rounded-[10px] border border-neutral-200 p-5">
                    <div className="flex items-center">
                      <div className="px-1 flex-1">
                        <div className="text-xs text-gray-500">Pick-up</div>
                        <div className="text-base font-medium text-slate-900">{s.pickup.date}</div>
                        <div className="text-sm text-gray-600">{s.pickup.timeLabel}</div>
                      </div>

                      <div className="w-16 flex flex-col items-center">
                        <div className="text-sm font-medium text-slate-900">{s.days} days</div>
                        <div className="w-4 h-4 bg-slate-900 mt-1" aria-hidden />
                      </div>

                      <div className="px-1 flex-1">
                        <div className="text-xs text-gray-500">Drop-off</div>
                        <div className="text-base font-medium text-slate-900">{s.dropoff.date}</div>
                        <div className="text-sm text-gray-600">{s.dropoff.timeLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* แถวกลาง: ราคา */}
              <div className="w-full rounded-[10px] border border-neutral-200 p-5 space-y-3.5">
                <div>
                  <div className="text-xl font-bold text-slate-900">Price Details</div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">
                      Rental Car ({s.days} {s.days > 1 ? "days" : "day"})
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">{THB(s.price.discounted)}</span>
                    </div>
                  </div>

                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">price before discount</div>
                    <div className="flex items-baseline gap-0.5 text-gray-500">
                      <span className="text-xs">฿</span>
                      <span className="text-xs">{THB(s.price.beforeDiscount)}</span>
                    </div>
                  </div>

                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">discount</div>
                    <div className="flex items-baseline gap-0.5 text-red-600">
                      <span className="text-xs">-</span>
                      <span className="text-xs">฿</span>
                      <span className="text-xs">{THB(s.price.discount)}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">Total</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base text-gray-500">฿</span>
                    <span className="text-base font-bold text-slate-900">{THB(s.price.discounted)}</span>
                  </div>
                </div>
              </div>

              {/* แถวล่าง: Note */}
              <div className="w-full">
                <div className="w-full h-32 flex">
                  <div className="flex-1 bg-white rounded-[10px] border border-neutral-200 p-6 space-y-2.5">
                    <div className="text-base font-medium text-slate-900">Note</div>
                    <div className="w-full min-h-10 bg-gray-50 rounded-[10px] px-3 py-2 text-sm text-slate-900">
                      {s.note || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="w-full bg-white rounded-[10px] p-6">
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> */}
                <button
                  type="button"
                  onClick={handleGoToMyBookings}
                  className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-sm md:text-base font-bold shadow transition-all duration-300 hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  View your bookings
                </button>

                {/* <Link
                  href={`/bookrentalcar/payment?bookingId=${encodeURIComponent(bookingId)}&total=${encodeURIComponent(
                    s.price.discounted
                  )}`}
                  className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-slate-900 text-white text-sm md:text-base font-bold shadow transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  Pay again / Change method
                </Link> */}
              {/* </div> */}

              {/* {!paymentId && (
                <p className="mt-2 text-xs text-gray-500">
                  Tip: add <code>?bookingId=xxx&paymentId=yyy</code> to the URL after finishing the payment step to see
                  a verified status here.
                </p>
              )} */}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
