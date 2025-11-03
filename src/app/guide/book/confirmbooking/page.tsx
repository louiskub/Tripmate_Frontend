"use client";

// (Imports เดิม)
import { useState, useEffect } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';

// (Imports ใหม่)
import { endpoints, BASE_URL } from "@/config/endpoints.config";
import axios from "axios";
import Cookies from "js-cookie";

// ---- Types (จากโค้ดเดิม) ----
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
    fromISO: string;
    toISO: string; 
    hours: number;
    guests: number;
  };
  item: {
    guideId: string; 
    title: string; 
    baseHours?: number;
  };
  price: {
    before: number; 
    discount: number;
    total: number;
    currency: "THB";
  };
  status: "pending" | "successed" | "cancelled";
};

type ConfirmGuideResponse = {
  success: boolean;
  bookingId?: string;
  message?: string;
};

// --- (Type ที่อัปเดต) ---
type GuideAvailability = {
  mon_fri: string; // "09:00-18:00"
  weekend: string; // "09:00-16:00"
  blackoutDates?: string[]; // ["2025-12-31"]
};

type GuideData = {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: string;
    hourlyRate: string; // "500"
    dayRate: string; // "3000" 
    overtimeRate: string; // "700"
    pictures: string[];
    locationSummary: string;
    languages: string[];
    availability: GuideAvailability; 
};
// --- (สิ้นสุด Type ที่อัปเดต) ---

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

// ---- (Type ใหม่สำหรับ User Profile) ----
export type UserInfo = {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string; 
  role?: string;
};

// --- (Helper ใหม่) ---
const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + (minutes || 0);
};


