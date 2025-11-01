"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Statenav from "@/components/navbar/statenav";

// ---- Types ----
type ConfirmGuidePayload = {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    useAccountInfo: boolean;
  };
  note?: string;
  promo?: string;
  schedule: {
    fromISO: string; // e.g. 2025-08-25T09:00:00+07:00
    toISO: string;   // e.g. 2025-08-25T13:00:00+07:00
    hours: number;   // derived
    guests: number;
  };
  item: {
    title: string;   // UI only (เช่น "Guide (4 hours)")
    baseHours: number;
  };
  price: {
    before: number;  // 5000
    discount: number;// 1000
    total: number;   // 4000
    currency: "THB";
  };
};

type ConfirmGuideResponse = {
  success: boolean;
  bookingId?: string;
  message?: string;
};

export default function ConfirmGuideBookingPage() {
  const router = useRouter();

  // ----- UI constants -----
  const customerInfoRows: string[][] = [
    ["First name*", "Last name*"],
    ["Phone number *"],
  ];
  const PRICE = { before: 5000, discount: 1000, total: 4000 } as const;

  // ----- Form states -----
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [note, setNote] = useState("");
  const [promo, setPromo] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("");
  const [guests, setGuests] = useState<number>(2);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ----- Helpers -----
  const toISO = (dateStr: string, timeStr: string) => {
    // สร้าง ISO โดยใช้ timezone ผู้ใช้ (เบราว์เซอร์)
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr}T${timeStr}`);
    return d.toISOString();
  };

  const diffHours = (fromISO: string, toISO: string) => {
    if (!fromISO || !toISO) return 0;
    const ms = new Date(toISO).getTime() - new Date(fromISO).getTime();
    return Math.max(0, ms / (1000 * 60 * 60));
  };

  const formatTHB = (n: number) =>
    new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  // ----- Validation -----
  const validate = (): string | null => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter first and last name.";
    if (!phone.trim()) return "Please enter phone number.";
    if (!fromDate || !fromTime) return "Please select start date & time.";
    if (!toDate || !toTime) return "Please select end date & time.";
    const fromISO = toISO(fromDate, fromTime);
    const toISOv = toISO(toDate, toTime);
    if (!fromISO || !toISOv) return "Invalid date/time.";
    if (new Date(toISOv) <= new Date(fromISO)) return "End time must be after start time.";
    if (!Number.isFinite(guests) || guests < 1) return "Guests must be at least 1.";
    return null;
  };

  // ----- Submit -----
  const handleConfirm = async () => {
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const fromISO = toISO(fromDate, fromTime);
      const toISOv = toISO(toDate, toTime);
      const hours = diffHours(fromISO, toISOv) || 4; // fallback 4 hours

      const payload: ConfirmGuidePayload = {
        customer: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          useAccountInfo,
        },
        note: note.trim() || undefined,
        promo: promo.trim() || undefined,
        schedule: {
          fromISO,
          toISO: toISOv,
          hours,
          guests,
        },
        item: {
          title: "Guide",
          baseHours: 4,
        },
        price: {
          before: PRICE.before,
          discount: PRICE.discount,
          total: PRICE.total,
          currency: "THB",
        },
      };

      // ให้ Next proxy ไป NestJS ผ่าน rewrites (/api/*)
      const res = await fetch("/api/guide/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // credentials: "include", // ถ้าใช้คุกกี้ JWT
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as ConfirmGuideResponse;
      if (!data.success || !data.bookingId) {
        throw new Error(data.message || "Failed to create guide booking.");
      }

      // ไปหน้า payment พร้อมส่ง bookingId/amount ให้
      const qs = new URLSearchParams({
        bookingId: data.bookingId,
        total: String(PRICE.total),
      }).toString();

      router.push(`/bookguide/payment?${qs}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5 flex flex-col justify-start items-start gap-5">
        {/* Header text */}
        <div className="flex flex-col justify-center items-start gap-0.5">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-extrabold">Guide Booking</h1>
          <p className="text-gray-600 text-base sm:text-lg font-semibold">Make sure bla bla</p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="w-full max-w-[1240px] rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <form
          className="w-full max-w-[1240px] mx-auto flex flex-col xl:flex-row justify-center items-start gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            void handleConfirm();
          }}
        >
          {/* Left column */}
          <div className="w-full xl:flex-1 pb-2.5 flex flex-col justify-start items-start gap-5">
            {/* Customer Info */}
            <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-5 overflow-hidden">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="text-slate-900 text-lg sm:text-2xl font-extrabold">Customer Info</div>
                  {/* use my account info */}
                  <label className="py-px flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                      name="useAccountInfo"
                      checked={useAccountInfo}
                      onChange={(e) => setUseAccountInfo(e.target.checked)}
                    />
                    <span className="text-gray-600 text-sm sm:text-base font-medium">use my account info</span>
                  </label>
                </div>

                <p className="text-gray-600 text-sm sm:text-base font-medium">
                  Please make sure that your name matches your id and the contacts are correct.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* rows via map */}
                {customerInfoRows.map((row, idx) => (
                  <div
                    key={`cust-row-${idx}`}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-5"
                  >
                    {row.map((label, j) => {
                      const isPhone = /phone/i.test(label);
                      const id = `cust-${idx}-${j}`;
                      return (
                        <label
                          key={`cust-field-${idx}-${j}`}
                          htmlFor={id}
                          className="flex-1 min-w-24 p-2.5 bg-white flex items-center gap-2.5 h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                        >
                          <span className="sr-only">{label}</span>
                          <input
                            id={id}
                            name={id}
                            type={isPhone ? "tel" : "text"}
                            inputMode={isPhone ? "tel" : "text"}
                            placeholder={label}
                            className="w-full bg-transparent placeholder:text-gray-400 text-slate-900 text-sm sm:text-base font-medium focus:outline-none"
                            autoComplete={
                              isPhone
                                ? "tel"
                                : idx === 0 && j === 0
                                ? "given-name"
                                : idx === 0 && j === 1
                                ? "family-name"
                                : "off"
                            }
                            value={
                              isPhone
                                ? phone
                                : idx === 0 && j === 0
                                ? firstName
                                : lastName
                            }
                            onChange={(e) =>
                              isPhone
                                ? setPhone(e.target.value)
                                : idx === 0 && j === 0
                                ? setFirstName(e.target.value)
                                : setLastName(e.target.value)
                            }
                          />
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>

            {/* Note */}
            <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-5 overflow-hidden">
              <div className="flex items-center gap-1">
                <div className="text-slate-900 text-lg sm:text-xl font-bold">Note</div>
                <div className="text-gray-600 text-sm sm:text-base font-medium">(optional)</div>
              </div>

              <label
                htmlFor="note"
                className="self-stretch min-h-14 p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
              >
                <span className="sr-only">Note</span>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Add a note for your guide…"
                  className="w-full h-24 resize-y bg-transparent placeholder-gray-400 text-slate-900 text-sm sm:text-base font-medium focus:outline-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
            </section>

            {/* Promo Code */}
            <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-3 overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="text-slate-900 text-lg sm:text-xl font-bold">Promo Code</div>
                <div className="w-7 h-4 relative origin-top-left rotate-90">
                  <div className="w-3.5 h-2 left-[0.80px] top-[4.83px] absolute bg-slate-900" />
                </div>
              </div>

              <label
                htmlFor="promo"
                className="w-full p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
              >
                <span className="sr-only">Promo Code</span>
                <input
                  id="promo"
                  name="promo"
                  type="text"
                  placeholder="Enter promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="flex-1 bg-transparent placeholder-gray-400 text-slate-900 text-sm sm:text-base font-medium focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {/* TODO: ตรวจโค้ดโปรโมชันกับ API ถ้าต้องการ */}}
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold"
                >
                  Apply
                </button>
              </label>
            </section>

            {/* Footer actions (Desktop) */}
            <div className="hidden xl:block self-stretch rounded-[10px] py-5.5 px-4 bg-white space-y-2.5">
              <div className="-mt-2 text-sm font-medium text-sky-700">You won’t be charged yet</div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Confirm Booking"}
              </button>
              <div className="text-sm text-gray-500">
                By continuing to payment, I agree to TripMate’s{" "}
                <a className="underline" href="#">Terms of Use</a>{" "}and{" "}
                <a className="underline" href="#">Privacy Policy</a>.
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="w-full xl:w-96 flex flex-col gap-2.5">
            {/* Guide card (UI) */}
            <section className="self-stretch min-h-[192px] p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 flex flex-col sm:flex-row gap-2.5">
              <div className="w-full sm:w-44 h-44 relative flex-shrink-0">
                <div className="w-full h-full left-0 top-0 absolute bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]" />
              </div>

              <div className="flex-1 flex justify-between">
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-[3px]">
                    <div className="w-3 h-3 flex flex-col overflow-hidden">
                      <div className="self-stretch h-3 bg-gray-600" />
                    </div>
                    <div className="text-gray-600 text-xs">full name</div>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap content-center">
                    <div className="text-slate-900 text-base sm:text-lg font-semibold">name</div>
                  </div>

                  <div className="flex items-center gap-[3px]">
                    <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex items-center gap-1">
                      <div className="text-blue-700 text-xs font-medium">10.0</div>
                    </div>
                    <div className="text-blue-700 text-xs">Excellent</div>
                  </div>

                  <div className="flex items-center gap-[3px]">
                    <div className="w-2.5 h-3 bg-slate-900" />
                    <div className="text-slate-900 text-xs">location</div>
                  </div>

                  <div className="flex items-center gap-[3px]">
                    <div className="w-3 h-3 relative overflow-hidden">
                      <div className="w-3 h-3 left-0 top-0 absolute bg-slate-900" />
                    </div>
                    <div className="text-slate-900 text-xs">4 hours</div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex items-center gap-1">
                      <div className="text-blue-700 text-xs font-medium">tag</div>
                    </div>
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-end items-center" />
              </div>
            </section>

            {/* From / To section */}
            <section className="self-stretch p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-center gap-3">
              <div className="self-stretch flex flex-col sm:flex-row items-center gap-1.5">
                <div className="w-full sm:flex-1 flex flex-col gap-2.5 overflow-hidden">
                  <label className="text-gray-600 text-xs" htmlFor="from-date">From</label>

                  <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="from-date"
                      name="from-date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>

                  <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="from-time"
                      name="from-time"
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 overflow-hidden">
                  <div className="text-slate-900 text-xs sm:text-sm font-medium text-center">
                    4<br />hours
                  </div>
                  <div className="w-4 h-4 p-px flex justify-center items-center overflow-hidden">
                    <div className="w-4 h-3.5 bg-slate-900" />
                  </div>
                </div>

                <div className="w-full sm:flex-1 flex flex-col gap-2.5 overflow-hidden">
                  <label className="text-gray-600 text-xs" htmlFor="to-date">To</label>

                  <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="to-date"
                      name="to-date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>

                  <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="to-time"
                      name="to-time"
                      type="time"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-medium focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>
                </div>
              </div>

              <div className="self-stretch flex items-center gap-2.5">
                <label className="text-slate-900 text-xs sm:text-sm font-medium" htmlFor="guests">
                  Guest *
                </label>

                <div className="flex-1 h-7 px-2.5 py-1 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                  <div className="flex-1 flex items-center gap-2.5">
                    <div className="w-4 h-4 bg-slate-900" />
                    <input
                      id="guests"
                      name="guests"
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-12 bg-transparent text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="w-0 h-3 relative origin-top-left rotate-90">
                    <div className="w-2.5 h-1.5 left-[0.60px] top-[3.88px] absolute bg-slate-900" />
                  </div>
                </div>
              </div>
            </section>

            {/* Price Details */}
            <section className="w-full px-4 sm:px-5 py-2.5 bg-white rounded-[10px] flex flex-col items-center gap-3.5">
              <div className="self-stretch flex justify-between">
                <div className="text-slate-900 text-lg sm:text-xl font-bold">Price Details</div>
              </div>

              <div className="self-stretch flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <div className="text-slate-900 text-xs sm:text-sm font-medium">Guide ( 4 hours)</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-600 text-xs sm:text-sm">฿</span>
                    <span className="text-slate-900 text-xs sm:text-sm font-medium">
                      {formatTHB(PRICE.total)}
                    </span>
                  </div>
                </div>

                <div className="pl-3 sm:pl-5 flex justify-between">
                  <div className="text-gray-600 text-[10px] sm:text-xs">price before discount</div>
                  <div className="flex items-start gap-px">
                    <span className="text-gray-600 text-[10px] sm:text-xs">฿</span>
                    <span className="text-gray-600 text-[10px] sm:text-xs">{formatTHB(PRICE.before)}</span>
                  </div>
                </div>

                <div className="pl-3 sm:pl-5 flex justify-between">
                  <div className="text-gray-600 text-[10px] sm:text-xs">discount</div>
                  <div className="flex items-start gap-px">
                    <span className="text-red-500 text-[10px] sm:text-xs">-</span>
                    <span className="text-red-500 text-[10px] sm:text-xs">฿</span>
                    <span className="text-red-500 text-[10px] sm:text-xs">{formatTHB(PRICE.discount)}</span>
                  </div>
                </div>
              </div>

              <div className="self-stretch h-px bg-gray-200" />

              <div className="self-stretch flex justify-between items-center">
                <div className="text-slate-900 text-sm sm:text-base font-bold">Total</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-600 text-sm sm:text-base">฿</span>
                  <span className="text-slate-900 text-sm sm:text-base font-bold">{formatTHB(PRICE.total)}</span>
                </div>
              </div>
            </section>
          </aside>

          {/* CTA for mobile */}
          <div className="block xl:hidden w-full bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 space-y-2.5">
            <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
            >
              {submitting ? "Processing..." : "Confirm Booking"}
            </button>
            <div className="text-sm text-gray-500">
              By continuing to payment, I agree to TripMate’s{" "}
              <a className="underline" href="#">Terms of Use</a>{" "}and{" "}
              <a className="underline" href="#">Privacy Policy</a>.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
