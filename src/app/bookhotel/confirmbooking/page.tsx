"use client";

import { useState, useEffect } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import Link from "next/link";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';
import { endpoints, BASE_URL } from '@/config/endpoints.config'; 
import Cookies from "js-cookie"; 
import axios from "axios"; 
import { AiFillStar } from "react-icons/ai";


import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th"; 
import "react-datepicker/dist/react-datepicker.css"; 

// ----------------------------------------------------
// Type Definitions (เหมือนเดิม)
// ----------------------------------------------------

type RoomOption = {
  id: string; // (subserviceid / optionId)
  roomId: string;
  hotelId: string;
  name: string;
  bed: string;
  maxGuest: number;
  price: string; 
};

type HotelRoom = {
  id: string;
  options: RoomOption[]; 
  hotelId: string;
  pricePerNight: string;
  bedType: string;
  personPerRoom: number;
  description: string;
  image: string;
  facilities: string[];
  name: string;
  pictures: string[];
  sizeSqm: number;
};

type HotelData = {
  id: string;
  rooms: HotelRoom[]; 
  name: string;
  description: string;
  rating: string;
  image: string;
  breakfast: string;
  checkIn: string;
  checkOut: string;
  locationSummary: string;
  petAllow: boolean;
  pictures: string[];
  star: number;
  subtopicRatings: {
    value: number;
    [key: string]: number;
  };
  type: string;
  service: {
    serviceImg: string;
    [key: string]: any;
  };
};

export type UserInfo = {
  id: string;
  fname: string; 
  lname: string; 
  email: string;
  phone?: string;
  role?: string;
};

type DiscountData = {
  id: string; 
  type: 'percent' | 'fixed'; 
  value: number; 
};

// ----------------------------------------------------
registerLocale("th", th);

// --- (ตัวแปร UI - เหมือนเดิม) ---
const formRows = [
  ["First name*", "Last name*"],
  ["Email*", "Phone number (optional)"],
];
const specialRequests = {
  roomType: ["Non-smoking", "Smoking"] as const,
  bedSize: ["Large bed", "Twin beds"] as const,
};
// ...