export default function ConfirmGuideBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  // ----- UI constants -----
  const customerInfoRows: string[][] = [
    ["First name*", "Last name*"],
    ["Phone number *"],
  ];

  // ----- Form states (เดิม) -----
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
  const [guests, setGuests] = useState<number>(1); // (Default 2)

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 
  const [guideData, setGuideData] = useState<GuideData | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(true);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [calculatedHours, setCalculatedHours] = useState(0);
  
  // --- (อัปเดต PriceDetails State) ---
  const [priceDetails, setPriceDetails] = useState({
    basePricePerPerson: 0, // (ราคาไกด์ต่อคน)
    discount: 0, 
    total: 0, // (ราคาสุทธิ x Guest)
    regularHours: 0,
    otHours: 0,
  });
  const [timeError, setTimeError] = useState<string | null>(null); 
  const [isDayRate, setIsDayRate] = useState(false); 

  // ----- Helpers (เดิม) -----
  const toISO = (dateStr: string, timeStr: string) => {
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

  // -----------------------------------------------------------------
  // (Effect) 1. ดึงข้อมูล Guide เมื่อหน้าโหลด (แก้ไขแล้ว)
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchGuideData = async () => {
      const guideId = searchParams.get('guideId');
      if (!guideId) {
        setErrorMsg("ไม่พบ ID ของไกด์ใน URL");
        setIsLoadingGuide(false);
        return;
      }

      try {
        setIsLoadingGuide(true);
        // --- (✅ แก้ไขแล้ว: ลบ BASE_URL ที่ซ้ำซ้อน) ---
        const response = await axios.get(
          endpoints.guide.detail(guideId) 
        );
        setGuideData(response.data as GuideData);
      } catch (err) {
        let msg = "Something went wrong.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setErrorMsg(`ไม่สามารถดึงข้อมูลไกด์ได้: ${msg}`);
      } finally {
        setIsLoadingGuide(false);
      }
    };
    
    void fetchGuideData();
  }, [searchParams]);

  
  // --- (ฟังก์ชันเช็คเวลา) ---
  const validateTimes = (): string | null => {
    if (!fromDate || !fromTime || !toDate || !toTime) {
      return null; 
    }
    
    if (fromDate !== toDate) {
        return "Multi-day bookings are not supported. Please select a start and end time on the same day.";
    }

    const hours = diffHours(toISO(fromDate, fromTime), toISO(toDate, toTime));
    if (hours <= 0) {
      return "End time must be after start time.";
    }

    if (guideData && guideData.availability) {
      const selectedDate = new Date(fromDate);
      const dayOfWeek = selectedDate.getDay(); 
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      
      const blackoutDates = guideData.availability.blackoutDates || [];
      if (blackoutDates.includes(fromDate)) {
        return `Guide is unavailable on ${fromDate}. Please select a different date.`;
      }

      const availabilityString = isWeekend 
        ? guideData.availability.weekend 
        : guideData.availability.mon_fri;
      
      const [availStart, availEnd] = availabilityString.split('-'); 
      if (!availStart || !availEnd) {
        return "Could not verify guide's availability times.";
      }
      
      // (Logic เช็ค OT 4 ชม.)
      const maxOTHours = 4;
      const availEndMinutes = timeToMinutes(availEnd);
      const hardStopMinutes = availEndMinutes + (maxOTHours * 60);
      const toTimeMinutes = timeToMinutes(toTime);
      
      const hardStopHour = Math.floor(hardStopMinutes / 60);
      const hardStopMin = hardStopMinutes % 60;
      const hardStopTimeStr = `${String(hardStopHour).padStart(2, '0')}:${String(hardStopMin).padStart(2, '0')}`;
      
      if (fromTime < availStart) {
        return `Time is outside availability. Guide is active ${availStart} - ${availEnd} on this day.`;
      }
      if (toTimeMinutes > hardStopMinutes) {
        return `Booking exceeds maximum overtime (4 hours). Guide's latest end time is ${hardStopTimeStr}.`;
      }
    }
    
    return null; // ไม่มีปัญหา
  };

  // -----------------------------------------------------------------
  // (Effect) 2. คำนวณราคา
  // -----------------------------------------------------------------
  useEffect(() => {
    const timeValidationResult = validateTimes();
    setTimeError(timeValidationResult); 

    const fromISO = toISO(fromDate, fromTime);
    const toISOv = toISO(toDate, toTime);
    const hours = diffHours(fromISO, toISOv);
    setCalculatedHours(hours);

    let isDayRateApplied = false; 
    let regularHoursBilled = 0;
    let otHoursBilled = 0;
    let basePricePerPerson = 0; // (ราคาต่อคน)

    if (hours > 0 && guideData && !timeValidationResult && guests > 0) {
      const hourlyRate = Number(guideData.hourlyRate) || 0;
      const dayRate = Number(guideData.dayRate) || 0; 
      const overtimeRate = Number(guideData.overtimeRate) || hourlyRate; 

      // --- (Logic เช็ค Day Rate) ---
      if (guideData.availability && fromDate === toDate) { 
          const selectedDate = new Date(fromDate);
          const dayOfWeek = selectedDate.getDay(); 
          const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
          const availabilityString = isWeekend 
            ? guideData.availability.weekend 
            : guideData.availability.mon_fri;
          const [availStart, availEnd] = availabilityString.split('-');

          if (fromTime === availStart && toTime === availEnd && dayRate > 0) {
            basePricePerPerson = dayRate; 
            isDayRateApplied = true; 
            regularHoursBilled = hours;
          }
      }

      // --- (Fallback คำนวณ OT) ---
      if (!isDayRateApplied) {
          const fromMinutes = timeToMinutes(fromTime);
          const toMinutes = timeToMinutes(toTime);
          
          const selectedDate = new Date(fromDate);
          const dayOfWeek = selectedDate.getDay(); 
          const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
          const availabilityString = isWeekend 
            ? guideData.availability.weekend 
            : guideData.availability.mon_fri;
          const [availStart, availEnd] = availabilityString.split('-');
          const availEndMinutes = timeToMinutes(availEnd);

          const regularMinutes = Math.max(0, Math.min(toMinutes, availEndMinutes) - fromMinutes);
          const otMinutes = Math.max(0, toMinutes - availEndMinutes);

          regularHoursBilled = Math.ceil(regularMinutes / 60);
          otHoursBilled = Math.ceil(otMinutes / 60); 

          basePricePerPerson = (regularHoursBilled * hourlyRate) + (otHoursBilled * overtimeRate); 
      }

      const discount = 0; 
      const total = (basePricePerPerson * guests) - discount; // (คูณ GUESTS)

      setPriceDetails({
        basePricePerPerson: basePricePerPerson, 
        discount: discount,
        total: total, 
        regularHours: regularHoursBilled,
        otHours: otHoursBilled,
      });

    } else {
      setPriceDetails({ basePricePerPerson: 0, discount: 0, total: 0, regularHours: 0, otHours: 0 });
    }
    
    setIsDayRate(isDayRateApplied); 

  }, [fromDate, fromTime, toDate, toTime, guideData, promo, guests]); 


  // ----- Validation (อัปเดต) -----
  const validate = (): string | null => {
    // (เช็คฟอร์มพื้นฐาน)
    if (!firstName.trim() || !lastName.trim()) return "Please enter first and last name.";
    if (!phone.trim()) return "Please enter phone number.";
    if (!Number.isFinite(guests) || guests < 1) return "Guests must be at least 1.";

    if (timeError) {
      return timeError; // ถ้ามี error เรื่องเวลา, ส่งต่อ error นั้นเลย
    }
    if (calculatedHours <= 0) return "Please select a valid date and time range.";
    return null; // (ถ้าผ่านหมด)
  };


  // -----------------------------------------------------------------
  // (✅ แก้ไข Error 500 "Invalid URL") ฟังก์ชัน: ดึงข้อมูลบัญชีผู้ใช้
  // -----------------------------------------------------------------
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

      // --- (✅ ลบ BASE_URL ที่ซ้ำซ้อนออก) ---
      const response = await axios.get(
        endpoints.user.profile(userId), // <== ✅ (แก้ไขแล้ว)
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // --- (สิ้นสุดการแก้ไข) ---

      const profileData = response.data as UserInfo;
      setFirstName(profileData.fname.split(" ")[0] || "" ); 
      setLastName(profileData.lname.split(" ")[0] || ""  );
      setPhone(profileData.phone || ""); 

    } catch (err) {
      let msg = "Something went wrong.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMsg(msg || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
      setUseAccountInfo(false); 
    } finally {
      setIsFetchingProfile(false);
    }
  };
  // --- 🔼 (สิ้นสุดการแก้ไข) 🔼 ---


  // ----- Submit (✅ อัปเดต: แก้ URL + แก้ Price) -----
  const handleConfirm = async () => {
    router.push(`/guide/book/payment`);
    // (ตรวจสอบ validation เป็นครั้งสุดท้ายก่อน submit)
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
          hours: calculatedHours, 
          guests,
        },
        item: {
          guideId: guideData?.id || "N/A", 
          title: guideData?.name || "Guide",
        },
        price: { 
          before: priceDetails.basePricePerPerson * guests, // (ส่งราคารวม)
          discount: priceDetails.discount,
          total: priceDetails.total,
          currency: "THB",
        },
        status: "pending",
      };

      // (✅ ลบ BASE_URL ที่ซ้ำซ้อนออก)
      const res = await axios.post(
        endpoints.book, // <== ✅ (แก้ไขแล้ว)
        payload, 
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = res.data as ConfirmGuideResponse;

      if (!data.success || !data.bookingId) {
        throw new Error(data.message || "Failed to create guide booking.");
      }

      const bookingid = document.getElementById("bookingid") as HTMLInputElement;
      

    } catch (e: unknown) {
      let msg = "Something went wrong.";
      if (axios.isAxiosError(e)) {
        msg = e.response?.data?.message || e.message;
      } else if (e instanceof Error) {
        msg = e.message;
      } else {
        msg = String(e);
      }
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const dis = promo;
  // console.log("promo code:", dis);
  async function fetchDiscount() {
    const discount = await axios.get(
            `${BASE_URL}${endpoints.discount.all}`
          ); 
        // console.log("discount data:", discount.data);
      // if (discount.data.id = dis) {
      //   const discount = await axios.get(
      //       `${BASE_URL}${endpoints.discount.detail(dis)}`
      //     );
      // }
  }

  // =================================================================
  // (JSX)
  // =================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={1}/>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5 flex flex-col justify-start items-start gap-5">
        {/* Header text */}
        <div className="flex flex-col justify-center items-start gap-0.5">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-extrabold">Guide Booking</h1>
          <p className="text-gray-600 text-base sm:text-lg font-semibold">Booking ID : {generateBookingId()}</p>
        </div>

        {/* --- (เพิ่ม Banner สำหรับ Time Error) --- */}
        {timeError && (
          <div className="w-full max-w-[1240px] rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm text-yellow-800">
            {timeError}
          </div>
        )}

        {/* Error banner (สำหรับตอน Submit) */}
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
                  <label className="py-px flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                      name="useAccountInfo"
                      checked={useAccountInfo}
                      onChange={(e) => handleUseAccountInfoChange(e.target.checked)} 
                      disabled={isFetchingProfile} 
                    />
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      {isFetchingProfile ? "Loading..." : "use my account info"}
                    </span>
                  </label>
                </div>
                <p className="text-gray-600 text-sm sm:text-base font-medium">
                  Please make sure that your name matches your id and the contacts are correct.
                </p>
              </div>
              <div className="flex flex-col gap-5">
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

            {/* Note (เอากลับมาแล้ว) */}
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

            {/* Promo Code (เอากลับมาแล้ว) */}
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
                  onClick={() => {fetchDiscount();}}
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold"
                >
                  Apply
                </button>
              </label>
            </section>

            {/* Footer actions (Desktop) (เอากลับมาแล้ว) */}
            <div className="hidden xl:block self-stretch rounded-[10px] py-5.5 px-4 bg-white space-y-2.5">
              <div className="-mt-2 text-sm font-medium text-sky-700">You won’t be charged yet</div>
              
              {/* --- (อัปเดตปุ่ม) --- */}
              <button
                type="submit"
                disabled={submitting || !!timeError} // <== disable ถ้ามี timeError
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
            
            {/* --- Loading State --- */}
            {isLoadingGuide && (
              <div className="w-full p-4 bg-white rounded-[10px] animate-pulse">
                <div className="w-full h-44 bg-gray-200 rounded-md"></div>
                <div className="w-3/4 h-6 bg-gray-200 rounded-md mt-3"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded-md mt-2"></div>
              </div>
            )}

            {/* --- Loaded State --- */}
            {guideData && (
              <>
                {/* Guide card (Dynamic) */}
                <section className="self-stretch min-h-[192px] p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 flex flex-col sm:flex-row gap-2.5">
                  <img
                    src={guideData.pictures[0] || guideData.image}
                    alt={guideData.name}
                    className="w-full sm:w-44 h-44 object-cover rounded-[10px] bg-gray-200"
                  />
                  <div className="flex-1 flex justify-between">
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-[3px]">
                        <div className="w-3 h-3 flex flex-col overflow-hidden">
                          <div className="self-stretch h-3 bg-gray-600" />
                        </div>
                        <div className="text-gray-600 text-xs">Guide</div>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap content-center">
                        <div className="text-slate-900 text-base sm:text-lg font-semibold">{guideData.name}</div>
                      </div>
                      <div className="flex items-center gap-[3px]">
                        <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex items-center gap-1">
                          <div className="text-blue-700 text-xs font-medium">{guideData.rating}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-[3px]">
                        <div className="w-2.5 h-3 bg-slate-900" />
                        <div className="text-slate-900 text-xs">{guideData.locationSummary}</div>
                      </div>
                      <div className="flex items-center gap-[3px]">
                        <div className="w-3 h-3 relative overflow-hidden">
                          <div className="w-3 h-3 left-0 top-0 absolute bg-slate-900" />
                        </div>
                        <div className="text-slate-900 text-xs">{guideData.languages.join(", ")}</div>
                      </div>
                      {/* --- (แสดงเวลาไกด์) --- */}
                      <div className="mt-2 text-xs text-gray-600">
                        <div>Mon-Fri: {guideData.availability.mon_fri}</div>
                        <div>Weekend: {guideData.availability.weekend}</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* From / To section (Dynamic Hours + Validation) */}
                <section className="self-stretch p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-center gap-3">
                  <div className="self-stretch flex flex-col sm:flex-row items-center gap-1.5">
                    {/* From Column */}
                    <div className="w-full sm:flex-1 flex flex-col gap-2.5 overflow-hidden">
                      <label className="text-gray-600 text-xs" htmlFor="from-date">From</label>
                      <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                        <input id="from-date" name="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium focus:outline-none" />
                      </div>
                      <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                        <input id="from-time" name="from-time" type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-medium focus:outline-none" />    
                      </div>
                    </div>

                    {/* Hours (Dynamic) */}
                    <div className="flex flex-col items-center gap-2 overflow-hidden">
                      <div className="text-slate-900 text-xs sm:text-sm font-medium text-center">
                        {calculatedHours > 0 ? calculatedHours.toFixed(1) : "-"}
                        <br />hours
                      </div>
                      <div className="w-4 h-4 p-px flex justify-center items-center overflow-hidden">
                        <div className="w-4 h-3.5 bg-slate-900" />
                      </div>
                    </div>
                    
                    {/* To Column */}
                    <div className="w-full sm:flex-1 flex flex-col gap-2.5 overflow-hidden">
                      <label className="text-gray-600 text-xs" htmlFor="to-date">To</label>
                      <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                        {/* --- (Validation) --- */}
                        <input 
                          id="to-date" 
                          name="to-date" 
                          type="date" 
                          value={toDate} 
                          min={fromDate} // <== (ป้องกันเลือกวันก่อนหน้า)
                          onChange={(e) => setToDate(e.target.value)} 
                          className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium focus:outline-none" 
                        />
                      </div>
                      <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                        {/* --- (Validation) --- */}
                        <input 
                          id="to-time" 
                          name="to-time" 
                          type="time" 
                          value={toTime} 
                          min={toDate === fromDate ? fromTime : undefined} // <== (ป้องกันเลือกเวลาก่อนหน้า)
                          onChange={(e) => setToTime(e.target.value)} 
                          className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-medium focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* --- ✅ (Guest Input ที่แก้ไขแล้ว) --- */}
                  <div className="mx-1 self-stretch flex items-center gap-3.5">
                    <label className="text-slate-900 text-xs sm:text-sm font-medium" htmlFor="guests">
                      Guest *
                    </label>
                    
                    {/* (ใช้ Flexbox แทน div เดิม) */}
                    <div className="flex-1 h-7 flex items-center gap-0">
                      {/* (ปุ่มลบ) */}
                      <button
                        type="button"
                        onClick={() => setGuests(prev => (prev > 1 ? prev - 1 : 1))}
                        disabled={guests <= 1}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xl font-light hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease guests"
                      >
                        -
                      </button>

                      {/* (Input ที่พิมพ์ไม่ได้) */}
                      <input
                        id="guests"
                        name="guests"
                        type="text" // (เปลี่ยนเป็น text)
                        readOnly // (เพิ่ม readOnly)
                        value={guests}
                        className="w-12 text-center bg-transparent text-slate-900 text-sm sm:text-base font-semibold focus:outline-none"
                      />

                      {/* (ปุ่มเพิ่ม) */}
                      <button
                        type="button"
                        onClick={() => setGuests(prev => prev + 1)} 
                        // (คุณสามารถเพิ่ม max ได้ถ้าต้องการ เช่น disabled={guests >= 10})
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xl font-light hover:bg-gray-200"
                        aria-label="Increase guests"
                      >
                        +
                      </button>
                    </div>

                  </div>
                </section>

                {/* Price Details (Dynamic) */}
                <section className="w-full px-4 sm:px-5 py-2.5 bg-white rounded-[10px] flex flex-col items-center gap-3.5">
                  <div className="self-stretch flex justify-between">
                    <div className="text-slate-900 text-lg sm:text-xl font-bold">Price Details</div>
                  </div>

                  {calculatedHours > 0 ? (
                    <>
                      <div className="self-stretch flex flex-col gap-1.5">
                        
                        {/* --- (Logic การแสดงผลราคาแบบใหม่) --- */}
                        {isDayRate ? (
                          // (กรณี Day Rate)
                          <div className="flex justify-between">
                            <div className="text-slate-900 text-xs sm:text-sm font-medium">
                              Guide ({calculatedHours.toFixed(1)} hours)
                              <span className="text-green-600 font-normal ml-1">(count as rate per day)</span>
                            </div>
                            <div className="flex items-start gap-0.5">
                              <span className="text-gray-600 text-xs sm:text-sm">฿</span>
                              <span className="text-slate-900 text-xs sm:text-sm font-medium">
                                {formatTHB(priceDetails.basePricePerPerson)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          // (กรณีคิดรายชั่วโมง + OT)
                          <>
                            {priceDetails.regularHours > 0 && (
                              <div className="flex justify-between">
                                <div className="text-slate-900 text-xs sm:text-sm font-medium">
                                  Guide (Regular: {priceDetails.regularHours} hours)
                                </div>
                                <div className="flex items-start gap-0.5">
                                  <span className="text-gray-600 text-xs sm:text-sm">฿</span>
                                  <span className="text-slate-900 text-xs sm:text-sm font-medium">
                                    {formatTHB(priceDetails.regularHours * (Number(guideData.hourlyRate) || 0))}
                                  </span>
                                </div>
                              </div>
                            )}
                            {priceDetails.otHours > 0 && (
                              <div className="flex justify-between">
                                <div className="text-slate-900 text-xs sm:text-sm font-medium">
                                  Guide (Overtime: {priceDetails.otHours} hours)
                                </div>
                                <div className="flex items-start gap-0.5">
                                  <span className="text-gray-600 text-xs sm:text-sm">฿</span>
                                  <span className="text-slate-900 text-xs sm:text-sm font-medium">
                                    {formatTHB(priceDetails.otHours * (Number(guideData.overtimeRate) || Number(guideData.hourlyRate) || 0))}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {/* --- (สิ้นสุด Logic ใหม่) --- */}

                        {/* --- (แถว Guest) --- */}
                        <div className="flex justify-between">
                          <div className="text-slate-900 text-xs sm:text-sm font-medium">
                            Guests
                          </div>
                          <div className="flex items-start gap-0.5">
                            <span className="text-gray-600 text-xs sm:text-sm">x</span>
                            <span className="text-slate-900 text-xs sm:text-sm font-medium">
                              {guests}
                            </span>
                          </div>
                        </div>
                        {/* --- (สิ้นสุดแถว Guest) --- */}

                        {priceDetails.discount > 0 && (
                          <div className="pl-3 sm:pl-5 flex justify-between">
                            <div className="text-gray-600 text-[10px] sm:text-xs">discount</div>
                            <div className="flex items-start gap-px">
                              <span className="text-red-500 text-[10px] sm:text-xs">-</span>
                              <span className="text-red-500 text-[10px] sm:text-xs">฿</span>
                              <span className="text-red-500 text-[10px] sm:text-xs">{formatTHB(priceDetails.discount)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="self-stretch h-px bg-gray-200" />

                      <div className="self-stretch flex justify-between items-center">
                        <div className="text-slate-900 text-sm sm:text-base font-bold">Total</div>
                        <div className="flex items-start gap-0.5">
                          <span className="text-gray-600 text-sm sm:text-base">฿</span>
                          <span className="text-slate-900 text-sm sm:text-base font-bold">
                            {formatTHB(priceDetails.total)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Please select start and end time to see the price.</p>
                  )}
                </section>
              </>
            )}
            
          </aside>

          {/* CTA for mobile (เอากลับมาแล้ว) */}
          <div className="block xl:hidden w-full bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 space-y-2.5">
            <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
            
            {/* --- (อัปเดตปุ่ม) --- */}
            <button
              type="submit"
              disabled={submitting || !!timeError} // <== disable ถ้ามี timeError
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