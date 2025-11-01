"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Statenav from "@/components/navbar/statenav";
import Link from "next/link";

// ===== Types =====
type AddonKey = "deposit" | "deliveryLocal" | "deliveryOuter" | "insurance";

type PayMethod = "card" | "promptpay";

type ProfileDTO = {
  firstName: string;
  lastName: string;
  phone: string;
};

type PromoValidateReq = {
  code: string;
  context: {
    baseBeforeDiscount: number;
    baseAfterDiscount: number;
    addonsPerDay: Partial<Record<AddonKey, number>>;
    days: number;
  };
};

type PromoValidateResp =
  | {
      success: true;
      // อย่างใดอย่างหนึ่ง (กำหนดให้ backend คืนมา)
      amountOff?: number; // ลดเป็นจำนวนเงิน
      percentOff?: number; // 0-100
      message?: string;
    }
  | { success: false; message?: string };

type CreateRentalBookingBody = {
  customer: { firstName: string; lastName: string; phone: string };
  note?: string;
  addons: AddonKey[];
  days: number;
  pricing: {
    baseBefore: number;
    baseAfter: number;
    addonsPerDay: Record<AddonKey, number>;
    promoCode?: string;
    promoAmountOff?: number; // ที่คำนวณหลัง validate แล้ว
    total: number; // รวมสุดท้าย
    currency: "THB";
  };
};

type CreateRentalBookingResp =
  | {
      success: true;
      bookingId: string;
      total: number;
    }
  | { success: false; message?: string };

// ===== Utils =====
const THB = (n: number) =>
  new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ===== Component =====
