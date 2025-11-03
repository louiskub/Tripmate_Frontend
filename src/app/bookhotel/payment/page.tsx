"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookNavbar from "@/components/navbar/default-nav-variants/book-navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { endpoints, BASE_URL } from '@/config/endpoints.config'; 
import { AiFillStar } from "react-icons/ai";

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
  // pricePerNight: string; (ข้อมูลนี้อยู่ใน option)
  // bedType: string; (ข้อมูลนี้อยู่ใน option)
  // personPerRoom: number; (ข้อมูลนี้อยู่ใน option)
  description: string;
  image: string; // อาจใช้ pictures[0]
  facilities: string[];
  name: string;
  pictures: string[];
  sizeSqm: number;
};

type CreateIntentResponse = {
  success: boolean;
  message?: string;
  qrUrl?: string;       // (ถ้า method=qr)
  bookingId?: string;   // (รหัส booking ที่ยืนยันแล้ว)
  paymentId: string;    // (รหัสการชำระเงิน)
};

// (ข้อมูล Hotel ฉบับเต็มที่ UI ต้องการ)
type HotelData = {
  id: string;
  rooms: HotelRoom[]; // หรืออาจจะเป็น array of string (IDs)
  name: string;
  description: string;
  rating: string; // e.g. "10.0"
  image: string; // (อาจใช้ serviceImg หรือ pictures[0])
  breakfast: string; // e.g. "Breakfast included"
  checkIn: string; // e.g. "15:00"
  checkOut: string; // e.g. "12:00"
  locationSummary: string; // e.g. "Pattaya"
  petAllow: boolean;
  pictures: string[];
  star: number; // e.g. 5
  subtopicRatings: {
    value: number;
    [key: string]: number;
  };
  type: string;
  service: {
    serviceImg: string;
    [key: string]: any;
  };
  status: "pending" | "successed" | "cancelled";
};

// (ข้อมูล service/hotel ที่ซ้อนมาใน booking)
type ServiceData = {
  id: string;
  ownerId: string;
  locationId: string;
  name: string;
  description: string;
  serviceImg: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  type: string;
};

