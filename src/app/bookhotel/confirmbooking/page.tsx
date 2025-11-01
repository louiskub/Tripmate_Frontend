"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Statenav from "@/components/navbar/statenav";
import Cookies from "js-cookie";
import { useEffect } from "react";

export type UserInfo = {
  id: string; 
  name: string;
  email: string;
  role?: string;
};

export function useAccountInfo() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // 1️⃣ อ่าน token จาก cookie (เช่น 'access_token')
        const token = Cookies.get("access_token");
        if (!token) throw new Error("No token found in cookies");

        // 2️⃣ decode JWT เพื่อหา userId (optional)
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const userId = decoded.sub || decoded.id;
        if (!userId) throw new Error("Invalid token payload");

        // 3️⃣ เรียก API พร้อม Bearer token
        const res = await fetch(`/api/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = (await res.json()) as UserInfo;
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

  return { user, loading, error };
}

const formRows = [
  ["First name*", "Last name*"],
  ["Email*", "Phone number (optional)"],
];

const specialRequests = {
  roomType: ["Non-smoking", "Smoking"] as const,
  bedSize: ["Large bed", "Twin beds"] as const,
};

const priceDetailsMain = [{ label: "1 room (1 night)", amount: "4,412.00" }];
const priceDetailsBefore = [
  { label: "price before discount", amount: "5,786.74", discount: false },
  { label: "discount", amount: "1,374.74", discount: true },
];
const taxesAndFees = [
  { label: "VAT", amount: "4,412.00" },
  { label: "Service charge", amount: "4,412.00", strong: true },
];

export default function ConfirmBookingHotelPage() {
  const router = useRouter();

  // --- Main guest form ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // --- Special request (single-select radios) ---
  const [roomType, setRoomType] = useState<"Non-smoking" | "Smoking" | "">("");
  const [bedSize, setBedSize] = useState<"Large bed" | "Twin beds" | "">("");

  // --- Misc ---
  const [promo, setPromo] = useState("");
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter first and last name.";
    if (!email.trim()) return "Please enter your email.";
    if (!roomType) return "Please select a room type.";
    if (!bedSize) return "Please select a bed size.";
    return null;
  };

  type ConfirmResponse = { bookingId?: string };

  const handleConfirm = async () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("firstName", firstName);
      form.append("lastName", lastName);
      form.append("email", email);
      if (phone) form.append("phone", phone);
      form.append("roomType", roomType); // union รวม "" ก็ยังเป็น string
      form.append("bedSize", bedSize);
      if (promo) form.append("promo", promo);
      form.append("useAccountInfo", String(useAccountInfo));

      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        body: form,
        // credentials: "include", // ถ้าใช้ cookie JWT
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data: ConfirmResponse = await res.json();
      const bookingId = data?.bookingId ?? "";

      // ส่งต่อไปหน้า payment พร้อม query (บังคับให้เป็น string เสมอ)
      const qs = new URLSearchParams({
        bookingId,
        roomType: roomType || "",
        bedSize: bedSize || "",
      }).toString();

      router.push(`/bookhotel/payment?${qs}`);
    } catch (e) {
      // e เป็น unknown -> แปลงเป็นข้อความอย่างปลอดภัย
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Statenav />

      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 lg:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="flex flex-col gap-0.5 mb-4 md:mb-5">
          <div className="text-gray-900 text-xl md:text-2xl font-extrabold">Hotel Booking</div>
          <div className="text-gray-500 text-base md:text-lg font-semibold">Make sure bla bla</div>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="max-w-[1240px] mx-auto mb-3 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-4 md:gap-2.5">
          {/* Left */}
          <div className="flex flex-col gap-4 md:gap-5 pb-2.5">
            {/* Main guest */}
            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-gray-900 text-lg md:text-xl font-bold">Main Guest</div>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                      checked={useAccountInfo}
                      onChange={(e) => setUseAccountInfo(e.target.checked)}
                    />
                    <span className="text-gray-500 text-sm md:text-base font-medium">
                      use my account info
                    </span>
                  </label>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  Please make sure that your name matched your ID and the contacts are correct.
                </p>
              </div>

              <div className="flex flex-col gap-4 md:gap-5">
                {/* First & Last name */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                  <input
                    className="flex-1 min-w-24 h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First name*"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    className="flex-1 min-w-24 h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last name*"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Email & Phone */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                  <input
                    type="email"
                    className="flex-1 min-w-24 h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="flex-1 min-w-24 h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Special Request */}
            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <div className="text-gray-900 text-lg md:text-xl font-bold">Special Request</div>
                  <div className="text-gray-500 text-sm md:text-base font-medium">(optional)</div>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  The hotel will do its best, but can not guarantee to fulfill all the requests.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Room type (radio) */}
                <div className="flex-1 flex flex-col gap-3 md:gap-4">
                  <div className="text-gray-900 text-sm md:text-base font-bold">Room type</div>
                  <div className="flex flex-wrap gap-3">
                    {specialRequests.roomType.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="roomType"
                          value={opt}
                          checked={roomType === opt}
                          onChange={(e) => setRoomType(e.target.value as typeof roomType)}
                          className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-gray-600 text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bed size (radio) */}
                <div className="flex-1 flex flex-col gap-3 md:gap-4">
                  <div className="text-gray-900 text-sm md:text-base font-bold">Bed size</div>
                  <div className="flex flex-wrap gap-3">
                    {specialRequests.bedSize.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="bedSize"
                          value={opt}
                          checked={bedSize === opt}
                          onChange={(e) => setBedSize(e.target.value as typeof bedSize)}
                          className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-gray-600 text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Promo */}
            <section
              data-property-1="Variant2"
              className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-3 overflow-hidden"
            >
              <div className="self-stretch flex justify-between items-center">
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
                  onClick={() => {/* ใส่ logic ตรวจโปรโมโค้ดถ้าต้องการ */}}
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold"
                >
                  Apply
                </button>
              </label>
            </section>

            {/* Desktop CTA */}
            <div className="hidden xl:block rounded-[10px] py-5.5 px-4 bg-white space-y-2.5">
              <div className="-mt-2 text-sm font-medium text-sky-700">You won’t be charged yet</div>
              <button
                type="button"
                onClick={handleConfirm}
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

          {/* Right card */}
          <div className="flex flex-col gap-2.5 w-full lg:w-[384px]">
            <div className="bg-white rounded-[10px]">
              <div className="min-h-48 p-2.5 rounded-[10px] flex flex-col sm:flex-row gap-2.5">
                <div className="w-full sm:w-44 h-44 rounded-[10px] bg-gradient-to-b from-gray-300 to-gray-400" />
                <div className="flex-1 flex">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-gray-900 text-base md:text-lg font-semibold">
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
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                        10.0
                      </span>
                      <span className="text-sky-700 text-xs">Excellent</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <div className="w-2.5 h-3 bg-gray-900" />
                      <span>location</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                      type
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-2.5 pb-2.5">
                <div className="min-h-36 px-2 pt-2 pb-1 bg-gray-50 rounded-[10px] relative">
                  <div className="h-full flex flex-col sm:flex-row gap-1.5">
                    <div className="w-full sm:w-28 h-28 sm:h-auto rounded-[10px] bg-gradient-to-b from-gray-300 to-gray-400" />
                    <div className="flex flex-col justify-center">
                      <div className="text-gray-900 text-sm font-medium">
                        Mirage Premium Explorer King View,sea
                      </div>
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

            <div className="bg-white rounded-[10px] px-4 md:px-5 py-2.5 flex flex-col gap-3.5">
              <div className="text-gray-900 text-lg md:text-xl font-bold">Price Details</div>

              <div className="flex flex-col gap-1.5">
                {priceDetailsMain.map((row) => (
                  <div key={row.label} className="flex items-start justify-between">
                    <div className="text-gray-900 text-sm font-medium">{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-500 text-sm font-normal">฿</span>
                      <span className="text-gray-900 text-sm font-medium">{row.amount}</span>
                    </div>
                  </div>
                ))}

                {priceDetailsBefore.map((row, i) => (
                  <div key={i} className="pl-4 md:pl-5 flex items-start justify-between">
                    <div className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      {row.discount && <span className="text-red-500 text-xs">-</span>}
                      <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>฿</span>
                      <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>
                        {row.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 text-sm font-medium">Taxes & fees</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-sm">฿</span>
                    <span className="text-gray-900 text-sm font-medium">4,412.00</span>
                  </div>
                </div>

                {taxesAndFees.map((row) => (
                  <div key={row.label} className="pl-4 md:pl-5 flex items-start justify-between">
                    <div className="text-gray-500 text-xs">{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-500 text-xs">฿</span>
                      <span className={`text-xs ${row.strong ? "text-gray-900" : "text-gray-500"}`}>{row.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="text-gray-900 text-sm md:text-base font-bold">Total</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-sm md:text-base">฿</span>
                  <span className="text-gray-900 text-sm md:text-base font-bold">5,192.92</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="block xl:hidden bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 flex flex-col gap-2.5">
          <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex w-full h-10 items-center justify-center rounded-[10px] bg-sky-600 text-white text-base font-bold shadow transition-all hover:scale-[1.02] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
          >
            {submitting ? "Processing..." : "Confirm Booking"}
          </button>
          <div className="text-sm text-gray-500">
            By continuing to payment, I agree to TripMate’s{" "}
            <Link className="underline" href="#">Terms of Use</Link>{" "}and{" "}
            <Link className="underline" href="#">Privacy Policy</Link>.
          </div>
        </div>
      </main>
    </div>
  );
}
