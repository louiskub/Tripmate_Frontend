"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';
import { endpoints, BASE_URL } from "@/config/endpoints.config";

// ===== Types =====
type AddonKey = "deposit" | "deliveryLocal" | "deliveryOuter" | "insurance";

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
    promoAmountOff?: number;
    total: number;
    currency: "THB";
    bookingId: string;
  };
};

type CreateRentalBookingResp =
  | { success: true; bookingId: string; total: number }
  | { success: false; message?: string };

type UserInfo = {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  role?: string;
};

type PromoValidateReq = {
  code: string;
  context: {
    baseBeforeDiscount: number;
    baseAfterDiscount: number;
    addonsPerDay: Record<AddonKey, number>;
    days: number;
  };
};
type PromoValidateResp = {
  success: boolean;
  message?: string;
  amountOff?: number;
  percentOff?: number;
};

type HourWindow = { start: string; end: string }; // "09:00" - "17:00"
type HourlyAvailability = Record<string, HourWindow[]>; // key = "YYYY-MM-DD"

type CarData = {
  name: string;
  id: string;
  crcId: string;
  type: string | null;
  pricePerDay: string; // e.g. "1600"
  pricePerHour?: string; // e.g. "250"
  model: string;
  description: string;
  seats: number;
  pictures: string[];
  createdAt: string | null;
  updatedAt: string | null;
  availability: Record<string, boolean>;
  hourlyAvailability?: HourlyAvailability; // (optional) รายชั่วโมงต่อวัน
  brand: string;
  currency: "THB";
  deposit: string;
  doors: number;
  features: string[];
  fuelType: string;
  fuelPolicy: string | null;
  pickupLocation: string | null;
  insurance: {
    coverage: string;
    provider: string;
    deductible: number;
    validUntil: string;
  };
  luggage: number;
  mileageLimitKm: number;
  transmission: string;
  year: number;
  chargeMode?: "perDay" | "perHour";
};

export function generateBookingId(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    // สุ่ม index จาก 0 ถึง (charactersLength - 1)
    const randomIndex = Math.floor(Math.random() * charactersLength);
    
    // ดึงตัวอักษรจาก index ที่สุ่มได้
    result += characters.charAt(randomIndex);
  }

  return result;
}

