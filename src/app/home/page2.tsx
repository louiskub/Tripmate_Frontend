"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// [แก้ไข] 1. Import ไอคอนเพิ่ม
import {
  Globe2,
  MapPin,
  Calendar,
  Users,
  Plus,
  Minus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const popDestination = [
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTngy4iifCBzMDk7xdpzP1L5o1ymBFQSfR-BQ&s",
    name: "ภูเก็ต"
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/c/c6/At_the_Top.jpg",
    name: "เชียงใหม่"
  },
  {
    img: "https://www.ananda.co.th/blog/thegenc/wp-content/uploads/2024/05/%E0%B8%94%E0%B8%B5%E0%B9%84%E0%B8%8B%E0%B8%99%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD-2024-05-22T125922.412.png",
    name: "เกาะล้าน พัทยา"
  },
  {
    img: "https://mpics.mgronline.com/pics/Images/564000010482201.JPEG",
    name: "เขาใหญ่ นครราชสีมา"
  },
  {
    img: "https://paimayang.com/wp-content/uploads/2020/01/%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B8%B8%E0%B8%98%E0%B8%A2%E0%B8%B2.jpg",
    name: "อยุธยา"
  },
  {
    img: "https://s.isanook.com/tr/0/ud/280/1400909/baanjabo1.jpg",
    name: "ปาย แม่ฮ่องสอน"
  },
  {
    img: "https://static.wixstatic.com/media/65d002_4ad0071c42ce4db6b6d08eac31481875~mv2.png/v1/fill/w_568,h_492,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/65d002_4ad0071c42ce4db6b6d08eac31481875~mv2.png",
    name: "กระบี่"
  },
  {
    img: "https://movenpickhuahin.com/wp-content/uploads/2023/09/Hua-Hin-Beach-1024x683.jpeg",
    name: "หัวหิน"
  },
  {
    img: "https://blog.bangkokair.com/wp-content/uploads/2025/06/Cover_sukhothai-travel-guide.jpg",
    name: "สุโขทัย"
  },
  {
    img: "https://blog.bangkokair.com/wp-content/uploads/2023/11/%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%AA%E0%B8%A1%E0%B8%B8%E0%B8%A2.png",
    name: "เกาะสมุย สุราษฎร์ธานี"
  }
];



