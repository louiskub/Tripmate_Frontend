"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';

// ---------- Types ----------
type GuideBookingDTO = {
  id: string;
  paymentId?: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "PAID";
  method?: "card" | "qr";
  customer: {
    firstName: string;
    lastName: string;
  };
  schedule: {
    fromISO: string; // 2025-08-25T09:00:00.000Z
    toISO: string;   // 2025-08-25T13:00:00.000Z
    hours: number;   // 4
    guests: number;  // 2
  };
  guide: {
    fullName: string;
    location?: string;
    tag?: string;
    rating?: number; // 0-10
    avatarUrl?: string;
  };
  price: {
    before: number;
    discount: number;
    total: number;
    currency: "THB";
  };
  note?: string;
};

type ApiResp<T> = { success: boolean; data?: T; message?: string };

// ---------- Utils ----------
const formatTHB = (n: number) =>
  new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : "-";

const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

// ---------- Component ----------
export default function GuideBookingCompletePage() {
  const router = useRouter();
  const params = useSearchParams();

  // ---- read query ----
  const bookingId = params.get("bookingId") ?? "";
  const paymentId = params.get("paymentId") ?? undefined;
  const method = (params.get("method") as "card" | "qr" | null) ?? undefined;

  // ถ้า query ไม่มี total หรือเป็น NaN จะใช้จาก API แทน
  const totalFromQuery = params.get("total");
  const totalQueryNumber = useMemo(() => {
    if (!totalFromQuery) return undefined;
    const n = Number(totalFromQuery);
    return Number.isFinite(n) ? n : undefined;
  }, [totalFromQuery]);

  // ---- state ----
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [booking, setBooking] = useState<GuideBookingDTO | null>(null);

  // ---- fetch booking ----
  useEffect(() => {
    let ignore = false;

    const run = async () => {
      if (!bookingId) {
        setErr("Missing bookingId.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/guide/booking/${encodeURIComponent(bookingId)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // ถ้าใช้คุกกี้
        });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Request failed: ${res.status}`);
        }
        const json = (await res.json()) as ApiResp<GuideBookingDTO>;
        if (!json.success || !json.data) {
          throw new Error(json.message || "Booking not found.");
        }
        if (!ignore) setBooking(json.data);
      } catch (e: unknown) {
        if (!ignore) setErr(e instanceof Error ? e.message : String(e));
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void run();

    return () => {
      ignore = true;
    };
  }, [bookingId]);

  // ---- derive display ----
  const guestName =
    booking?.customer ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim() : "-";
  const hours = booking?.schedule?.hours ?? 0;
  const guests = booking?.schedule?.guests ?? 0;
  const fromISO = booking?.schedule?.fromISO;
  const toISO = booking?.schedule?.toISO;

  const priceTotal =
    totalQueryNumber ?? booking?.price?.total ?? 0;
  const priceBefore = booking?.price?.before ?? undefined;
  const priceDiscount = booking?.price?.discount ?? undefined;

  const guideName = booking?.guide?.fullName ?? "name";
  const guideLocation = booking?.guide?.location ?? "location";
  const guideTag = booking?.guide?.tag ?? "tag";
  const guideRating = booking?.guide?.rating ?? 10;
  const guideAvatar = booking?.guide?.avatarUrl;

  const finalPaymentId = booking?.paymentId ?? paymentId;
  const finalMethod = booking?.method ?? method;

  // ---- UI blocks ----
  const LeftGuideCard = (
    <div className="flex-1 p-2.5 bg-white rounded-[10px] border border-gray-300 flex flex-col sm:flex-row gap-2.5 overflow-hidden">
      {/* Guide Image */}
      <div className="w-full sm:w-56 h-56 rounded-[10px] flex-shrink-0 bg-gradient-to-b from-zinc-800/0 to-black/30 overflow-hidden">
        {guideAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={guideAvatar} alt={guideName} className="w-full h-full object-cover rounded-[10px]" />
        ) : null}
      </div>

      {/* Guide Details */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-[3px]">
          <div className="w-3 h-3 bg-gray-400" />
          <span className="text-gray-600 text-xs">full name</span>
        </div>

        <h3 className="text-slate-900 text-lg font-semibold">{guideName}</h3>

        <div className="flex flex-wrap items-center gap-1">
          <span className="px-2 py-0.5 bg-blue-50 rounded-[20px] text-blue-700 text-xs font-medium">
            {guideTag}
          </span>
          <div className="flex items-center gap-[3px]">
            <div className="w-3 h-3 bg-slate-900" />
            <span className="text-slate-900 text-xs">{hours || 4} hours</span>
          </div>
        </div>

        <div className="flex items-center gap-[3px]">
          <span className="px-2 py-0.5 bg-blue-50 rounded-[20px] text-blue-700 text-xs font-medium">
            {guideRating.toFixed(1)}
          </span>
          <span className="text-blue-700 text-xs">Excellent</span>
        </div>

        <div className="flex items-center gap-[3px]">
          <div className="w-2.5 h-3 bg-slate-900" />
          <span className="text-slate-900 text-xs">{guideLocation}</span>
        </div>
      </div>
    </div>
  );

  const RightGuestAndSchedule = (
    <div className="flex-1 xl:max-w-[400px] flex flex-col gap-2.5">
      {/* Guest Name */}
      <div className="px-5 py-2.5 rounded-[10px] border border-gray-200 flex flex-col gap-1">
        <label className="text-slate-900 text-lg sm:text-xl font-bold">Guest Name</label>
        <div className="h-9 px-2.5 bg-white rounded-[10px] flex items-center">
          <span className="text-slate-900 text-base font-medium">{guestName}</span>
        </div>
      </div>

      {/* From/To Section */}
      <div className="p-2.5 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-1.5">
          {/* From */}
          <div className="flex-1 flex flex-col gap-2.5">
            <span className="text-gray-600 text-xs">From</span>
            <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
              <span className="text-slate-900 text-sm font-medium">{fmtDate(fromISO)}</span>
              <div className="w-4 h-4 bg-slate-900" />
            </div>
            <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
              <span className="text-gray-600 text-sm font-medium">{fmtTime(fromISO)}</span>
              <div className="w-4 h-4 bg-slate-900" />
            </div>
          </div>

          {/* Duration */}
          <div className="flex sm:flex-col justify-center items-center gap-2">
            <span className="text-slate-900 text-sm font-medium text-center">
              {hours || 4}
              <br className="hidden sm:block" />
              hours
            </span>
            <div className="w-4 h-4 bg-slate-900" />
          </div>

          {/* To */}
          <div className="flex-1 flex flex-col gap-2.5">
            <span className="text-gray-600 text-xs">To</span>
            <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
              <span className="text-slate-900 text-sm font-medium">{fmtDate(toISO)}</span>
              <div className="w-4 h-4 bg-slate-900" />
            </div>
            <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
              <span className="text-gray-600 text-sm font-medium">{fmtTime(toISO)}</span>
              <div className="w-4 h-4 bg-slate-900" />
            </div>
          </div>
        </div>

        {/* Guest Count */}
        <div className="flex items-center gap-2.5">
          <span className="text-slate-900 text-sm font-medium">Guest *</span>
          <div className="flex-1 h-7 px-2.5 py-1 rounded-[10px] border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 bg-slate-900" />
              <span className="text-slate-900 text-sm font-semibold">{guests || 1}</span>
            </div>
            <div className="w-2.5 h-1.5 bg-slate-900" />
          </div>
        </div>
      </div>
    </div>
  );

  const PriceDetails = (
    <div className="px-5 py-2.5 rounded-[10px] border border-gray-200 flex flex-col gap-3.5">
      <h3 className="text-slate-900 text-lg sm:text-xl font-bold">Price Details</h3>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-start">
          <span className="text-slate-900 text-sm font-medium">
            Guide ({hours || 4} hours)
          </span>
          <div className="flex items-start gap-0.5">
            <span className="text-gray-600 text-sm">฿</span>
            <span className="text-slate-900 text-sm font-medium">{formatTHB(priceTotal)}</span>
          </div>
        </div>

        {typeof priceBefore === "number" && (
          <div className="pl-5 flex justify-between items-start">
            <span className="text-gray-600 text-xs">price before discount</span>
            <div className="flex items-start gap-px">
              <span className="text-gray-600 text-xs">฿</span>
              <span className="text-gray-600 text-xs">{formatTHB(priceBefore)}</span>
            </div>
          </div>
        )}

        {typeof priceDiscount === "number" && priceDiscount > 0 && (
          <div className="pl-5 flex justify-between items-start">
            <span className="text-gray-600 text-xs">discount</span>
            <div className="flex items-start gap-px">
              <span className="text-red-500 text-xs">-</span>
              <span className="text-red-500 text-xs">฿</span>
              <span className="text-red-500 text-xs">{formatTHB(priceDiscount)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      <div className="flex justify-between items-center">
        <span className="text-slate-900 text-base font-bold">Total</span>
        <div className="flex items-start gap-0.5">
          <span className="text-gray-600 text-base">฿</span>
          <span className="text-slate-900 text-base font-bold">{formatTHB(priceTotal)}</span>
        </div>
      </div>
    </div>
  );

  const NoteBlock = (
    <div className="min-h-32 px-6 py-4 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-2.5">
      <h3 className="text-slate-900 text-base font-medium">Note</h3>
      <div className="p-2.5 bg-gray-50 rounded-[10px] flex-1">
        <p className="text-slate-900 text-sm font-medium">{booking?.note || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={3}/>

      <main className="px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5">
        {/* Header */}
        <div className="flex flex-col justify-center items-start gap-0.5 mb-5">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-extrabold">Guide Booking</h1>
          <p className="text-gray-600 text-base sm:text-lg font-semibold">Make sure bla bla</p>
          {bookingId ? (
            <div className="mt-1 text-xs text-gray-400 flex flex-wrap gap-3">
              <span>Booking ID: {bookingId}</span>
              {finalPaymentId && <span>Payment ID: {finalPaymentId}</span>}
              {finalMethod && <span>Method: {finalMethod.toUpperCase()}</span>}
            </div>
          ) : null}
        </div>

        {/* Error */}
        {err && (
          <div className="max-w-[1240px] mx-auto mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-[1240px] mx-auto">
          <div className="pb-2.5 flex flex-col gap-5">
            {/* Booking Complete Card */}
            <div className="px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-2.5">
              {/* Title */}
              <div className="pb-2.5 border-b border-gray-200 flex flex-col gap-2">
                <h2 className="text-slate-900 text-lg sm:text-xl font-bold">
                  {loading ? "Finalizing your booking..." : "Your booking is complete."}
                </h2>
                {!loading && booking?.status && (
                  <div className="text-xs text-gray-500">
                    Status: <span className="font-medium">{booking.status}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2.5">
                {/* Guide Card + Guest Info */}
                <div className="flex flex-col xl:flex-row gap-2.5">
                  {LeftGuideCard}
                  {RightGuestAndSchedule}
                </div>

                {/* Price Details */}
                {PriceDetails}

                {/* Note */}
                {NoteBlock}
              </div>
            </div>

            {/* View Bookings Button */}
            <div className="px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col">
              <Link
                href="/my/bookings?tab=guide"
                className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <span className="text-sm sm:text-base font-bold text-gray-50">View your bookings</span>
              </Link>

              {/* ปุ่มย้อนกลับไปจ่ายเงิน (เผื่อกรณีชำระทีหลัง) */}
              {/* <button
                onClick={() => router.push(`/bookguide/payment?bookingId=${encodeURIComponent(bookingId)}&total=${priceTotal}`)}
                className="mt-2 inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] border text-slate-700 text-sm md:text-base font-bold shadow-sm hover:bg-gray-50"
              >
                Back to payment
              </button> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