export default function RentalCarConfirmBookingPage() {
  const router = useRouter();

  // --- Demo days/prices (สมมติรับมาจากหน้าก่อนหน้า/URL/Redux ก็ได้) ---
  const baseDays = 2;
  const baseBeforeDiscount = 20000;
  const basePrice = 18000; // after discount
  const baseDiscount = baseBeforeDiscount - basePrice;

  const addonPricesPerDay: Record<AddonKey, number> = {
    deposit: 1000,
    deliveryLocal: 500,
    deliveryOuter: 1000,
    insurance: 500,
  };

  // --- State ---
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [addons, setAddons] = useState<Record<AddonKey, boolean>>({
    deposit: false,
    deliveryLocal: false,
    deliveryOuter: true,
    insurance: true,
  });

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoAppliedOffAmt, setPromoAppliedOffAmt] = useState<number>(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Derived: addons total (ต่อวัน) และรวมตามจำนวนวัน ---
  const addonsTotalPerDay = useMemo(() => {
    let sum = 0;
    (Object.keys(addons) as AddonKey[]).forEach((k) => {
      if (addons[k]) sum += addonPricesPerDay[k];
    });
    return sum;
  }, [addons]);

  const addonsTotalAllDays = addonsTotalPerDay * baseDays;

  // grand total ก่อนหักโปรโม
  const subtotal = basePrice + addonsTotalAllDays;

  // final total (หลังหัก promo)
  const grandTotal = Math.max(0, subtotal - promoAppliedOffAmt);

  const toggleAddon = (k: AddonKey) =>
    setAddons((prev) => ({
      ...prev,
      [k]: !prev[k],
    }));

  // --- เติมข้อมูลบัญชีผู้ใช้เมื่อกดติ๊ก ---
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!useAccountInfo) return;
      try {
        const res = await fetch("/api/me/profile", { method: "GET" });
        if (!res.ok) throw new Error(`Profile error: ${res.status}`);
        const json = (await res.json()) as { success: boolean; data?: ProfileDTO; message?: string };
        if (json.success && json.data && !ignore) {
          setFirstName(json.data.firstName ?? "");
          setLastName(json.data.lastName ?? "");
          setPhone(json.data.phone ?? "");
        } else if (!ignore) {
          setErrorMsg(json.message || "Failed to load account info.");
        }
      } catch (e) {
        if (!ignore) setErrorMsg(e instanceof Error ? e.message : String(e));
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, [useAccountInfo]);

  // --- Apply promo ---
  const applyPromo = async () => {
    setPromoMsg(null);
    setErrorMsg(null);
    setPromoLoading(true);
    setPromoAppliedOffAmt(0);
    try {
      if (!promoCode.trim()) {
        setPromoMsg("Please enter a code.");
        return;
      }

      const body: PromoValidateReq = {
        code: promoCode.trim(),
        context: {
          baseBeforeDiscount,
          baseAfterDiscount: basePrice,
          addonsPerDay: Object.fromEntries(
            (Object.keys(addonPricesPerDay) as AddonKey[]).map((k) => [k, addonPricesPerDay[k]])
          ) as Record<AddonKey, number>,
          days: baseDays,
        },
      };

      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Promo failed: ${res.status}`);
      }
      const json = (await res.json()) as PromoValidateResp;
      if (!json.success) {
        setPromoMsg(json.message || "Invalid promo code.");
        return;
      }

      // คิดส่วนลดจริง
      let off = 0;
      if (typeof json.amountOff === "number") {
        off = json.amountOff;
      } else if (typeof json.percentOff === "number") {
        off = (subtotal * Math.min(Math.max(json.percentOff, 0), 100)) / 100;
      }
      setPromoAppliedOffAmt(Math.min(off, subtotal));
      setPromoMsg(json.message || "Promo applied.");
    } catch (e) {
      setPromoMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setPromoLoading(false);
    }
  };

  // --- Validate ฟอร์มก่อนสร้าง booking ---
  const validate = (): string | null => {
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (!/^\+?\d[\d\s\-]{6,}$/.test(phone.trim())) return "Phone number looks invalid.";
    return null;
  };

  // --- Create booking & go to payment ---
  const handleConfirmBooking = async () => {
    try {
      setErrorMsg(null);
      const v = validate();
      if (v) {
        setErrorMsg(v);
        return;
      }
      setSubmitting(true);

      const selectedAddons = (Object.keys(addons) as AddonKey[]).filter((k) => addons[k]);

      const payload: CreateRentalBookingBody = {
        customer: { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() },
        note: note.trim() || undefined,
        addons: selectedAddons,
        days: baseDays,
        pricing: {
          baseBefore: baseBeforeDiscount,
          baseAfter: basePrice,
          addonsPerDay: addonPricesPerDay,
          promoCode: promoCode.trim() || undefined,
          promoAmountOff: promoAppliedOffAmt || undefined,
          total: grandTotal,
          currency: "THB",
        },
      };

      const res = await fetch("/api/rental/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // credentials: "include", // ถ้าใช้ cookie
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Create booking failed: ${res.status}`);
      }

      const json = (await res.json()) as CreateRentalBookingResp;
      if (!json.success) throw new Error(json.message || "Cannot create booking.");

      const bookingId = json.bookingId;
      const total = json.total ?? grandTotal;

      // ไปหน้าชำระเงิน
      router.push(`/bookrentalcar/payment?bookingId=${encodeURIComponent(bookingId)}&total=${total}`);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Statenav />

      {/* MAIN */}
      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 xl:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24">
          {/* Title */}
          <div className="flex flex-col gap-0.5 mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">Rental Car Booking</h1>
            <p className="text-lg font-semibold text-gray-500">Make sure bla bla</p>
          </div>

          {/* error banner */}
          {errorMsg && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* 2 Columns */}
          <div className="flex flex-col xl:flex-row gap-3">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Customer Info */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Customer Info</h2>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        checked={useAccountInfo}
                        onChange={(e) => setUseAccountInfo(e.target.checked)}
                      />
                      <span className="text-base font-medium text-gray-500">use my account info</span>
                    </label>
                  </div>
                  <p className="text-base text-gray-500">
                    Please make sure that your name matches your ID and the contacts are correct.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First name*"
                      autoComplete="given-name"
                    />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last name*"
                      autoComplete="family-name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number*"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </section>

              {/* Additional Services */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Additional Services</h2>
                    <span className="text-base text-gray-500">(optional)</span>
                  </div>
                  <p className="text-base text-gray-500">Choose add-ons you need. Prices are per day.</p>
                </div>

                <div className="w-full flex flex-col xl:flex-row items-start gap-5">
                  {/* Group 1 */}
                  <div className="flex flex-col gap-5">
                    {/* Deposit */}
                    <button
                      type="button"
                      onClick={() => toggleAddon("deposit")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.deposit ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Deposit</div>
                        <div className="text-xs text-slate-700">Refundable upon return</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">1,000</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>
                  </div>

                  {/* (Vertical divider for large screens) */}
                  <div className="hidden xl:block w-px h-36 bg-neutral-200" />

                  {/* Group 2 (Delivery) */}
                  <div className="flex flex-col gap-5">
                    <button
                      type="button"
                      onClick={() => toggleAddon("deliveryLocal")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.deliveryLocal ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Delivery</div>
                        <div className="text-xs text-slate-700">in local area</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">500</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAddon("deliveryOuter")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.deliveryOuter ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Delivery</div>
                        <div className="text-xs text-slate-700">out of local area</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">1,000</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="hidden xl:block w-px h-36 bg-neutral-200" />

                  {/* Group 3 */}
                  <div className="flex flex-col gap-5">
                    <button
                      type="button"
                      onClick={() => toggleAddon("insurance")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.insurance ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Insurance</div>
                        <div className="text-xs text-slate-700">Collision damage waiver</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">500</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* Note */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Note</h2>
                  <span className="text-base text-gray-500">(optional)</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-28 rounded-[10px] border border-neutral-200 p-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a note for the provider..."
                />
              </section>

              {/* Promo Code */}
              <section
                data-property-1="Variant2"
                className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-3 overflow-hidden"
              >
                <div className="self-stretch flex justify-between items-center">
                  <div className="text-slate-900 text-lg sm:text-xl font-bold">Promo Code</div>
                  <button
                    type="button"
                    onClick={() => setPromoOpen((s) => !s)}
                    className="text-sm text-slate-700 underline"
                  >
                    {promoOpen ? "Hide" : "Show"}
                  </button>
                </div>

                {promoOpen && (
                  <>
                    <label
                      htmlFor="promo"
                      className="w-full p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
                    >
                      <span className="sr-only">Promo Code</span>
                      <input
                        id="promo"
                        name="promo"
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 bg-transparent placeholder-gray-400 text-slate-900 text-sm sm:text-base font-medium focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => void applyPromo()}
                        disabled={promoLoading}
                        className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold disabled:opacity-60"
                      >
                        {promoLoading ? "Applying..." : "Apply"}
                      </button>
                    </label>
                    {promoMsg && <div className="text-xs text-gray-600">{promoMsg}</div>}
                  </>
                )}
              </section>

              {/* CTA (Desktop) */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-4">
                <div className="hidden xl:block rounded-[10px] bg-white space-y-2.5">
                  <div className="-mt-2 text-sm font-medium text-sky-700">You won’t be charged yet</div>
                  <button
                    type="button"
                    onClick={() => void handleConfirmBooking()}
                    disabled={submitting}
                    className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                  >
                    {submitting ? "Creating booking..." : `Confirm Booking (฿${THB(grandTotal)})`}
                  </button>
                  <div className="text-sm text-gray-500">
                    By continuing to payment, I agree to TripMate’s <a className="underline" href="#">
                      Terms of Use
                    </a>{" "}
                    and <a className="underline" href="#">
                      Privacy Policy
                    </a>.
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="w-full xl:max-w-[384px] flex flex-col gap-2.5">
              {/* Car Card */}
              <div className="rounded-[10px] bg-white border border-neutral-200 p-2.5 flex gap-2.5">
                <div className="w-44 h-44 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-lg font-semibold text-slate-900">name</div>

                    <div className="flex gap-1 w-14">
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">10.0</span>
                      <span className="text-blue-700 text-xs">Excellent</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-3 bg-slate-900" />
                      <span className="text-xs text-slate-900">location</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">tag</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pick-up / Drop-off */}
              <div className="rounded-[10px] bg-white p-2.5 space-y-3">
                <div className="flex items-center">
                  <div className="px-1 flex-1">
                    <div className="text-xs text-gray-500">Pick-up</div>
                    <div className="text-base font-medium text-slate-900">Sat, 25 Aug 2025</div>
                    <div className="text-sm text-gray-600">from 09.00</div>
                  </div>

                  <div className="w-16 flex flex-col items-center">
                    <div className="text-sm font-medium text-slate-900">{baseDays} days</div>
                    <div className="w-4 h-4 bg-slate-900 mt-1" />
                  </div>

                  <div className="px-1 flex-1">
                    <div className="text-xs text-gray-500">Drop-off</div>
                    <div className="text-base font-medium text-slate-900">Mon, 27 Aug 2025</div>
                    <div className="text-sm text-gray-600">before 20.00</div>
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
                    <div className="text-sm font-medium text-slate-900">Rental Car ({baseDays} days)</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">{THB(basePrice)}</span>
                    </div>
                  </div>
                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">price before discount</div>
                    <div className="flex items-baseline gap-0.5 text-gray-500">
                      <span className="text-xs">฿</span>
                      <span className="text-xs">{THB(baseBeforeDiscount)}</span>
                    </div>
                  </div>
                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">discount</div>
                    <div className="flex items-baseline gap-0.5 text-red-600">
                      <span className="text-xs">-</span>
                      <span className="text-xs">฿</span>
                      <span className="text-xs">{THB(baseDiscount)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">Additional Services ({baseDays} days)</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">{THB(addonsTotalAllDays)}</span>
                    </div>
                  </div>

                  {addons.deposit && (
                    <div className="pl-5 flex items-start justify-between">
                      <div className="text-xs text-gray-500">Deposit</div>
                      <div className="flex items-baseline gap-0.5 text-gray-600">
                        <span className="text-xs">฿</span>
                        <span className="text-xs">{THB(addonPricesPerDay.deposit)}</span>
                      </div>
                    </div>
                  )}
                  {addons.deliveryLocal && (
                    <div className="pl-5 flex items-start justify-between">
                      <div className="text-xs text-gray-500">Delivery (local)</div>
                      <div className="flex items-baseline gap-0.5 text-gray-600">
                        <span className="text-xs">฿</span>
                        <span className="text-xs">{THB(addonPricesPerDay.deliveryLocal)}</span>
                      </div>
                    </div>
                  )}
                  {addons.deliveryOuter && (
                    <div className="pl-5 flex items-start justify-between">
                      <div className="text-xs text-gray-500">Delivery (out of local area)</div>
                      <div className="flex items-baseline gap-0.5 text-gray-600">
                        <span className="text-xs">฿</span>
                        <span className="text-xs">{THB(addonPricesPerDay.deliveryOuter)}</span>
                      </div>
                    </div>
                  )}
                  {addons.insurance && (
                    <div className="pl-5 flex items-start justify-between">
                      <div className="text-xs text-gray-500">Insurance</div>
                      <div className="flex items-baseline gap-0.5 text-gray-600">
                        <span className="text-xs">฿</span>
                        <span className="text-xs">{THB(addonPricesPerDay.insurance)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {promoAppliedOffAmt > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-medium text-slate-900">Promo discount</div>
                      <div className="flex items-baseline gap-1 text-red-600">
                        <span className="text-sm">-฿</span>
                        <span className="text-sm font-medium">{THB(promoAppliedOffAmt)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">Total</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base text-gray-500">฿</span>
                    <span className="text-base font-bold text-slate-900">{THB(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* CTA for mobile */}
          <div className="block xl:hidden bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 flex flex-col gap-2.5">
            <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
            <button
              type="button"
              onClick={() => void handleConfirmBooking()}
              disabled={submitting}
              className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white no-underline text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
            >
              {submitting ? "Creating booking..." : `Confirm Booking (฿${THB(grandTotal)})`}
            </button>
            <div className="text-sm text-gray-500">
              By continuing to payment, I agree to TripMate’s{" "}
              <a className="underline" href="#">
                Terms of Use
              </a>{" "}
              and{" "}
              <a className="underline" href="#">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