// ===== Utils =====
const THB = (n: number) =>
  new Intl.NumberFormat("en-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const ceilDiv = (a: number, b: number) => Math.ceil(a / b);

const toDate = (v: string) => new Date(v); // expects ISO string from <input type="datetime-local">

// ตรวจว่า dateTime (HH:mm ของมัน) อยู่ภายใน window ใด window หนึ่งของวันนั้นไหม
function insideAnyWindow(dt: Date, windows: HourWindow[] | undefined): boolean {
  if (!windows?.length) return true; // ถ้าไม่ได้ส่งตารางว่างรายชั่วโมงมา ก็ถือว่าได้
  const hh = dt.getHours().toString().padStart(2, "0");
  const mm = dt.getMinutes().toString().padStart(2, "0");
  const t = `${hh}:${mm}`;
  return windows.some((w) => w.start <= t && t <= w.end);
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

// ===== Page =====
export default function RentalCarConfirmBookingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // URL param (CarId ตัวใหญ่)
  const CarId = useMemo(() => sp.get("CarId") ?? "", [sp]);

  // --- Car data state ---
  const [carData, setCarData] = useState<CarData | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  // --- Customer state ---
  const [useAccountInfo, setUseAccountInfo] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // --- Addons state ---
  const [addons, setAddons] = useState<Record<AddonKey, boolean>>({
    deposit: false,
    deliveryLocal: false,
    deliveryOuter: true,
    insurance: true,
  });

  // --- Promo state (แสดงตลอด) ---
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoAppliedOffAmt, setPromoAppliedOffAmt] = useState<number>(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState<boolean>(false);

  // --- Note/UI ---
  const [note, setNote] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ===== Load car data =====
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      if (!CarId) {
        setErrorMsg("ไม่พบ CarId ใน URL");
        setPageLoading(false);
        return;
      }
      try {
        setPageLoading(true);
        setErrorMsg(null);
        const res = await axios.get(`${BASE_URL}${endpoints.rental_car.detail(CarId)}`, {
          signal: ac.signal,
        });
        const data: CarData = (res.data?.data ?? res.data) as CarData;
        if (!data) throw new Error("ไม่พบข้อมูลรถยนต์");
        setCarData(data);
      } catch (e) {
        if (!ac.signal.aborted) {
          const msg =
            (axios.isAxiosError(e) &&
              e.response?.data &&
              (e.response.data as { message?: string }).message) ||
            (e instanceof Error ? e.message : "ไม่สามารถโหลดข้อมูลรถยนต์ได้");
          setErrorMsg(msg);
        }
      } finally {
        if (!ac.signal.aborted) setPageLoading(false);
      }
    })();
    return () => ac.abort();
  }, [CarId]);

  // ===== Time selection & pricing mode =====
  const hasHourly = useMemo(() => !!(carData && Number(carData.pricePerHour || 0) > 0), [carData]);
  const [pricingMode, setPricingMode] = useState<"perDay" | "perHour">("perDay");

  useEffect(() => {
    if (carData?.chargeMode === "perHour" || carData?.chargeMode === "perDay") {
      setPricingMode(carData.chargeMode);
    }
  }, [carData]);

  const [startAt, setStartAt] = useState<string>(""); // datetime-local (ISO without Z)
  const [endAt, setEndAt] = useState<string>("");

  const msHour = 60 * 60 * 1000;
  const msDay = 24 * msHour;

  const durationMs = useMemo(() => {
    if (!startAt || !endAt) return 0;
    const s = toDate(startAt);
    const e = toDate(endAt);
    const d = e.getTime() - s.getTime();
    return d > 0 ? d : 0;
  }, [startAt, endAt]);

  // ตรวจความพร้อมชั่วโมง (ถ้ามี hourlyAvailability)
  const hourlyTip = useMemo(() => {
    if (!carData?.hourlyAvailability || !startAt || !endAt) return null;
    const s = toDate(startAt);
    const e = toDate(endAt);
    const sKey = dateKey(s);
    const eKey = dateKey(e);
    const okStart = insideAnyWindow(s, carData.hourlyAvailability[sKey]);
    const okEnd = insideAnyWindow(e, carData.hourlyAvailability[eKey]);
    if (!okStart || !okEnd) {
      return "Selected time is outside available hours for this day.";
    }
    return null;
  }, [carData?.hourlyAvailability, startAt, endAt]);

  // จำนวนวัน/ชั่วโมงตามกติกา
  const computedDays = useMemo(() => {
    if (pricingMode === "perHour") {
      // แปลงชั่วโมง→วันสำหรับคิดค่า addon ต่อวัน
      const hours = Math.ceil(durationMs / msHour); // เกิน 1 นาที → ปัดเป็น 1 ชม.
      return Math.max(1, ceilDiv(hours, 24));
    }
    if (durationMs === 0) return 1;
    return Math.max(1, ceilDiv(durationMs, msDay)); // ภายใน 24 ชม. = 1 วัน / เกิน 1 นาทีของ 24 ชม. = 2 วัน
  }, [pricingMode, durationMs]);

  const computedHours = useMemo(() => {
    if (pricingMode === "perHour") return Math.max(1, Math.ceil(durationMs / msHour));
    return 0;
  }, [pricingMode, durationMs]);

  // ===== Derived prices =====
  const pricePerDay = useMemo(() => Number(carData?.pricePerDay ?? 0), [carData]);
  const pricePerHour = useMemo(() => Number(carData?.pricePerHour ?? 0), [carData]);

  const baseBeforeDiscount = useMemo(() => {
    if (pricingMode === "perHour") {
      return pricePerHour * computedHours;
    }
    return pricePerDay * computedDays;
  }, [pricingMode, pricePerDay, pricePerHour, computedDays, computedHours]);

  const basePrice = baseBeforeDiscount;
  const baseDiscount = 0; // ยังไม่รองรับส่วนลดพื้นฐาน

  // ราคา Addons ต่อวัน
  const addonPricesPerDay: Record<AddonKey, number> = useMemo(
    () => ({
      deposit: Number(carData?.deposit ?? 1000),
      deliveryLocal: 500,
      deliveryOuter: 1000,
      insurance: 500,
    }),
    [carData]
  );

  const addonsTotalPerDay = useMemo(() => {
    let sum = 0;
    (Object.keys(addons) as AddonKey[]).forEach((k) => {
      if (addons[k]) sum += addonPricesPerDay[k];
    });
    return sum;
  }, [addons, addonPricesPerDay]);

  const addonsTotalAllDays = addonsTotalPerDay * computedDays;
  const subtotal = basePrice + addonsTotalAllDays;
  const [promoLocked, setPromoLocked] = useState(false);
  const grandTotal = Math.max(0, subtotal - (promoLocked ? promoAppliedOffAmt : 0));

  // ===== Handlers =====
  const toggleAddon = useCallback((k: AddonKey) => {
    setAddons((prev) => ({ ...prev, [k]: !prev[k] }));
  }, []);

  const handleUseAccountInfoChange = async (isChecked: boolean) => {
    setUseAccountInfo(isChecked);
    setErrorMsg(null);
    if (!isChecked) {
      setFirstName("");
      setLastName("");
      setPhone("");
      return;
    }
    setIsFetchingProfile(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("ไม่พบข้อมูลล็อกอิน (กรุณาล็อกอินใหม่)");

      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));
      const userId = decoded.sub || decoded.id;
      if (!userId) throw new Error("Token ไม่ถูกต้อง");

      const response = await axios.get(endpoints.user.profile(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data as UserInfo;
      setFirstName(profileData.fname?.split(" ")[0] || "");
      setLastName(profileData.lname?.split(" ")[0] || "");
      setPhone(profileData.phone || "");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
      setUseAccountInfo(false);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const applyPromo = useCallback(async () => {
    setPromoMsg(null);
    setErrorMsg(null);
    setPromoLoading(true);
    setPromoAppliedOffAmt(0);
    setPromoLocked(false);
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
          addonsPerDay: addonPricesPerDay,
          days: computedDays,
        },
      };

      const res = await axios.post<PromoValidateResp>("/api/promo/validate", body, {
        headers: { "Content-Type": "application/json" },
      });
      const json = res.data;

      if (!json.success) {
        setPromoMsg(json.message || "Invalid promo code.");
        return;
      }

      let off = 0;
      if (typeof json.amountOff === "number") off = json.amountOff;
      else if (typeof json.percentOff === "number")
        off = (subtotal * Math.min(Math.max(json.percentOff, 0), 100)) / 100;

      off = Math.min(off, subtotal);
      setPromoAppliedOffAmt(off);
      setPromoLocked(true);
      setPromoMsg(json.message || "Promo applied.");
    } catch (e) {
      const msg =
        (axios.isAxiosError(e) &&
          e.response?.data &&
          (e.response.data as { message?: string }).message) ||
        (e instanceof Error ? e.message : "Invalid promo code.");
      setPromoMsg(msg);
    } finally {
      setPromoLoading(false);
    }
  }, [promoCode, baseBeforeDiscount, basePrice, addonPricesPerDay, computedDays, subtotal]);

  const validateForm = (): string | null => {
    if (!startAt || !endAt) return "Please select pick-up and drop-off datetime.";
    if (durationMs <= 0) return "Drop-off must be after pick-up.";
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (!/^\+?\d[\d\s\-]{6,}$/.test(phone.trim())) return "Phone number looks invalid.";
    return null;
  };

  const handleConfirmBooking = useCallback(async () => {
    try {
      setErrorMsg(null);
      const v = validateForm();
      if (v) {
        setErrorMsg(v);
        return;
      }
      setSubmitting(true);

      const selectedAddons = (Object.keys(addons) as AddonKey[]).filter((k) => addons[k]);
      const bookingid = document.getElementById("bookingid") as HTMLInputElement;

      const payload: CreateRentalBookingBody = {
        customer: { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() },
        note: note.trim() || undefined,
        addons: selectedAddons,
        days: computedDays, // ส่งจำนวนวันตามที่คำนวณ (perHour จะถูก ceil เป็นวันสำหรับ addons ไปแล้ว)
        pricing: {
          baseBefore: baseBeforeDiscount,
          baseAfter: basePrice,
          addonsPerDay: addonPricesPerDay,
          promoCode: promoLocked ? promoCode.trim() : undefined,
          promoAmountOff: promoLocked ? promoAppliedOffAmt : undefined,
          total: grandTotal,
          currency: "THB",
          bookingId: bookingid.value
        },
      };

      const res = await axios.post<CreateRentalBookingResp>(`${endpoints.book}`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const json = res.data;

      if (!json.success) throw new Error(json.message || "Cannot create booking.");

      const bookingId = json.bookingId;
      const total = json.total ?? grandTotal;

      router.push(
        `/bookrentalcar/payment?bookingId=${(bookingid.value)})}`
      );
    } catch (e) {
      const msg =
        (axios.isAxiosError(e) &&
          e.response?.data &&
          (e.response.data as { message?: string }).message) ||
        (e instanceof Error ? e.message : "Cannot create booking.");
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  }, [
    addons,
    firstName,
    lastName,
    phone,
    note,
    computedDays,
    baseBeforeDiscount,
    basePrice,
    addonPricesPerDay,
    promoLocked,
    promoCode,
    promoAppliedOffAmt,
    grandTotal,
    router,
  ]);

  // ===== Safe values for rendering =====
  const cover = carData?.pictures?.[0] ?? "/placeholder.svg?width=176&height=176";
  const carName = carData?.name ?? "—";
  const carSeats = carData?.seats ?? 0;
  const carTransmission = carData?.transmission ?? "—";
  const carFuel = carData?.fuelType ?? "—";
  const carPickup = carData?.pickupLocation ?? "Default Location";
  const firstFeature = carData?.features?.[0];

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20 md:pb-0">
      <BookNavbar book_state={1} />
      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 xl:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24">
          {/* Title */}
          <div className="flex flex-col gap-0.5 mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">Rental Car Booking</h1>
            <p id="bookingid" className="text-lg font-semibold text-gray-500">Booking ID: {generateBookingId()}</p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          {hourlyTip && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {hourlyTip}
            </div>
          )}

          {/* 2 Columns */}
          <div className="flex flex-col xl:flex-row gap-3">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Customer Info */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Customer Info</h2>
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      checked={useAccountInfo}
                      onChange={(e) => void handleUseAccountInfoChange(e.target.checked)}
                      disabled={isFetchingProfile}
                    />
                    <span className="text-base font-medium text-gray-500">
                      use my account info {isFetchingProfile ? "(loading…)" : ""}
                    </span>
                  </label>
                </div>

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
              </section>

              {/* Time selection + pricing mode */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Pick-up & Drop-off</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded-md border border-neutral-200 bg-neutral-50 text-slate-700">
                      {pricingMode === "perDay" ? "Charge Per Day" : "Charge Per Hour"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pick-up (date & time)</label>
                    <input
                      type="datetime-local"
                      className="w-full h-11 rounded-[10px] border border-neutral-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={startAt}
                      onChange={(e) => setStartAt(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Drop-off (date & time)</label>
                    <input
                      type="datetime-local"
                      className="w-full h-11 rounded-[10px] border border-neutral-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={endAt}
                      onChange={(e) => setEndAt(e.target.value)}
                      min={startAt || undefined}
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-700">
                  {pricingMode === "perDay" ? (
                    <>Calculated days: <b>{computedDays}</b> day(s)</>
                  ) : (
                    <>
                      Calculated hours: <b>{computedHours}</b> hour(s) · counted days for addons:{" "}
                      <b>{computedDays}</b>
                    </>
                  )}
                </div>
              </section>

              {/* Additional Services */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Additional Services</h2>
                    <span className="text-base text-gray-500">(optional · per day)</span>
                  </div>
                </div>

                <div className="w-full flex flex-col xl:flex-row items-start gap-5">
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
                      <span className="text-lg font-extrabold text-slate-900">
                        {addonPricesPerDay.deposit.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">/day</span>
                    </div>
                  </button>

                  <div className="hidden xl:block w-px h-36 bg-neutral-200" />

                  {/* Delivery */}
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

                  <div className="hidden xl:block w-px h-36 bg-neutral-200" />

                  {/* Insurance */}
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
                      <span className="text-lg font-extrabold text-slate-900">
                        {addonPricesPerDay.insurance.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">/day</span>
                    </div>
                  </button>
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

              {/* Promo (แสดงตลอด) */}
              <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col gap-3">
                <div className="text-lg sm:text-xl font-bold text-slate-900">Promo Code</div>
                <div className="w-full flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoLocked(false);
                      setPromoAppliedOffAmt(0);
                      setPromoMsg(null);
                    }}
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 h-10 rounded-[10px] border border-gray-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    disabled={promoLoading}
                    onClick={() => void applyPromo()}
                    className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {promoLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
                {promoMsg && <div className="text-sm text-slate-700">{promoMsg}</div>}
              </section>

              {/* CTA Desktop (ซ้ำปุ่มด้านล่างสำหรับจอใหญ่) */}
              <section className="hidden md:block w-full rounded-[10px] bg-white p-6 space-y-2">
                <div className="-mt-2 text-sm font-medium text-sky-700">You won’t be charged yet</div>
                <button
                  type="button"
                  onClick={() => void handleConfirmBooking()}
                  disabled={submitting}
                  className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-sm md:text-base font-bold shadow transition-all duration-300 hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                >
                  {submitting ? "Processing…" : `Confirm Booking (฿${THB(grandTotal)})`}
                </button>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="w-full xl:max-w-[384px] flex flex-col gap-2.5">
              {/* Car Card */}
              <div className="rounded-[10px] bg-white border border-neutral-200 p-2.5 flex gap-2.5 items-start">
                <img
                  src={cover || "/placeholder.svg"}
                  alt={carName}
                  className="w-32 h-32 rounded-[10px] bg-gray-200 object-cover object-center flex-shrink-0"
                />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="text-lg font-semibold text-slate-900 break-words">{carName}</div>
                  <div className="text-sm text-gray-600">
                    {carSeats} seats | {carTransmission} | {carFuel}
                  </div>
                  <div className="flex items-center gap-1 mt-auto">
                    <div className="w-2.5 h-3 bg-slate-900" />
                    <span className="text-xs text-slate-900">{carPickup}</span>
                  </div>
                  {firstFeature && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium whitespace-nowrap">
                        {firstFeature}
                      </span>
                    </div>
                  )}
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
                      {pricingMode === "perHour"
                        ? `Rental (${computedHours} hour${computedHours > 1 ? "s" : ""})`
                        : `Rental (${computedDays} day${computedDays > 1 ? "s" : ""})`}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">{THB(basePrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">
                      Additional Services ({computedDays} day{computedDays > 1 ? "s" : ""})
                    </div>
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

                {/* Summary total */}
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
        </div>
      </main>

      {/* Fixed bottom bar for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur shadow-[0_-2px_12px_rgba(0,0,0,0.08)] p-3">
        <button
          type="button"
          onClick={() => void handleConfirmBooking()}
          disabled={submitting}
          className="inline-flex w-full h-12 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
        >
          {submitting ? "Processing…" : `Confirm Booking (฿${THB(grandTotal)})`}
        </button>
      </div>

      {/* Overlay Loader */}
      {pageLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="animate-pulse text-slate-700">Loading car details…</div>
        </div>
      )}
    </div>
  );
}