export default function ConfirmBookingHotelPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  // --- (States - เหมือนเดิม) ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomType, setRoomType] = useState<"Non-smoking" | "Smoking" | "">("");
  const [bedSize, setBedSize] = useState<"Large bed" | "Twin beds" | "">("");
  const [promo, setPromo] = useState("");
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true); 
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountData | null>(null);
  const [selectedOption, setSelectedOption] = useState<RoomOption | null>(null);
  const [note, setNote] = useState(""); // (State สำหรับ Note)

  // -------------------------------------------------------------------
  // [Effect] ดึงข้อมูลโรงแรมและห้องพัก (เหมือนเดิม)
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchHotelData = async () => {
      const hotelId = searchParams.get('service_id');
      const roomId = searchParams.get('room_id');
      const groupId = searchParams.get('group_id'); 

      console.log(`Fetching data for: serviceId=${hotelId}, roomId=${roomId}, groupId=${groupId}`);

      if (!hotelId || !roomId || !groupId) {
        setErrorMsg("ไม่พบข้อมูลจำเป็น (hotelId, roomId, หรือ groupId) ใน URL");
        setIsDataLoading(false);
        return;
      }

      try {
        setIsDataLoading(true);
        const response = await axios.get(
          `${endpoints.hotel.detail(hotelId)}`
        );
        
        const hotel: HotelData = response.data;
        const room = hotel.rooms.find(r => r.id === roomId);
        
        if (!room) {
          throw new Error("ไม่พบข้อมูลห้องพักที่ระบุ");
        }

        setHotelData(hotel);
        setSelectedRoom(room);

        if (room.options && room.options.length > 0) {
          setSelectedOption(room.options[0]); 
          console.log("Defaulting to first room option:", room.options[0]);
        } else {
          console.warn("Selected room has no options available.");
          setErrorMsg("ห้องพักนี้ไม่มีตัวเลือกราคา (Options)");
        }

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg(`ไม่สามารถโหลดข้อมูลโรงแรมได้: ${msg}`);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchHotelData();
  }, [searchParams]);

  // [Effect] คำนวณจำนวนคืน (เหมือนเดิม)
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      if (checkOutDate > checkInDate) {
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNumberOfNights(diffDays);
      } else {
        setNumberOfNights(0);
      }
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  
  // [ฟังก์ชัน fetchDiscount] (แก้ Bug `value` เป็น String)
  async function fetchDiscount() {
    const code = promo.trim(); 
    if (!code) {
      setErrorMsg("Please enter a promo code.");
      return;
    }
    setSubmitting(true); 
    setErrorMsg(null);
    setAppliedDiscount(null); 
    try {
      const response = await axios.get(
        endpoints.discount.detail(code), 
        { headers: { Authorization: `Bearer ${Cookies.get("token") || ""}` } }
      );

      console.log("Discount data:", response.data);

      const rawDiscount = response.data; 
      const parsedValue = parseFloat(rawDiscount.value); // ⭐️ [FIX] แปลง String เป็น Number

      if (rawDiscount.type !== 'percent' && rawDiscount.type !== 'fixed') {
        throw new Error("Invalid discount type received from API.");
      }
      if (isNaN(parsedValue)) { 
         throw new Error("Invalid discount value received from API (value is not a number).");
      }
      
      const discount: DiscountData = {
          id: rawDiscount.id,
          type: rawDiscount.type,
          value: parsedValue // ⭐️ (ใช้ค่าที่แปลงแล้ว)
      };

      setAppliedDiscount(discount);
      setPromo(""); 
      alert(`Applied discount: ${discount.id}`);

    } catch (err) {
      console.error("Fetch discount error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Invalid promo code or failed to apply.");
      setAppliedDiscount(null);
    } finally {
      setSubmitting(false);
    }
  }

  // [Logic คำนวณราคาสรุป] (เหมือนเดิม)
  const roomPricePerNight = Number(selectedOption?.price || 0);
  const basePrice = roomPricePerNight * numberOfNights;
  let discountAmount = 0;
  if (appliedDiscount && numberOfNights > 0) { 
    if (appliedDiscount.type === 'percent') {
      discountAmount = basePrice * (appliedDiscount.value / 100);
    } else { 
      discountAmount = appliedDiscount.value;
    }
    if (discountAmount > basePrice) {
      discountAmount = basePrice;
    }
  }
  const discountedBasePrice = basePrice - discountAmount;
  const vatAmount = discountedBasePrice * 0.07; 
  const serviceChargeAmount = discountedBasePrice * 0.10; 
  const totalPrice = discountedBasePrice + vatAmount + serviceChargeAmount;

  // (ฟังก์ชัน validate - เหมือนเดิม)
  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter first and last name.";
    if (!email.trim()) return "Please enter your email.";
    if (!checkInDate || !checkOutDate) return "กรุณาเลือกวันเช็คอินและเช็คเอาท์";
    if (numberOfNights <= 0) return "วันเช็คเอาท์ต้องอยู่หลังวันเช็คอิน";
    return null;
  };

  type ConfirmResponse = { bookingId?: string };

  // ⭐️ [2. อัปเดต handleConfirm] (Payload ใหม่ทั้งหมด)
  const handleConfirm = async () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    if (!selectedOption) {
      setErrorMsg("กรุณาเลือกตัวเลือกห้องพัก (Room Option)");
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      // ⭐️ [FIX] สร้าง Payload ใหม่ตามที่ API ร้องขอ
      const bookingPayload: any = {
        serviceId: hotelData?.id || "",
        subServiceId: selectedRoom?.id || "", // ⭐️ [FIX] เพิ่ม 'subServiceId' (Room ID)
        optionId: selectedOption?.id || "", 
        groupId: searchParams.get('group_id') || "",
        startBookingDate: checkInDate?.toISOString() || "",
        endBookingDate: checkOutDate?.toISOString() || "",
        note: note.trim(), // (ใช้ State 'note')
        paymentMethod: "CASH", 
        discountId: appliedDiscount?.id || null, 
      };

      // (ทำความสะอาด Payload - ลบ discountId ถ้ามันเป็น null)
      if (!bookingPayload.discountId) {
        delete bookingPayload.discountId;
      }

      const apiEndpoint = `${BASE_URL}/booking`; 
      
      console.log("Sending booking data to API:", apiEndpoint, bookingPayload);

      const response = await axios.post(apiEndpoint, bookingPayload, {
        headers: {
           Authorization: `Bearer ${Cookies.get("token") || ""}`, 
        },
      });

      const responseData = response.data as ConfirmResponse;
      const newBookingId = responseData?.booking.id;

      console.log("API created booking successfully:", newBookingId);

      // if (!newBookingId) {
      //   throw new Error("API did not return a bookingId.");
      // }
      router.push(`/bookhotel/payment?bookingId=${newBookingId}`);

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (axios.isAxiosError(e) && e.response) {
        setErrorMsg(`Error from server: ${e.response.data?.message || msg}`);
      } else {
        setErrorMsg(msg || "Something went wrong during booking creation.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // (ฟังก์ชัน handleUseAccountInfoChange - เหมือนเดิม)
  const handleUseAccountInfoChange = async (isChecked: boolean) => {
    setUseAccountInfo(isChecked);
    setErrorMsg(null); 
    if (!isChecked) {
      setFirstName("");
      setLastName("");
      setEmail("");
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
      console.log("Fetched profile data:", profileData);

      setFirstName(profileData.fname.split(" ")[0] || "" ); 
      setLastName(profileData.lname.split(" ")[0] || ""  ); 
      setEmail(profileData.email || "");
      setPhone(profileData.phone || ""); 

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
      setUseAccountInfo(false); 
    } finally {
      setIsFetchingProfile(false);
    }
  };

  // --- (ฟังก์ชัน Render แถบขวา - เหมือนเดิม) ---
  const renderRightSidebar = () => {
    if (isDataLoading) {
      return (
        <div className="flex flex-col gap-2.5 w-full lg:w-[384px]">
          {/* (Loading Skeleton) */}
          <div className="bg-white rounded-[10px] p-4 animate-pulse">
            <div className="h-48 w-full bg-gray-200 rounded-md"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded-md mt-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded-md mt-2"></div>
          </div>
        </div>
      );
    }

    if (!hotelData || !selectedRoom) {
      return (
        <div className="flex flex-col gap-2.5 w-full lg:w-[384px]">
          <div className="bg-white rounded-[10px] p-4 text-red-500">
            {errorMsg || "ไม่สามารถโหลดข้อมูลโรงแรมได้"}
          </div>
        </div>
      );
    }

    // --- (JSX แถบขวา) ---
    return (
      <div className="flex flex-col gap-2.5 w-full lg:w-[384px]">
        {/* --- 1. การ์ดข้อมูลโรงแรม --- */}
        <div className="bg-white rounded-[10px]">
          <div className="p-2.5 rounded-[10px] flex flex-col sm:flex-row gap-2.5">
            <img 
              src={hotelData.pictures[5] || hotelData.service.serviceImg} 
              alt={hotelData.name}
              className="w-full sm:w-44 h-44 rounded-[10px] bg-gray-200 object-cover" 
            />
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col gap-1">
                <div className="text-gray-900 text-base md:text-lg font-semibold">
                  {hotelData.name}
                </div>
                <div className="w-14 h-3 flex">
                  {Array.from({ length: hotelData.star || 5 }).map((_, i) => (
                    <div key={i} className="flex-1 flex items-center px-[1px]">
                      <AiFillStar className="text-yellow-400"/>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {/* [FIX toFixed Bug] */}
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                    {typeof hotelData.subtopicRatings?.value === 'number'
                      ? hotelData.subtopicRatings.value.toFixed(1)
                      : hotelData.rating}
                  </span>
                  <span className="text-sky-700 text-xs">{/* (Excellent) */}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  <span className="line-clamp-2">{hotelData.locationSummary}</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                  {hotelData.type}
                </div>
              </div>
            </div>
          </div>

          {/* --- 2. การ์ดข้อมูลห้อง (แสดงรายละเอียด Option) --- */}
          <div className="px-2.5 pb-2.5">
            <div className="min-h-36 px-2 pt-2 pb-1 bg-gray-50 rounded-[10px] relative">
              <div className="h-full flex flex-col sm:flex-row gap-1.5">
                <img 
                  src={selectedRoom.pictures[2] || selectedRoom.image} 
                  alt={selectedRoom.name}
                  className="w-full sm:w-28 h-28 sm:h-auto rounded-[10px] bg-gray-200 object-cover" 
                />
                <div className="flex flex-col justify-center">
                  <div className="text-gray-900 text-sm font-medium">
                    {selectedRoom.name}
                  </div>
                  {/* (แสดงรายละเอียดจาก Option ที่เลือก) */}
                  <div className="pt-1.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <span>{selectedOption?.name || selectedRoom.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <span>{selectedOption?.bed || selectedRoom.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <span>{selectedOption?.maxGuest || selectedRoom.personPerRoom} คน</span>
                    </div>
                  </div>
                </div>
              </div>
              {hotelData.breakfast && (
                <div className="mt-1 w-40 flex items-center gap-1 text-xs text-green-600">
                  <div className="w-4 h-3 bg-green-500" /> 
                  <span>รวมอาหารเช้า ({hotelData.breakfast})</span>
                </div>
              )}
              <div className="absolute right-2 bottom-2 text-xs text-gray-700">x 1</div>
            </div>
          </div>
        </div>

        {/* --- 3. การ์ดปฏิทิน (เหมือนเดิม) --- */}
        <div className="bg-white rounded-[10px] px-4 md:px-5 py-3.5 flex flex-col gap-3">
          <div className="text-gray-900 text-lg md:text-xl font-bold">Select Dates</div>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600">Check-in</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()} 
                locale="th"
                dateFormat="d MMM yyyy"
                placeholderText="เลือกวันเช็คอิน"
                className="w-full h-10 rounded-md border border-neutral-200 px-3"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600">Check-out</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()} 
                locale="th"
                dateFormat="d MMM yyyy"
                placeholderText="เลือกวันเช็คเอาท์"
                className="w-full h-10 rounded-md border border-neutral-200 px-3"
                disabled={!checkInDate} 
              />
            </div>
          </div>
        </div>

        {/* --- 4. การ์ดสรุปราคา (ฉบับอัปเดต - เหมือนเดิม) --- */}
        <div className="bg-white rounded-[10px] px-4 md:px-5 py-2.5 flex flex-col gap-3.5">
          <div className="text-gray-900 text-lg md:text-xl font-bold">Price Details</div>

          {numberOfNights > 0 ? (
            <>
              {/* (ราคาห้อง) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 text-sm font-medium">
                    1 ห้อง ({numberOfNights} {numberOfNights > 1 ? 'คืน' : 'คืน'})
                  </div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-sm font-normal">฿</span>
                    <span className="text-gray-900 text-sm font-medium">{basePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* (ส่วนลด) */}
              {appliedDiscount && discountAmount > 0 && (
                <div className="flex items-start justify-between text-red-600">
                  <div className="text-sm font-medium">
                    Discount ({appliedDiscount.id})
                  </div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-sm font-normal">-฿</span>
                    <span className="text-sm font-medium">{discountAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              {/* (Subtotal) */}
              {appliedDiscount && discountAmount > 0 && (
                 <div className="flex items-start justify-between pt-1 border-t border-gray-100">
                  <div className="text-gray-900 text-sm font-medium">
                    Subtotal
                  </div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-sm">฿</span>
                    <span className="text-gray-900 text-sm font-medium">{discountedBasePrice.toFixed(2)}</span>
                  </div>
                 </div>
              )}

              {/* (Taxes & fees) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 text-sm font-medium">Taxes & fees</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-sm">฿</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {(vatAmount + serviceChargeAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pl-4 md:pl-5 flex items-start justify-between">
                  <div className="text-gray-500 text-xs">VAT (7%)</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-xs">฿</span>
                    <span className="text-gray-500 text-xs">{vatAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pl-4 md:pl-5 flex items-start justify-between">
                  <div className="text-gray-500 text-xs">Service charge (10%)</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-xs">฿</span>
                    <span className="text-gray-500 text-xs">{serviceChargeAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* (Total) */}
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="text-gray-900 text-sm md:text-base font-bold">Total</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-sm md:text-base">฿</span>
                  <span className="text-gray-900 text-sm md:text-base font-bold">
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              กรุณาเลือกวันเช็คอินและเช็คเอาท์เพื่อดูราคาสรุป
            </div>
          )}
        </div>
      </div>
    );
  };


  // =================================================================
  // (JSX หลักของ Component)
  // =================================================================
  return (
    <div>
      <BookNavbar book_state={1}/>

      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 lg:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="flex flex-col gap-0.5 mb-4 md:mb-5">
          <div className="text-gray-900 text-xl md:text-2xl font-extrabold">Hotel Booking</div>
          <div className="text-gray-500 text-base md:text-lg font-semibold"></div>
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
                      onChange={(e) => handleUseAccountInfoChange(e.target.checked)} 
                      disabled={isFetchingProfile} 
                    />
                    <span className="text-gray-500 text-sm md:text-base font-medium">
                      {isFetchingProfile ? "กำลังโหลด..." : "use my account info"}
                    </span>
                  </label>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  Please make sure that your name matched your ID and the contacts are correct.
                </p>
              </div>
              <div className="flex flex-col gap-4 md:gap-5">
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
                    onChange={(e) => setPhone(e.target.value)} // ⭐️ [FIX] แก้ e.g.target.value
                  />
                </div>
              </div>
            </section>

            {/* (Select Room Option) */}
            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-2">
                <div className="text-gray-900 text-lg md:text-xl font-bold">Select Room Option</div>
                <p className="text-gray-500 text-sm md:text-base">
                  Please select your preferred room plan.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                {isDataLoading ? (
                  <div className="text-gray-500">Loading options...</div>
                ) : (
                  selectedRoom?.options?.map((option) => (
                    <label 
                      key={option.id} 
                      className={`flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${selectedOption?.id === option.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white hover:bg-gray-50'}
                      `}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="roomOption"
                            value={option.id}
                            checked={selectedOption?.id === option.id}
                            onChange={() => {
                              setSelectedOption(option);
                              console.log("Selected option:", option);
                            }}
                            className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-gray-900 font-medium">{option.name}</span>
                        </div>
                        <div className="pl-6 text-sm text-gray-600">
                          <div>Bed: {option.bed}</div>
                          <div>Max Guests: {option.maxGuest}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ฿{Number(option.price).toFixed(2)}
                      </div>
                    </label>
                  ))
                )}
                {(!isDataLoading && (!selectedRoom?.options || selectedRoom.options.length === 0)) && (
                  <div className="text-gray-500">No options available for this room.</div>
                )}
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

            {/* (Section for Note) */}
            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <div className="text-gray-900 text-lg md:text-xl font-bold">Additional Note</div>
                  <div className="text-gray-500 text-sm md:text-base font-medium">(optional)</div>
                </div>
              </div>
              <textarea
                name="note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Want a high-floor room? Any allergies? Let us know."
                className="w-full px-3 py-2 bg-white rounded-[10px] border-2 border-neutral-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                  onClick={fetchDiscount}
                  disabled={submitting}
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold disabled:bg-gray-400"
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
                disabled={submitting || numberOfNights <= 0} 
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

          {/* --- (เรียกใช้ฟังก์ชัน Render แถบขวา) --- */}
          {renderRightSidebar()}

        </div>

        {/* Mobile CTA (เติมส่วนที่ขาด) */}
        <div className="block xl:hidden bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 flex flex-col gap-2.5">
          <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || numberOfNights <= 0}
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

      </main> 
    </div> 
  );
}