// (อัปเดต) TYPE สำหรับ Booking Data
type BookingData = {
  id: string;
  serviceId: string; // hotelId
  subServiceId: string; // roomId
  optionId: string;
  groupId: string;
  startBookingDate: string;
  endBookingDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  price: string;
  service: ServiceData; // <-- ข้อมูล hotel (อาจจะฉบับย่อ)
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
  // total amount (fallback เป็น mock, แต่ควรใช้ bookingData.price)
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

  // --- (เพิ่ม) STATES สำหรับเก็บข้อมูลที่ Fetch มา ---
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [hotelData, setHotelData] = useState<HotelData | null>(null); // (ข้อมูล hotel ฉบับเต็ม)
  const [roomData, setRoomData] = useState<HotelRoom | null>(null);
  const [selectedOption, setSelectedOption] = useState<RoomOption | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // --- (แก้ไข) `useEffect` สำหรับ Fetch ข้อมูล ---
  useEffect(() => {
    async function fetchData() {
      if (!bookingId) {
        setFetchError("Booking ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        // --- 1. Get Booking Details ---
        // (*** แก้ path API ตรงนี้ ***)
        const bookingRes = await axios.get(
          endpoints.searchbook(bookingId)
        );
        console.log("test",bookingRes.data);
        const booking = bookingRes.data as BookingData;
        setBookingData(booking);

        if (!booking.subServiceId) {
          throw new Error("Booking data is missing room ID (subServiceId).");
        }
        if (!booking.serviceId) {
            throw new Error("Booking data is missing hotel ID (serviceId).");
        }

        // --- 2. Get Room (subServiceId) ---
        // (*** แก้ path API ตรงนี้ ***)
        const roomRes = await axios.get(
          endpoints.searchroom(booking.subServiceId, booking.serviceId)
        );
        const room = roomRes.data as HotelRoom;
        setRoomData(room);

        // --- 3. Get Hotel (from booking.serviceId) ---
        // (*** แก้ path API ตรงนี้ ***)
        const hotelRes = await axios.get(
          endpoints.hotel.detail(booking.serviceId)
        );
        const hotel = hotelRes.data as HotelData;
        setHotelData(hotel);

        // --- 4. Find Selected Option (from room.options) ---
        const option = room.options.find((o) => o.id === booking.optionId);
        setSelectedOption(option || null);
      } catch (err) {
        console.error("Failed to fetch booking details:", err);
        const msg =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setFetchError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [bookingId]); // ทำงานเมื่อ bookingId เปลี่ยน

  /* ---------- helpers ---------- */
  const formatTHB = (n: number) =>
    new Intl.NumberFormat("en-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

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
    // (สำคัญ) ควรใช้ราคาจาก bookingData ที่ fetch มา ไม่ใช่ `total` จาก query
    const amount = bookingData ? Number(bookingData.price) : total;

    if (paymentMethod === "card") {
      return {
        method: "card",
        bookingId,
        amount: amount,
        card: {
          holder: holder.trim(),
          number: cardNumber.replace(/\s+/g, ""),
          exp: exp.trim(),
          cvv: cvv.trim(),
        },
      };
    }
    return { method: "qr", bookingId, amount: amount };
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

      // (สมมติว่า endpoints.book คือ string URL ของคุณ เช่น "/api/payment/intent")
      // (และสมมติว่า type CreateIntentResponse ถูกนิยามไว้แล้ว)

      // --- นี่คือส่วนที่แก้ไข ---
      const res = await axios.patch(
        endpoints.payment(bookingId), // 1. URL
        payload,        // 2. Data (ไม่ต้อง stringify)
        {               // 3. Config (optional)
          // headers: { "Content-Type": "application/json" }, // (axios ใส่ให้ default)
          // withCredentials: true, // ถ้าต้องการ เทียบเท่า credentials: "include"
        }
      );
      
      // const data = res.data as CreateIntentResponse; 
      
      // const qs = new URLSearchParams({
      //   bookingId: data.bookingId || bookingId,
      // }).toString();

      router.push(`/bookhotel/completebooking?bookingId=${bookingId}`);

      // axios จะโยน Error ถ้า status ไม่ใช่ 2xx
      // ถ้ามาถึงตรงนี้ได้ แปลว่า request สำเร็จ

      // ข้อมูลจะอยู่ใน res.data
     
      // --- จบส่วนแก้ไข ---

      // if (!data.success) throw new Error(data.message || "Payment failed.");

      // // ถ้าเป็น QR แสดงรูป QR และให้ผู้ใช้สแกน (ยังไม่ redirect)
      // if (paymentMethod === "qr" && data.qrUrl) {
      //   setQrUrl(data.qrUrl);
      // }

      // redirect ไปหน้า complete พร้อมพารามิเตอร์
      
    } catch (e: unknown) {
      // (Catch block นี้จะจับ Error จาก axios (เช่น 404, 500) ได้ด้วย)
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // (คำนวณราคา Total ที่แสดงผล)
  const displayTotal = useMemo(() => {
    if (bookingData?.price) {
        return Number(bookingData.price);
    }
    return total; // fallback
  }, [bookingData, total]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BookNavbar book_state={2} />

      <main className="px-4 md:px-6 lg:px-24 pt-7 pb-10">
        {/* Header */}
        <div className="flex flex-col gap-0.5 mb-3 md:mb-5">
          <div className="text-gray-900 text-2xl font-extrabold">
            Hotel Booking
          </div>
          <div className="text-gray-500 text-lg font-semibold">
            Make sure bla bla
          </div>
          {/* context from previous page (ตอนนี้จะดึงจาก fetch data) */}
          <div className="text-sm text-gray-500">
            {roomData && (
              <span>
                Room type:{" "}
                <span className="font-medium text-slate-900">
                  {roomData.name}
                </span>
              </span>
            )}
            {roomData && selectedOption && <span className="px-2">•</span>}
            {selectedOption && (
              <span>
                Bed size:{" "}
                <span className="font-medium text-slate-900">
                  {selectedOption.bed}
                </span>
              </span>
            )}
          </div>
          {bookingId && (
            <div className="text-xs text-gray-400"></div>
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
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Confirm Payment
                  </h2>
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
                          paymentMethod === "card"
                            ? "border-blue-700"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <div className="w-2 h-2 rounded-full bg-blue-700" />
                        )}
                      </div>
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          paymentMethod === "card"
                            ? "text-blue-700"
                            : "text-gray-600"
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
                          paymentMethod === "qr"
                            ? "border-blue-700"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "qr" && (
                          <div className="w-2 h-2 rounded-full bg-blue-700" />
                        )}
                      </div>
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          paymentMethod === "qr"
                            ? "text-blue-700"
                            : "text-gray-600"
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
                          <label className="block text-sm text-gray-600 mb-1">
                            Card holder name *
                          </label>
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
                          <label className="block text-sm text-gray-600 mb-1">
                            Credit/debit card number *
                          </label>
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
                            <label className="block text-sm text-gray-600 mb-1">
                              Expiration date *
                            </label>
                            <input
                              value={exp}
                              onChange={(e) => setExp(e.target.value)}
                              placeholder="01/28"
                              className="w-full h-12 px-2.5 py-2.5 bg-white rounded-md border border-gray-200 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              CVV/CVC *
                            </label>
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
                              {formatTHB(displayTotal)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            will be charged to the credit/debit card you
                            provided.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center gap-4">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                          Pay with QR PromptPay
                        </h3>
                        <div className="flex items-start gap-0.5">
                          <span className="py-1 text-gray-600 text-lg sm:text-xl">
                            ฿
                          </span>
                          <span className="py-1 text-lg sm:text-xl font-bold text-slate-900">
                            {formatTHB(displayTotal)}
                          </span>
                        </div>
                        <img
                          src={qrUrl || "/images/qrcode.jpg"}
                          alt="QR Code"
                          className="w-60 h-60 object-cover rounded-lg"
                        />
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
                          Your payment will be confirmed automatically after
                          scanning. You can click &quot;I have paid&quot; when
                          done.
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
          {/* --- (แก้ไข) ส่วน Sidebar ขวา --- */}
          <aside className="w-full lg:w-96 lg:shrink-0 flex flex-col gap-2.5">
            {/* Hotel card (Data) */}
            <div className="bg-white rounded-[10px]">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading details...
                </div>
              ) : fetchError ? (
                <div className="p-4 text-center text-red-500">{fetchError}</div>
              ) : (
                <>
                  {/* Hotel Info */}
                  <div className="min-h-48 p-2.5 rounded-[10px] flex flex-col sm:flex-row gap-2.5">
                    <img
                      // ใช้รูปจาก hotelData.image, ถ้ายไม่มีใช้ serviceImg จาก booking, ถ้ายไม่มีใช้ placeholder
                      src={
                        hotelData?.image ||
                        hotelData?.pictures[0] ||
                        bookingData?.service.serviceImg ||
                        "/placeholder.jpg"
                      }
                      alt={hotelData?.name || "Hotel"}
                      className="w-full sm:w-44 h-44 rounded-[10px] object-cover bg-gray-200"
                    />
                    <div className="flex-1 flex">
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="text-gray-900 text-lg font-semibold">
                          {hotelData?.name || "Hotel Name"}
                        </div>
                        {hotelData?.star && (
                          <div className="w-14 h-3 flex">
                            {Array.from({ length: hotelData.star }).map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 flex items-center px-[1px]"
                                >
                                <AiFillStar className="text-yellow-400"/>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {hotelData?.rating && (
                           <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                              {hotelData.rating}
                            </span>
                            <span className="text-sky-700 text-xs">
                              Excellent
                            </span>
                          </div>
                        )}
                        {hotelData?.locationSummary && (
                          <div className="flex items-center gap-1 text-xs text-gray-700">
                            <span>
                              {hotelData.locationSummary}
                            </span>
                          </div>
                        )}
                        {hotelData?.type && (
                          <div className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                            {hotelData.type}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking item (Room Info) */}
                  <div className="px-2.5 pb-2.5">
                    <div className="min-h-36 px-2 pt-2 pb-1 bg-gray-50 rounded-[10px] relative">
                      <div className="h-full flex flex-col sm:flex-row gap-1.5">
                        <img
                          src={
                            roomData?.image ||
                            roomData?.pictures[0] ||
                            "/placeholder.jpg"
                          }
                          alt={roomData?.name || "Room"}
                          className="w-full sm:w-28 h-28 sm:h-auto rounded-[10px] object-cover bg-gray-200"
                        />
                        <div className="flex flex-col justify-center">
                          <div className="text-gray-900 text-sm font-medium">
                            {roomData?.name || "Room Name"}
                          </div>
                          <div className="pt-1.5 flex flex-col gap-1">
                            {roomData?.sizeSqm && (
                              <div className="flex items-center gap-1 text-xs text-gray-700">
                                <span>{roomData.sizeSqm} m²</span>
                              </div>
                            )}
                            {selectedOption?.bed && (
                              <div className="flex items-center gap-1 text-xs text-gray-700">
                                <span>{selectedOption.bed}</span>
                              </div>
                            )}
                            {selectedOption?.maxGuest && (
                              <div className="flex items-center gap-1 text-xs text-gray-700">
                                <span>{selectedOption.maxGuest} guests</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {hotelData?.breakfast &&
                        hotelData.breakfast !== "Not included" && (
                          <div className="mt-1 w-40 flex items-center gap-1 text-xs text-green-600">
                            <div className="w-4 h-3 bg-green-500" />
                            <span>{hotelData.breakfast}</span>
                          </div>
                        )}

                      <div className="absolute right-2 bottom-2 text-xs text-gray-700">
                        x 1
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Check-in/out */}
            <div className="bg-white rounded-[10px] p-2.5 flex items-center">
              <div className="px-1 flex flex-col gap-2.5">
                <div className="text-gray-500 text-xs">Check-in</div>
                <div className="text-gray-900 text-sm md:text-base font-medium">
                  {bookingData
                    ? new Date(bookingData.startBookingDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Sat, 25 Aug 2025"}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  from {hotelData?.checkIn || "15:00"}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                {/* อาจจะคำนวณจำนวนคืนจาก start/end date */}
                <div className="text-gray-900 text-sm font-medium">1 night</div>
              </div>
              <div className="px-1 flex flex-col gap-2.5">
                <div className="text-gray-500 text-xs">Check-out</div>
                <div className="text-gray-900 text-sm md:text-base font-medium">
                  {bookingData
                    ? new Date(bookingData.endBookingDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Sun, 26 Aug 2025"}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  before {hotelData?.checkOut || "12:00"}
                </div>
              </div>
            </div>

            {/* Price details */}
            <div className="bg-white rounded-[10px] px-4 md:px-5 py-2.5">
              <div className="text-gray-900 text-xl font-bold">
                Price Details
              </div>

              {/* (ส่วนนี้ยังใช้ Mock อยู่, ควรปรับให้ดึงจาก booking/option) */}
              <div className="mt-3 flex flex-col gap-1.5">
              </div>

              <div className="my-3 h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="text-gray-900 text-base font-bold">Total</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-base">฿</span>
                  <span className="text-gray-900 text-base font-bold">
                    {formatTHB(displayTotal)}
                  </span>
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
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Payment Success
              </h3>
              <p className="text-center text-gray-600 text-sm">
                Your payment has been processed successfully.
              </p>
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