const TripHeroSection: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), null]);
  const [startDate, endDate] = dateRange;
  const [showGuest, setShowGuest] = useState(false);
  const [guests, setGuests] = useState(2);
  const [clickState, setClickState] = useState("Hotel")
  const guestRef = useRef<HTMLDivElement>(null);
  
  // [ใหม่] 2. สร้าง Ref สำหรับ container ที่จะเลื่อน
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ปิด guest dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowGuest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // [ใหม่] 3. ฟังก์ชันสำหรับเลื่อน
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      // คำนวณระยะเลื่อน (เช่น 75% ของความกว้างที่มองเห็น)
      const scrollAmount = container.clientWidth * 0.75;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-4 md:px-8 lg:px-12 mt-6 flex flex-col items-center">
        {/* ... (โค้ดส่วน Hero เหมือนเดิมทั้งหมด) ... */}
        
        {/* Background image */}
        <div className="relative w-full h-[45vh] md:h-[55vh] rounded-2xl ">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Beach"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          {/* Logo */}
          <div className="absolute top-4 left-6 flex items-center gap-2 text-white z-10">
            {/* <Globe2 className="w-6 h-6 text-pale-blue" /> */}
            <h1 className="text-xl font-extrabold font-['Manrope'] tracking-tight">
              TripMate
            </h1>
          </div>

          {/* Text Overlay */}
          <div className="absolute top-[28%] left-[8%] text-white z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold font-['Manrope'] drop-shadow-lg">
              Plan your trip
            </h1>
            <p className="mt-2 text-base md:text-lg font-medium drop-shadow-sm">
              Plan your dream trip and find all the best services
            </p>

            {/* Buttons */}
            <div className="mt-4 flex gap-3 items-center">
              <button className="px-5 py-1.5 bg-white rounded-full shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <a className="text-black text-sm font-semibold" href="/trip">
                  Show Trips
                </a>
                <Search className="w-3.5 h-3.5 text-black" />
              </button>
              <a className="w-8 h-8 bg-white rounded-full shadow-md flex justify-center items-center hover:rotate-90 transition-transform duration-300" href="/trip">
                <Plus className="w-3.5 h-3.5 text-black" />
              </a>
            </div>
          </div>

          {/* Search Box */}
          <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/75 backdrop-blur-md shadow-md rounded-2xl p-4">
            {/* ... (โค้ดส่วน Search Box เหมือนเดิมทั้งหมด) ... */}
            {/* Category Tabs */}
            <div className="flex justify-center gap-3 mb-3 flex-wrap text-sm">
              {[
                { label: "Hotel", active: true },
                { label: "Rental Car" },
                { label: "Guide" },
                { label: "Attraction" },
              ].map(({ label, active }) => (
                <button
                  key={label}
                  className={`px-3 py-1 rounded-md font-medium transition-all duration-300 ${
                    clickState == label
                      ? "bg-pale-blue text-dark-blue"
                      : "text-gray hover:text-dark-blue hover:bg-pale-blue/40"
                  }`}
                  onClick={() => setClickState(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="flex md:grid-cols-4 gap-2 text-sm relative">
              {/* Location Input */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex-3">
                <MapPin className="w-4 h-4 text-dark-blue" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-['Manrope']"
                />
              </div>

              {/* Date Picker */}
              <div className={`flex-2 relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${clickState == "Attraction" ? "hidden" : ""}`}>
                <Calendar className="w-4 h-4 text-dark-blue" />
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                  isClearable
                  dateFormat="dd MMM yy"
                  placeholderText="Select dates"
                  className="w-full bg-transparent outline-none text-gray-700 font-['Manrope']"
                  minDate={new Date()}
                  popperClassName="!z-[9999]"
                  popperPlacement="bottom-start"
                  popperProps={{
                    strategy: "absolute",
                    modifiers: [
                      { name: "flip", enabled: false },
                      { name: "offset", options: { offset: [0, 8] } },
                    ],
                  }}
                />
              </div>

              {/* Guest Selector */}
              <div
                ref={guestRef}
                className={`flex-2 flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all relative cursor-pointer ${clickState == "Attraction" ? "hidden" : ""}`}
                onClick={() => setShowGuest(true)}
              >
                <Users className="w-4 h-4 text-dark-blue" />
                <span className="text-gray-700 font-['Manrope'] select-none">
                  {guests} {guests === 1 ? "Guest" : "Guests"}
                </span>

                <AnimatePresence>
                  {showGuest && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-10 left-0 z-50 bg-white rounded-lg shadow-lg p-3 w-40"
                    >
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-lg font-semibold">{guests}</span>
                        <button
                          onClick={() => setGuests((g) => g + 1)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <button className="flex-2 w-full md:w-auto px-5 py-2 bg-dark-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-colors duration-300 shadow-sm flex justify-center items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="w-full max-w-7xl mt-28 px-6 md:px-8 lg:px-12 flex flex-col gap-5">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-xl md:text-2xl font-extrabold text-custom-black font-['Manrope']">
            Popular Destinations
          </h2>
          {/* [แก้ไข] 4. อัปเดตปุ่ม และเพิ่ม onClick */}
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="w-7 h-7 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-7 h-7 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* [แก้ไข] 5. เปลี่ยนจาก grid เป็น flex container ที่เลื่อนได้ */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6" // เพิ่ม -mx-6 px-6 ให้เลื่อนได้ชิดขอบ
        >
          {/* [แก้ไข] 6. เพิ่มจำนวน items และปรับ class */}
          {popDestination.map((dest, idx) => (
            <div
              key={idx}
              className="group cursor-pointer transition-all hover:scale-105 w-1/2 md:w-1/4 flex-shrink-0" // กำหนดขนาด fixed width และป้องกันการย่อ
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-32 md:h-40 object-cover rounded-lg shadow-sm"
              />
              <div className="mt-1 text-center text-custom-black text-sm md:text-base font-bold font-['Manrope'] group-hover:text-dark-blue transition-colors">
                {dest.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TripHeroSection;