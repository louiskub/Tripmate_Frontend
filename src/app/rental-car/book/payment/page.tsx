"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';

/* =================== Types =================== */
type PayMethod = "card" | "qr";

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
    currency: "THB";
  };
};

type CreatePaymentIntentReq = {
  bookingId: string;
  method: PayMethod;
  amount: number;
  currency: "THB";
};

type CreatePaymentIntentResp =
  | {
      success: true;
      paymentId: string;
      clientSecret?: string;
      qrImageDataUrl?: string;
      message?: string;
    }
  | {
      success: false;
      message?: string;
    };

type ConfirmCardPaymentReq = {
  paymentId: string;
  card: {
    name: string;
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
};

type ConfirmPaymentResp =
  | { success: true; paid: boolean }
  | { success: false; message?: string };

type PaymentStatusResp =
  | { success: true; status: "requires_action" | "processing" | "succeeded" | "failed" }
  | { success: false; message?: string };

/* =================== Utils =================== */
const THB = (n: number) =>
  new Intl.NumberFormat("en-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const parseAmount = (s: string | null): number | null => {
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const luhnValid = (num: string): boolean => {
  const s = num.replace(/\s+/g, "");
  if (!/^\d{12,19}$/.test(s)) return false;
  let sum = 0;
  let doubleNext = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = s.charCodeAt(i) - 48; // 0..9
    if (doubleNext) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    doubleNext = !doubleNext;
  }
  return sum % 10 === 0;
};

const parseExp = (exp: string): { month: number; year: number } | null => {
  const m = exp.match(/^(\d{2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!m) return null;
  const month = Number(m[1]);
  let year = Number(m[2]);
  if (String(year).length === 2) year += 2000;
  if (month < 1 || month > 12 || year < 2000 || year > 2100) return null;
  return { month, year };
};

/* =================== Page =================== */
export default function RentalCarPaymentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // ---- Read bookingId & total from URL ----
  const bookingId = sp.get("bookingId") || "";
  const totalFromUrl = parseAmount(sp.get("total"));
  const total = totalFromUrl ?? 5192.92;

  // ---- Payment method ----
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("card");

  // ---- Card form states ----
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState(""); // MM/YY
  const [cardCvc, setCardCvc] = useState("");

  // ---- QR / intent states ----
  const [paymentId, setPaymentId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [qrImageDataUrl, setQrImageDataUrl] = useState("");

  // ---- Booking summary (RIGHT card) ----
  const [summary, setSummary] = useState<BookingSummaryDTO | null>(null);

  // ---- UI states ----
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  /* ===== Fetch booking summary for right panel ===== */
  useEffect(() => {
    let ignore = false;
    const fetchSummary = async () => {
      if (!bookingId) return;
      try {
        const res = await fetch(`/api/rental/booking/${encodeURIComponent(bookingId)}`, { method: "GET" });
        if (!res.ok) throw new Error(`Fetch booking ${res.status}`);
        const json = (await res.json()) as { success: boolean; data?: BookingSummaryDTO; message?: string };
        if (!json.success) throw new Error(json.message || "Cannot get booking summary");
        if (!ignore) setSummary(json.data!);
      } catch (e) {
        if (!ignore) setInfoMsg(e instanceof Error ? e.message : String(e));
      }
    };
    void fetchSummary();
    return () => {
      ignore = true;
    };
  }, [bookingId]);

  /* =================== API bridges =================== */
  const createPaymentIntent = useCallback(
    async (method: PayMethod): Promise<CreatePaymentIntentResp> => {
      const body: CreatePaymentIntentReq = {
        bookingId,
        method,
        amount: total,
        currency: "THB",
      };
      const res = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        return { success: false, message: t || `intent failed: ${res.status}` };
      }
      return (await res.json()) as CreatePaymentIntentResp;
    },
    [bookingId, total]
  );

  const confirmCardPayment = useCallback(
    async (pid: string): Promise<ConfirmPaymentResp> => {
      const parsed = parseExp(cardExp.trim());
      if (!parsed) return { success: false, message: "Invalid expiry (MM/YY)" };
      const payload: ConfirmCardPaymentReq = {
        paymentId: pid,
        card: {
          name: cardName.trim(),
          number: cardNumber.replace(/\s+/g, ""),
          expMonth: parsed.month,
          expYear: parsed.year,
          cvc: cardCvc.trim(),
        },
      };
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        return { success: false, message: t || `confirm failed: ${res.status}` };
      }
      return (await res.json()) as ConfirmPaymentResp;
    },
    [cardName, cardNumber, cardExp, cardCvc]
  );

  const checkPaymentStatus = useCallback(
    async (pid: string): Promise<PaymentStatusResp> => {
      const res = await fetch(`/api/payments/${encodeURIComponent(pid)}/status`, { method: "GET" });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        return { success: false, message: t || `status failed: ${res.status}` };
      }
      return (await res.json()) as PaymentStatusResp;
    },
    []
  );

  /* =================== Handlers =================== */
  const validateCardForm = (): string | null => {
    if (!cardName.trim()) return "Card holder name is required.";
    const number = cardNumber.replace(/\s+/g, "");
    if (!luhnValid(number)) return "Card number is invalid.";
    const parsed = parseExp(cardExp.trim());
    if (!parsed) return "Expiration date is invalid (MM/YY).";
    if (!/^\d{3,4}$/.test(cardCvc.trim())) return "CVV/CVC is invalid.";
    return null;
  };

  const handlePayNow = async (): Promise<void> => {
    router.push(
        `/rental-car/book/completebooking`
      );
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      if (!bookingId) throw new Error("Missing bookingId.");
      if (!Number.isFinite(total)) throw new Error("Missing total amount.");

      const intent = await createPaymentIntent(paymentMethod);
      if (!intent.success) throw new Error(intent.message || "Cannot create payment intent.");

      setPaymentId(intent.paymentId || "");
      setClientSecret(intent.clientSecret || "");
      setQrImageDataUrl(intent.qrImageDataUrl || "");

      if (paymentMethod === "card") {
        const v = validateCardForm();
        if (v) throw new Error(v);

        const confirm = await confirmCardPayment(intent.paymentId);
        if (!confirm.success) throw new Error(confirm.message || "Card confirmation failed.");

        if (confirm.paid) {
          router.replace(
            `/bookrentalcar/completebooking?bookingId=${encodeURIComponent(
              bookingId
            )}&paymentId=${encodeURIComponent(intent.paymentId)}`
          );
          return;
        }
        setInfoMsg("Payment is processing. You can check status.");
      } else {
        if (!intent.qrImageDataUrl) {
          setInfoMsg("QR is not available, please try again.");
        } else {
          setInfoMsg("Scan the QR to complete payment, then click 'I have paid' to check status.");
        }
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleIHavePaid = async (): Promise<void> => {
    if (!paymentId) {
      setErrorMsg("No payment in progress.");
      return;
    }
    setStatusLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      const st = await checkPaymentStatus(paymentId);
      if (!st.success) throw new Error(st.message || "Cannot get payment status.");
      if (st.status === "succeeded") {
        router.replace(
          `/bookrentalcar/completebooking?bookingId=${encodeURIComponent(
            bookingId
          )}&paymentId=${encodeURIComponent(paymentId)}`
        );
        return;
      }
      if (st.status === "failed") {
        setErrorMsg("Payment failed. Please try another method.");
      } else if (st.status === "processing") {
        setInfoMsg("Payment is still processing… Try again shortly.");
      } else {
        setInfoMsg("Payment requires action. Please finish the payment on your device.");
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setStatusLoading(false);
    }
  };

  /* =================== Fallback summary =================== */
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
    }),
    [bookingId]
  );

  const s = summary ?? fallbackSummary;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)


  /* =================== UI =================== */
  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={2}/>

      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 lg:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24">
          {/* Title */}
          <div className="flex flex-col gap-0.5 mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">Rental Car Booking</h1>
            <p className="text-lg font-semibold text-gray-500">Make sure bla bla</p>
          </div>

          {/* Banners */}
          {errorMsg && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          {infoMsg && (
            <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {infoMsg}
            </div>
          )}

          {/* 2 columns */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Confirm Payment */}
              <div className="w-full xl:max-w-[830px] px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Confirm Payment</h2>
                </div>

                {/* Method selector */}
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

                  {/* Content */}
                  <div className="px-4 sm:px-7 py-5 border-t border-gray-200">
                    {paymentMethod === "card" ? (
                      <div className="px-0 sm:px-7 flex flex-col items-end gap-5">
                        {/* Card holder */}
                        <div className="w-full">
                          <label className="block text-sm text-gray-600 mb-1">Card holder name *</label>
                          <input
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            type="text"
                            placeholder="Emily Chow"
                            className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="cc-name"
                          />
                        </div>

                        {/* Card number */}
                        <div className="w-full">
                          <label className="block text-sm text-gray-600 mb-1">Credit/debit card number *</label>
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            inputMode="numeric"
                            autoComplete="cc-number"
                          />
                        </div>

                        {/* Exp / CVV */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Expiration date *</label>
                            <input
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              type="text"
                              placeholder="01/28"
                              className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoComplete="cc-exp"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">CVV/CVC *</label>
                            <input
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              type="text"
                              placeholder="123"
                              className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                            />
                          </div>
                        </div>

                        {/* Charge text */}
                        <div className="w-full flex items-center gap-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-gray-500">฿</span>
                            <span className="text-sm font-medium text-slate-900">{THB(total)}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            will be charged to the credit/debit card you provided.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center gap-4">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Pay with QR PromptPay</h3>
                        <div className="flex items-start gap-0.5">
                          <span className="py-1 text-gray-600 text-lg sm:text-xl">฿</span>
                          <span className="py-1 text-lg sm:text-xl font-bold text-slate-900">{THB(total)}</span>
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

                        {paymentId && (
                          <button
                            type="button"
                            onClick={() => void handleIHavePaid()}
                            disabled={statusLoading}
                            className="px-4 py-2 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold disabled:opacity-60"
                          >
                            {statusLoading ? "Checking..." : "I have paid — Check status"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden xl:block w-full xl:max-w-[830px] px-4 sm:px-6 py-4 bg-white rounded-[10px]">
                <button
                  type="button"
                  onClick={() => void handlePayNow()}
                  disabled={loading}
                  className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                >
                  {loading ? "Processing…" : `Pay now (฿${THB(total)})`}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="w-full lg:max-w-[384px] flex flex-col gap-2.5">
              {/* Card */}
              <div className="rounded-[10px] bg-white border border-neutral-200 p-2.5 flex gap-2.5">
                <div className="w-44 h-44 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-lg font-semibold text-slate-900">{(summary ?? fallbackSummary).title}</div>

                    <div className="flex gap-1 w-14">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex-1 h-2.5 bg-blue-700" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">
                        {(summary ?? fallbackSummary).rating.toFixed(1)}
                      </span>
                      <span className="text-blue-700 text-xs">{(summary ?? fallbackSummary).ratingText}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-3 bg-slate-900" />
                      <span className="text-xs text-slate-900">{(summary ?? fallbackSummary).location}</span>
                    </div>

                    {(summary ?? fallbackSummary).tag && (
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">
                          {(summary ?? fallbackSummary).tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pick-up / Drop-off */}
              <div className="rounded-[10px] bg-white p-2.5 space-y-3">
                <div className="flex items-center">
                  <div className="px-1 flex-1">
                    <div className="text-xs text-gray-500">Pick-up</div>
                    <div className="text-base font-medium text-slate-900">{(summary ?? fallbackSummary).pickup.date}</div>
                    <div className="text-sm text-gray-600">{(summary ?? fallbackSummary).pickup.timeLabel}</div>
                  </div>

                  <div className="w-16 flex flex-col items-center">
                    <div className="text-sm font-medium text-slate-900">{(summary ?? fallbackSummary).days} days</div>
                    <div className="w-4 h-4 bg-slate-900 mt-1" />
                  </div>

                  <div className="px-1 flex-1">
                    <div className="text-xs text-gray-500">Drop-off</div>
                    <div className="text-base font-medium text-slate-900">
                      {(summary ?? fallbackSummary).dropoff.date}
                    </div>
                    <div className="text-sm text-gray-600">{(summary ?? fallbackSummary).dropoff.timeLabel}</div>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="rounded-[10px] bg-white px-5 py-2.5 space-y-3.5">
                <div>
                  <div className="text-xl font-bold text-slate-900">Price Details</div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">
                      Rental Car {(summary ?? fallbackSummary).days ? `(${(summary ?? fallbackSummary).days} days)` : ""}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">
                        {THB((summary ?? fallbackSummary).price.discounted)}
                      </span>
                    </div>
                  </div>
                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">price before discount</div>
                    <div className="flex items-baseline gap-0.5 text-gray-500">
                      <span className="text-xs">฿</span>
                      <span className="text-xs">{THB((summary ?? fallbackSummary).price.beforeDiscount)}</span>
                    </div>
                  </div>
                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">discount</div>
                    <div className="flex items-baseline gap-0.5 text-red-600">
                      <span className="text-xs">-</span>
                      <span className="text-xs">฿</span>
                      <span className="text-xs">{THB((summary ?? fallbackSummary).price.discount)}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">Total</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base text-gray-500">฿</span>
                    <span className="text-base font-bold text-slate-900">{THB(total)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile CTA */}
          <div className="block xl:hidden w-auto xl:max-w-[830px] my-2.5 px-4 sm:px-6 py-4 bg-white rounded-[10px]">
            <button
              type="button"
              onClick={() => void handlePayNow()}
              disabled={loading}
              className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
            >
              {loading ? "Processing…" : `Pay now (฿${THB(total)})`}
            </button>

            {paymentMethod === "qr" && paymentId && (
              <button
                type="button"
                onClick={() => void handleIHavePaid()}
                disabled={statusLoading}
                className="mt-2 inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-slate-900 text-white no-underline text-sm md:text-base font-bold disabled:opacity-60"
              >
                {statusLoading ? "Checking..." : "I have paid — Check status"}
              </button>
            )}
          </div>
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
