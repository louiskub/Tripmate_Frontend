"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, MapPin, Calendar, Users, Plus, Minus, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TripHeroSection: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), null]);
  const [startDate, endDate] = dateRange;
  const [showGuest, setShowGuest] = useState(false);
  const [guests, setGuests] = useState(2);
  const guestRef = useRef<HTMLDivElement>(null);

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

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-4 md:px-8 lg:px-12 mt-6 flex flex-col items-center">
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
            <Globe2 className="w-6 h-6 text-pale-blue" />
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
                <span className="text-black text-sm font-semibold">
                  Show Trips
                </span>
                <Search className="w-3.5 h-3.5 text-black" />
              </button>
              <button className="w-8 h-8 bg-white rounded-full shadow-md flex justify-center items-center hover:rotate-90 transition-transform duration-300">
                <Plus className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/75 backdrop-blur-md shadow-md rounded-2xl p-4">
            {/* Category Tabs */}
            <div className="flex justify-center gap-3 mb-3 flex-wrap text-sm">
              {[
                { label: "Hotel", active: true },
                { label: "Restaurant" },
                { label: "Rental Car" },
                { label: "Guide" },
                { label: "Attraction" },
              ].map(({ label, active }) => (
                <button
                  key={label}
                  className={`px-3 py-1 rounded-md font-medium transition-all duration-300 ${
                    active
                      ? "bg-pale-blue text-dark-blue"
                      : "text-gray hover:text-dark-blue hover:bg-pale-blue/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm relative">
              {/* Location Input */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                <MapPin className="w-4 h-4 text-dark-blue" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-['Manrope']"
                />
              </div>

              {/* Date Picker */}
            <div className="relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
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
                    minDate={new Date()} // ✅ ป้องกันเลือกวันย้อนหลัง
                    popperClassName="!z-[9999]" // ✅ z-index สูงสุด
                    popperPlacement="bottom-start" // ✅ dropdown ลงล่างเสมอ
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
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all relative cursor-pointer"
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
              <button className="w-full md:w-auto px-5 py-2 bg-dark-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-colors duration-300 shadow-sm flex justify-center items-center gap-2">
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
          <div className="flex gap-2">
            <button className="w-7 h-7 flex justify-center items-center rounded-full border border-gray hover:bg-gray-100 transition">
              <div className="w-2 h-3 bg-gray rotate-180" />
            </button>
            <button className="w-7 h-7 flex justify-center items-center rounded-full border border-gray hover:bg-gray-100 transition">
              <div className="w-2 h-3 bg-gray" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="group cursor-pointer transition-all hover:scale-105"
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
                alt={`Destination ${i}`}
                className="w-full h-32 md:h-40 object-cover rounded-lg shadow-sm"
              />
              <div className="mt-1 text-center text-custom-black text-sm md:text-base font-bold font-['Manrope'] group-hover:text-dark-blue transition-colors">
                Location
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TripHeroSection;
