"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Statenav from "@/components/navbar/statenav";

type PaymentMethod = "card" | "qr";

type CardForm = {
  holder: string;
  number: string;
  exp: string; // MM/YY
  cvv: string;
};

type CreatePaymentIntentBody =
  | {
      method: "card";
      bookingId: string;
      amount: number;
      currency: "THB";
      card: CardForm;
    }
  | {
      method: "qr";
      bookingId: string;
      amount: number;
      currency: "THB";
    };

type CreatePaymentIntentResp = {
  success: boolean;
  paymentId?: string;
  qrImageDataUrl?: string; // data:image/png;base64,... (ถ้า method=qr)
  message?: string;
};

const formatTHB = (n: number) =>
  new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function GuidePaymentPage() {
  const router = useRouter();
  const params = useSearchParams();

  // ---- query from previous page ----
  const bookingId = params.get("bookingId") ?? "";
  const totalParam = params.get("total");
  const total = useMemo<number>(() => {
    const n = totalParam ? Number(totalParam) : NaN;
    return Number.isFinite(n) ? n : 4000;
  }, [totalParam]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // ---- UI state ----
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ---- card states ----
  const [card, setCard] = useState<CardForm>({
    holder: "",
    number: "",
    exp: "",
    cvv: "",
  });

  // ---- QR state ----
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrReady, setQrReady] = useState(false);

  const validateCard = (): string | null => {
    if (!card.holder.trim()) return "Please enter card holder name.";
    if (!/^\d{12,19}$/.test(card.number.replace(/\s/g, ""))) return "Card number looks invalid.";
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) return "Expiration must be MM/YY.";
    if (!/^\d{3,4}$/.test(card.cvv)) return "CVV/CVC must be 3–4 digits.";
    return null;
  };

  const pay = async () => {
    try {
      setErrorMsg(null);
      setSubmitting(true);

      // simple guards
      if (!bookingId) throw new Error("Missing bookingId.");
      const body: CreatePaymentIntentBody =
        paymentMethod === "card"
          ? {
              method: "card",
              bookingId,
              amount: total,
              currency: "THB",
              card,
            }
          : {
              method: "qr",
              bookingId,
              amount: total,
              currency: "THB",
            };

      const res = await fetch("/api/guide/payment/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // credentials: "include", // ถ้าใช้คุกกี้
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Request failed: ${res.status}`);
      }

      const json = (await res.json()) as CreatePaymentIntentResp;
      if (!json.success || !json.paymentId) {
        throw new Error(json.message || "Failed to create payment.");
      }

      if (paymentMethod === "qr") {
        // แสดง QR ให้สแกน แล้วให้ผู้ใช้กด "I have paid" เพื่อไปหน้า complete
        if (!json.qrImageDataUrl) throw new Error("QR image missing from response.");
        setQrImage(json.qrImageDataUrl);
        setQrReady(true);
        return; // ยังไม่ redirect จนกว่าจะกดยืนยันว่าโอนแล้ว
      }

      // บัตร: ชำระสำเร็จ → ไปหน้า complete
      const qs = new URLSearchParams({
        bookingId,
        paymentId: json.paymentId,
        method: "card",
        total: String(total),
      }).toString();
      router.push(`/bookguide/completebooking?${qs}`);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmQrPaid = () => {
    // กรณีง่ายสุด: ผู้ใช้ยืนยันว่าโอนแล้ว → redirect พร้อมพารามิเตอร์
    const qs = new URLSearchParams({
      bookingId,
      paymentId: "qr_confirmed", // ถ้า backend ส่ง id กลับมา ให้ใช้ของจริง
      method: "qr",
      total: String(total),
    }).toString();
    router.push(`/bookguide/completebooking?${qs}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      <main className="px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5">
        {/* Header */}
        <div className="flex flex-col justify-center items-start gap-0.5 mb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Guide Booking</h1>
          <p className="text-base sm:text-lg font-semibold text-gray-600">Make sure bla bla</p>
          {bookingId && (
            <span className="mt-1 text-xs text-gray-400">Booking ID: {bookingId}</span>
          )}
        </div>

        {/* error banner */}
        {errorMsg && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="flex flex-col xl:flex-row gap-2.5 max-w-[1240px]">
          {/* Left Column */}
          <div className="flex-1 pb-2.5 flex flex-col gap-5">
            {/* Payment Section */}
            <div className="w-full xl:max-w-[830px] px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Confirm Payment</h2>
              </div>

              {/* Payment Method Selector */}
              <div className="rounded border border-gray-200 flex flex-col">
                <div className="flex flex-col sm:flex-row">
                  <button
                    type="button"
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
                    type="button"
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

                {/* Payment Content */}
                <div className="px-4 sm:px-7 py-5 border-t border-gray-200">
                  {paymentMethod === "card" ? (
                    <div className="px-7 flex flex-col items-end gap-5">
                      {/* Card holder name */}
                      <div className="w-full">
                        <label className="block text-sm text-gray-600 mb-1">Card holder name *</label>
                        <input
                          type="text"
                          placeholder="Emily Chow"
                          value={card.holder}
                          onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))}
                          className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Card number */}
                      <div className="w-full">
                        <label className="block text-sm text-gray-600 mb-1">Credit/debit card number *</label>
                        <input
                          type="text"
                          placeholder="1234567890123"
                          inputMode="numeric"
                          value={card.number}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, number: e.target.value.replace(/\s/g, "") }))
                          }
                          className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Exp / CVV */}
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Expiration date *</label>
                          <input
                            type="text"
                            placeholder="01/28"
                            value={card.exp}
                            onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))}
                            className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">CVV/CVC *</label>
                          <input
                            type="text"
                            placeholder="123"
                            inputMode="numeric"
                            value={card.cvv}
                            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                            className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Charge text */}
                      <div className="w-full flex items-center gap-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-gray-500">฿</span>
                          <span className="text-sm font-medium text-slate-900">{formatTHB(total)}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          will be charged to the credit/debit card you provided.
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => {
                          const v = validateCard();
                          if (v) {
                            setErrorMsg(v);
                            return;
                          }
                          void pay();
                        }}
                        className="mt-1 inline-flex h-10 items-center justify-center rounded-md bg-sky-600 px-4 text-white text-sm font-semibold shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                      >
                        {submitting ? "Processing..." : "Pay ฿" + formatTHB(total)}
                      </button>
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

                      {/* QR area */}
                      <div className="w-48 h-48 sm:w-60 sm:h-60 bg-gray-200 rounded-lg flex items-center justify-center">
                        {qrReady && qrImage ? (
                          <img
                            src={qrImage}
                            alt="QR Code"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">QR will appear here</span>
                        )}
                      </div>

                      {/* action buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => void pay()}
                          className="inline-flex h-10 items-center justify-center rounded-md bg-sky-600 px-4 text-white text-sm font-semibold shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                        >
                          {submitting ? "Generating..." : qrReady ? "Regenerate QR" : "Generate QR"}
                        </button>

                        <button
                          type="button"
                          disabled={!qrReady}
                          onClick={confirmQrPaid}
                          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-60"
                        >
                          I have paid
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-900 text-center">
                        Your payment will be confirmed automatically after scanning.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Complete Booking (Desktop) */}
            <div className="hidden xl:block w-full xl:max-w-[830px] px-4 sm:px-6 py-4 bg-white rounded-[10px]">
              <button
                type="button"
                onClick={() => {
                  // เผื่อยังอยากกดไปหน้า complete ตรง ๆ (ไม่แนะนำถ้าใช้ flow ชำระจริง)
                  router.push(`/bookguide/completebooking?bookingId=${encodeURIComponent(bookingId)}&total=${total}`);
                }}
                className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Complete Booking
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full xl:w-96 flex flex-col gap-2.5">
            {/* Guide Card */}
            <div className="p-2.5 bg-white rounded-[10px] border border-gray-300 flex flex-col sm:flex-row xl:flex-col gap-2.5">
              <div className="w-full sm:w-44 xl:w-full h-44 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px] flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=176&width=176"
                  alt="Guide"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <span className="text-xs text-gray-600">full name</span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-900">name</h3>

                <div className="flex flex-wrap items-center gap-1">
                  <span className="px-2 py-0.5 bg-blue-50 rounded-[20px] text-xs font-medium text-blue-700">
                    tag
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-slate-900 rounded-full" />
                    <span className="text-xs text-slate-900">4 hours</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-blue-50 rounded-[20px] text-xs font-medium text-blue-700">
                    10.0
                  </span>
                  <span className="text-xs text-blue-700">Excellent</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-3 bg-slate-900" />
                  <span className="text-xs text-slate-900">location</span>
                </div>
              </div>
            </div>

            {/* Static schedule/price summary (สรุป) */}
            <div className="px-4 sm:px-5 py-2.5 bg-white rounded-[10px] flex flex-col gap-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Price Details</h3>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm font-medium text-slate-900">Guide ( 4 hours)</span>
                  <div className="flex items-start gap-0.5">
                    <span className="text-xs sm:text-sm text-gray-600">฿</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">{formatTHB(total)}</span>
                  </div>
                </div>

                <div className="pl-5 flex justify-between items-start">
                  <span className="text-xs text-gray-600">price before discount</span>
                  <div className="flex items-start gap-px">
                    <span className="text-xs text-gray-600">฿</span>
                    <span className="text-xs text-gray-600">{formatTHB(5000)}</span>
                  </div>
                </div>

                <div className="pl-5 flex justify-between items-start">
                  <span className="text-xs text-gray-600">discount</span>
                  <div className="flex items-start gap-px">
                    <span className="text-xs text-red-500">-฿</span>
                    <span className="text-xs text-red-500">{formatTHB(1000)}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-bold text-slate-900">Total</span>
                <div className="flex items-start gap-0.5">
                  <span className="text-sm sm:text-base text-gray-600">฿</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">{formatTHB(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Booking Button (Mobile) */}
        <div className="block xl:hidden w-auto xl:max-w-[830px] my-2.5 px-4 sm:px-6 py-4 bg-white rounded-[10px]">
          <button
            type="button"
            onClick={() => {
              router.push(`/bookguide/completebooking?bookingId=${encodeURIComponent(bookingId)}&total=${total}`);
            }}
            className="inline-flex w-full h-7 md:h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Complete Booking
          </button>
        </div>
      </main>
    </div>
  );
}
