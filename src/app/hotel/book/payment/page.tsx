"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';

/* ---------- types ---------- */
type PaymentMethod = "card" | "qr";

type CreateIntentPayload =
  | {
      method: "card";
      bookingId: string;
      amount: number;
      card: {
        holder: string;
        number: string;
        exp: string; // MM/YY
        cvv: string;
      };
    }
  | {
      method: "qr";
      bookingId: string;
      amount: number;
    };

type CreateIntentResponse = {
  success: boolean;
  bookingId: string;
  paymentId: string;
  // ถ้าเป็น QR อาจจะมีลิงก์ภาพ QR:
  qrUrl?: string;
  message?: string;
};

/* ---------- mock price cards (UI only) ---------- */
const priceDetailsMain = [{ label: "1 room (1 night)", amount: "4,412.00" }];
const priceDetailsBefore = [
  { label: "price before discount", amount: "5,786.74", discount: false },
  { label: "discount", amount: "1,374.74", discount: true },
];
const taxesAndFees = [
  { label: "VAT", amount: "4,412.00" },
  { label: "Service charge", amount: "4,412.00", strong: true },
];

/* ================================================ */

export default function HotelPaymentPage() {
  const router = useRouter();
  const params = useSearchParams();

  // ------- read from previous page (query) -------
  const bookingId = params.get("bookingId") ?? "";
  const roomType = params.get("roomType") ?? "";
  const bedSize = params.get("bedSize") ?? "";
  // total amount (fallback เป็น mock)
  const total = useMemo<number>(() => {
    const q = params.get("total");
    const n = q ? Number(q) : NaN;
    return Number.isFinite(n) ? n : 5192.92;
  }, [params]);

  // ------- UI states -------
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [holder, setHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ---------- helpers ---------- */
  const formatTHB = (n: number) =>
    new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const validate = (): string | null => {
    if (!bookingId) return "Missing booking ID.";
    if (paymentMethod === "card") {
      if (!holder.trim()) return "Please enter card holder name.";
      if (!cardNumber.trim()) return "Please enter card number.";
      if (!/^\d{12,19}$/.test(cardNumber.replace(/\s+/g, "")))
        return "Card number must be 12-19 digits.";
      if (!/^\d{2}\/\d{2}$/.test(exp)) return "Expiration must be MM/YY.";
      if (!/^\d{3,4}$/.test(cvv)) return "CVV/CVC must be 3-4 digits.";
    }
    return null;
  };

  const buildPayload = (): CreateIntentPayload => {
    if (paymentMethod === "card") {
      return {
        method: "card",
        bookingId,
        amount: total,
        card: {
          holder: holder.trim(),
          number: cardNumber.replace(/\s+/g, ""),
          exp: exp.trim(),
          cvv: cvv.trim(),
        },
      };
    }
    return { method: "qr", bookingId, amount: total };
  };

  /* ---------- submit ---------- */
  const handleCompleteBooking = async () => {
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const payload = buildPayload();

      // NOTE: /api/payment/intent -> rewrite ไป NestJS เช่น POST http://localhost:8800/payment/intent
      const res = await fetch("/api/payment/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload satisfies CreateIntentPayload),
        // credentials: "include", // ถ้าใช้ cookie JWT
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as CreateIntentResponse;
      if (!data.success) throw new Error(data.message || "Payment failed.");

      // ถ้าเป็น QR แสดงรูป QR และให้ผู้ใช้สแกน (ยังไม่ redirect)
      if (paymentMethod === "qr" && data.qrUrl) {
        setQrUrl(data.qrUrl);
        // ในระบบจริง อาจตั้ง polling ไป /api/payment/status?paymentId=... เพื่อตรวจสอบจน success จากนั้นค่อย redirect
        // ที่นี่ ถ้าต้องการ redirect ทันทีหลังสร้าง intent ก็ย้าย logic ไปด้านล่าง
      }

      // redirect ไปหน้า complete พร้อมพารามิเตอร์
      const qs = new URLSearchParams({
        bookingId: data.bookingId || bookingId,
        paymentId: data.paymentId,
        roomType,
        bedSize,
        method: paymentMethod,
      }).toString();

      router.push(`/bookhotel/completebooking?${qs}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)


  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={2}/>

      <main className="px-4 md:px-6 lg:px-24 pt-7 pb-10">
        {/* Header */}
        <div className="flex flex-col gap-0.5 mb-3 md:mb-5">
          <div className="text-gray-900 text-2xl font-extrabold">Hotel Booking</div>
          <div className="text-gray-500 text-lg font-semibold">Make sure bla bla</div>
          {/* context from previous page */}
          {(roomType || bedSize) && (
            <div className="text-sm text-gray-500">
              {roomType && <span>Room type: <span className="font-medium text-slate-900">{roomType}</span></span>}
              {roomType && bedSize && <span className="px-2">•</span>}
              {bedSize && <span>Bed size: <span className="font-medium text-slate-900">{bedSize}</span></span>}
            </div>
          )}
          {bookingId && (
            <div className="text-xs text-gray-400">Booking ID: {bookingId}</div>
          )}
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="mx-auto max-w-[1240px] mb-3 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {errorMsg}
          </div>
        )}

        {/* 2 columns */}
        <div className="mx-auto max-w-[1240px] flex flex-col lg:flex-row items-start gap-2.5">
          {/* Left */}
          <div className="w-full lg:w-[830px] lg:shrink-0 flex flex-col gap-2.5">
            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4">
              <div className="w-full xl:max-w-[830px] px-4 sm:px-6 py-3 bg-white rounded-[10px] flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Confirm Payment</h2>
                </div>

                {/* Tabs */}
                <div className="rounded border border-gray-200 flex flex-col">
                  <div className="flex flex-col sm:flex-row">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-3.5 px-4 flex items-center gap-1.5 ${
                        paymentMethod === "card" ? "bg-blue-50" : "bg-white"
                      } border-b sm:border-b-0 sm:border-r border-gray-200`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "card" ? "border-blue-700" : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-blue-700" />}
                      </div>
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          paymentMethod === "card" ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        Credit/Debit Card
                      </span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("qr")}
                      className={`flex-1 py-3.5 px-4 flex items-center gap-1.5 ${
                        paymentMethod === "qr" ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "qr" ? "border-blue-700" : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "qr" && <div className="w-2 h-2 rounded-full bg-blue-700" />}
                      </div>
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          paymentMethod === "qr" ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        QR PromptPay
                      </span>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-4 sm:px-7 py-5 border-t border-gray-200">
                    {paymentMethod === "card" ? (
                      <div className="px-0 sm:px-2 flex flex-col items-end gap-5">
                        {/* holder */}
                        <div className="w-full">
                          <label className="block text-sm text-gray-600 mb-1">Card holder name *</label>
                          <input
                            value={holder}
                            onChange={(e) => setHolder(e.target.value)}
                            type="text"
                            placeholder="Emily Chow"
                            className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* number */}
                        <div className="w-full">
                          <label className="block text-sm text-gray-600 mb-1">Credit/debit card number *</label>
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            inputMode="numeric"
                            placeholder="1234567890123"
                            className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* exp / cvv */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Expiration date *</label>
                            <input
                              value={exp}
                              onChange={(e) => setExp(e.target.value)}
                              placeholder="01/28"
                              className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">CVV/CVC *</label>
                            <input
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              inputMode="numeric"
                              placeholder="123"
                              className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* charge text */}
                        <div className="w-full flex items-center gap-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-gray-500">฿</span>
                            <span className="text-sm font-medium text-slate-900">
                              {formatTHB(total)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            will be charged to the credit/debit card you provided.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center gap-4">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Pay with QR PromptPay</h3>
                        <div className="flex items-start gap-0.5">
                          <span className="py-1 text-gray-600 text-lg sm:text-xl">฿</span>
                          <span className="py-1 text-lg sm:text-xl font-bold text-slate-900">
                            {formatTHB(total)}
                          </span>
                        </div>
                        <img src="/images/qrcode.jpg" alt="QR Code" className="w-60 h-60 object-cover rounded-lg"/>
                        <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSuccessPopup(true)}
                          className="inline-flex h-10 items-center justify-center rounded-md bg-sky-600 px-4 text-white text-sm font-semibold shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          I have paid
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-900 text-center">
                        Your payment will be confirmed automatically after scanning. You can click &quot;I have paid&quot; when done.
                      </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Desktop CTA */}
            <div className="hidden xl:block w-full xl:max-w-[830px] px-4 sm:px-6 py-4 bg-white rounded-[10px]">
              <button
                type="button"
                onClick={handleCompleteBooking}
                disabled={submitting}
                className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Complete Booking"}
              </button>
            </div>
          </div>

          {/* Right */}
          <aside className="w-full lg:w-96 lg:shrink-0 flex flex-col gap-2.5">
            {/* Hotel card (UI) */}
            <div className="bg-white rounded-[10px]">
              <div className="min-h-48 p-2.5 rounded-[10px] flex flex-col sm:flex-row gap-2.5">
                <div className="w-full sm:w-44 h-44 rounded-[10px] bg-gradient-to-b from-gray-300 to-gray-400" />
                <div className="flex-1 flex">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-gray-900 text-lg font-semibold">
                      Centara Grand Mirage Beach Resort Pattaya
                    </div>
                    <div className="w-14 h-3 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
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
                    <div className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">type</div>
                  </div>
                </div>
              </div>

              {/* booking item */}
              <div className="px-2.5 pb-2.5">
                <div className="min-h-36 px-2 pt-2 pb-1 bg-gray-50 rounded-[10px] relative">
                  <div className="h-full flex flex-col sm:flex-row gap-1.5">
                    <div className="w-full sm:w-28 h-28 sm:h-auto rounded-[10px] bg-gradient-to-b from-gray-300 to-gray-400" />
                    <div className="flex flex-col justify-center">
                      <div className="text-gray-900 text-sm font-medium">Mirage Premium Explorer King View,sea</div>
                      <div className="pt-1.5 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <div className="w-3 h-3 bg-gray-900" />
                          <span>42.0 m²</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <div className="w-3 h-3 bg-gray-900" />
                          <span>1 king bed</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <div className="w-3 h-3 bg-gray-900" />
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 w-40 flex items-center gap-1 text-xs text-green-600">
                    <div className="w-4 h-3 bg-green-500" />
                    <span>Breakfast included</span>
                  </div>

                  <div className="absolute right-2 bottom-2 text-xs text-gray-700">x 1</div>
                </div>
              </div>
            </div>

            {/* Check-in/out */}
            <div className="bg-white rounded-[10px] p-2.5 flex items-center">
              <div className="px-1 flex flex-col gap-2.5">
                <div className="text-gray-500 text-xs">Check-in</div>
                <div className="text-gray-900 text-sm md:text-base font-medium">Sat, 25 Aug 2025</div>
                <div className="text-gray-500 text-sm font-medium">from 15.00</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="text-gray-900 text-sm font-medium">1 night</div>
                <div className="w-4 h-3.5 bg-gray-900" />
              </div>
              <div className="px-1 flex flex-col gap-2.5">
                <div className="text-gray-500 text-xs">Check-out</div>
                <div className="text-gray-900 text-sm md:text-base font-medium">Sun, 26 Aug 2025</div>
                <div className="text-gray-500 text-sm font-medium">before 12.00</div>
              </div>
            </div>

            {/* Price details */}
            <div className="bg-white rounded-[10px] px-4 md:px-5 py-2.5">
              <div className="text-gray-900 text-xl font-bold">Price Details</div>

              <div className="mt-3 flex flex-col gap-1.5">
                {priceDetailsMain.map((row) => (
                  <div key={row.label} className="flex items-start justify-between">
                    <div className="text-gray-900 text-sm font-medium">{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-500 text-sm">฿</span>
                      <span className="text-gray-900 text-sm font-medium">{row.amount}</span>
                    </div>
                  </div>
                ))}

                {priceDetailsBefore.map((row, i) => (
                  <div key={i} className="pl-5 flex items-start justify-between">
                    <div className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      {row.discount && <span className="text-red-500 text-xs">-</span>}
                      <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>฿</span>
                      <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 text-sm font-medium">Taxes & fees</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-sm">฿</span>
                    <span className="text-gray-900 text-sm font-medium">4,412.00</span>
                  </div>
                </div>

                {taxesAndFees.map((row) => (
                  <div key={row.label} className="pl-5 flex items-start justify-between">
                    <div className="text-gray-500 text-xs">{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-500 text-xs">฿</span>
                      <span className={`text-xs ${row.strong ? "text-gray-900" : "text-gray-500"}`}>{row.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-3 h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="text-gray-900 text-base font-bold">Total</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-base">฿</span>
                  <span className="text-gray-900 text-base font-bold">{formatTHB(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile CTA */}
        <div className="block xl:hidden w-auto xl:max-w-[830px] my-2.5 px-4 sm:px-6 py-4 bg-white rounded-[10px]">
          <button
            type="button"
            onClick={handleCompleteBooking}
            disabled={submitting}
            className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
          >
            {submitting ? "Processing..." : "Complete Booking"}
          </button>
        </div>

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Payment Success</h3>
              <p className="text-center text-gray-600 text-sm">Your payment has been processed successfully.</p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full h-10 bg-sky-600 text-white rounded-md font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
