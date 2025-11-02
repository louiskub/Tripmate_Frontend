"use client";

import { useState, useEffect } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import Link from "next/link";
import BookNavbar from '@/components/navbar/default-nav-variants/book-navbar';
import { endpoints, BASE_URL } from '@/config/endpoints.config'; 
import Cookies from "js-cookie"; 
import axios from "axios"; 

import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th"; // <== ✅ (แก้ไขแล้ว)
import "react-datepicker/dist/react-datepicker.css"; 

// ----------------------------------------------------
// Type Definitions
// ----------------------------------------------------
type HotelRoom = {
  id: string;
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
  rooms: HotelRoom[];
  service: {
    serviceImg: string;
    [key: string]: any;
  };
  status: "pending" | "successed" | "cancelled";
};

export type UserInfo = {
  id: string;
  fname: string; 
  lname: string; 
  email: string;
  phone?: string;
  role?: string;
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

// ----------------------------------------------------
// (ลงทะเบียนภาษาไทยให้ DatePicker)
registerLocale("th", th);

// --- ✅ (เพิ่มตัวแปรที่หายไปกลับมา) ---
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
// --- ✅ (สิ้นสุดส่วนที่เพิ่มกลับมา) ---


export default function ConfirmBookingHotelPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  // --- Main guest form (เหมือนเดิม) ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // --- Special request (เหมือนเดิม) ---
  const [roomType, setRoomType] = useState<"Non-smoking" | "Smoking" | "">("");
  const [bedSize, setBedSize] = useState<"Large bed" | "Twin beds" | "">("");

  // --- Misc (เหมือนเดิม) ---
  const [promo, setPromo] = useState("");
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // --- (State ใหม่สำหรับข้อมูลโรงแรม, ห้องพัก, และปฏิทิน) ---
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true); 
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState(0);

  // -------------------------------------------------------------------
  // [Effect] ดึงข้อมูลโรงแรมและห้องพักเมื่อหน้าโหลด
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchHotelData = async () => {
      // const hotelId = searchParams.get('hotelId');
      // const roomId = searchParams.get('roomId');

      //mock data
      const hotelId = "svc_001";
      const roomId = "rm103";

      if (!hotelId || !roomId) {
        setErrorMsg("ไม่พบข้อมูลโรงแรมหรือห้องพัก (hotelId หรือ roomId)");
        setIsDataLoading(false);
        return;
      }

      try {
        setIsDataLoading(true);
        const response = await axios.get(
          `${BASE_URL}${endpoints.hotel.detail(hotelId)}`
        );
        console.log("Fetched hotel data:", response.data);
        
        const hotel: HotelData = response.data;
        const room = hotel.rooms.find(r => r.id === roomId);
        
        console.log("hotel pic:", response.data.pictures[5]);

        if (!room) {
          throw new Error("ไม่พบข้อมูลห้องพักที่ระบุ");
        }

        setHotelData(hotel);
        setSelectedRoom(room);

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg(`ไม่สามารถโหลดข้อมูลโรงแรมได้: ${msg}`);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchHotelData();
  }, [searchParams]);

  // -------------------------------------------------------------------
  // [Effect] คำนวณจำนวนคืน เมื่อวันที่เปลี่ยน
  // -------------------------------------------------------------------
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

  

  // -------------------------------------------------------------------
  // [Logic] คำนวณราคาสรุป
  // -------------------------------------------------------------------
  // const roomPricePerNight = Number(selectedRoom?.pricePerNight || 0);
  const roomPricePerNight = 2500; //mock data
  const basePrice = roomPricePerNight * numberOfNights;
  const vatAmount = basePrice * 0.07; // สมมติ VAT 7%
  const serviceChargeAmount = basePrice * 0.10; // สมมติ Service Charge 10%
  const totalPrice = basePrice + vatAmount + serviceChargeAmount;

  // (ฟังก์ชัน validate)
  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter first and last name.";
    if (!email.trim()) return "Please enter your email.";
    
    if (!checkInDate || !checkOutDate) return "กรุณาเลือกวันเช็คอินและเช็คเอาท์";
    if (numberOfNights <= 0) return "วันเช็คเอาท์ต้องอยู่หลังวันเช็คอิน";
    return null;
  };

  type ConfirmResponse = { bookingId?: string };

  // (ฟังก์ชัน handleConfirm)
  // (ฟังก์ชัน handleConfirm ที่แก้ไขแล้ว)
  const handleConfirm = async () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      // 1. ⭐️ สร้าง Object (Payload) ที่จะส่งไป API
      //    (นี่คือข้อมูลที่ก่อนหน้านี้อยู่ใน URLSearchParams)
      const bookingPayload = {
        // ข้อมูลโรงแรมและห้อง
        hotelId: hotelData?.id || "",
        roomId: selectedRoom?.id || "",
        
        // ข้อมูลการจอง
        checkIn: checkInDate?.toISOString() || "",
        checkOut: checkOutDate?.toISOString() || "",
        nights: numberOfNights,
        totalPrice: totalPrice,
        status: "pending", // Backend อาจจะกำหนดเองก็ได้

        // ข้อมูลคำขอพิเศษ
        roomType: roomType || "",
        bedSize: bedSize || "",

        // 🚨 (สำคัญมาก) เพิ่มข้อมูล Guest ที่กรอกในฟอร์มไปด้วย
        // API ของคุณจะต้องใช้ข้อมูลนี้
        guestDetails: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone || "", // ส่งเป็นค่าว่างถ้าไม่มี
        }
      };

      // 2. ⭐️ เรียกใช้ axios.post
      // ‼️ (หมายเหตุ) คุณต้องสร้าง Endpoint นี้ขึ้นมาเองใน Backend
      // และเพิ่มลงใน 'endpoints.config.js'
      // เช่น: const apiEndpoint = `${BASE_URL}${endpoints.booking.create}`;
      
      const apiEndpoint = `${BASE_URL}/booking`; // <-- ❗️ (ตัวอย่าง) แก้เป็น Endpoint จริงของคุณ
      
      console.log("Sending booking data to API:", apiEndpoint, bookingPayload);

      // ส่งข้อมูลไปที่ Backend
      const response = await axios.post(apiEndpoint, bookingPayload, {
        headers: {
          // (ถ้า API นี้ต้องใช้ Token ก็ใส่)
          // Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
      });

      // 3. ⭐️ (ทางเลือก) จัดการข้อมูลที่ API ตอบกลับมา
      // API ที่ดีควรตอบ ID ของการจองที่เพิ่งสร้างกลับมา
      const responseData = response.data as ConfirmResponse; // (สมมติว่ามี type ConfirmResponse)
      const newBookingId = responseData?.bookingId;

      console.log("API created booking successfully:", newBookingId);

      // 4. ⭐️ นำทางไปยังหน้า Payment
      // (ถ้าหน้า Payment ต้องใช้ ID ให้ส่งไปด้วย)
      // router.push(`/hotel/book/payment?bookingId=${newBookingId}`);
      
      // (หรือไปหน้า Payment ตามโค้ดเดิมของคุณ ถ้าไม่ต้องการส่ง ID)
      const bookingid = document.getElementById("bookingid") as HTMLInputElement;
      router.push(`/hotel/book/payment?bookingId=${(bookingid.value)})}`);

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // (ถ้า error มาจาก axios)
      if (axios.isAxiosError(e) && e.response) {
        setErrorMsg(`Error from server: ${e.response.data?.message || msg}`);
      } else {
        setErrorMsg(msg || "Something went wrong during booking creation.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // (ฟังก์ชัน handleUseAccountInfoChange)
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
        headers: {
          Authorization: `Bearer ${token}`, 
        },
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

  // --- (ฟังก์ชัน Render แถบขวา) ---
  const renderRightSidebar = () => {
    if (isDataLoading) {
      return (
        <div className="flex flex-col gap-2.5 w-full lg:w-[384px]">
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
                      <div className="h-2.5 w-full bg-sky-600" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                    {hotelData.subtopicRatings?.value.toFixed(1) || hotelData.rating}
                  </span>
                  <span className="text-sky-700 text-xs">{/* (Excellent) */}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  <div className="w-2.5 h-3 bg-gray-900" /> 
                  <span className="line-clamp-2">{hotelData.locationSummary}</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                  {hotelData.type}
                </div>
              </div>
            </div>
          </div>

          {/* --- 2. การ์ดข้อมูลห้อง --- */}
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
                  <div className="pt-1.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <div className="w-3 h-3 bg-gray-900" /> 
                      <span>{selectedRoom.sizeSqm} m²</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <div className="w-3 h-3 bg-gray-900" /> 
                      <span>{selectedRoom.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <div className="w-3 h-3 bg-gray-900" /> 
                      <span>{selectedRoom.personPerRoom} คน</span>
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

        {/* --- 3. การ์ดปฏิทิน (ใหม่) --- */}
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

        {/* --- 4. การ์ดสรุปราคา (อัปเดต) --- */}
        <div className="bg-white rounded-[10px] px-4 md:px-5 py-2.5 flex flex-col gap-3.5">
          <div className="text-gray-900 text-lg md:text-xl font-bold">Price Details</div>

          {numberOfNights > 0 ? (
            <>
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
          <div className="text-gray-500 text-base md:text-lg font-semibold">Booking ID : {generateBookingId()}</div>
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
                    
                    {/* --- ✅ (โค้ดส่วนนี้จะทำงานได้แล้ว) --- */}
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
                    {/* --- ✅ (สิ้นสุด) --- */}

                  </div>
                </div>

                {/* Bed size (radio) */}
                <div className="flex-1 flex flex-col gap-3 md:gap-4">
                  <div className="text-gray-900 text-sm md:text-base font-bold">Bed size</div>
                  <div className="flex flex-wrap gap-3">

                    {/* --- ✅ (โค้ดส่วนนี้จะทำงานได้แล้ว) --- */}
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
                    {/* --- ✅ (สิ้นสุด) --- */}

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
                  onClick={() => fetchDiscount()}
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
                disabled={submitting || numberOfNights <= 0} // <== ปิดปุ่มถ้ายังไม่เลือกวัน
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

        {/* Mobile CTA */}
        <div className="block xl:hidden bg-white rounded-[10px] mt-2 px-4 md:px-6 py-4 flex flex-col gap-2.5">
          <div className="text-sm font-medium text-sky-700">You won’t be charged yet</div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || numberOfNights <= 0} // <== ปิดปุ่มถ้ายังไม่เลือกวัน
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