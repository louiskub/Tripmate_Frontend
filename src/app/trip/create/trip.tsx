"use client";

// [REQ] เพิ่ม Check (สำหรับ Save)
import { Calendar, MapPin, Eye, Plus, Trash2, Edit3, X, AlertCircle, Clock, Copy, Users, Star, Utensils, Bed, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
// [REQ] เพิ่ม useRouter (สำหรับ Discard)
import { useRouter } from "next/navigation"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "maplibre-gl/dist/maplibre-gl.css"
import FinalMap from "./map"; 
import TripRouteDisplay from "./trip-route";
import TextareaAutosize from 'react-textarea-autosize';

// ... (interfaces: EventRowProps, TripDay) ...
interface EventRowProps {
  time: string;
  title: string;
  desc?: string;
  chip?: { 
    icon: React.ComponentType<{ className?: string }>; 
    label: string;
    lat?: number; 
    lng?: number; 
  };
}
interface TripDay {
  dayLabel: string;
  dateOffset: number;
  events: EventRowProps[];
}


export default function TripEditor() {
  // [REQ] เพิ่ม state สำหรับ router, privacy, และสถานะการ save
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [tripTitle, setTripTitle] = useState("Trip to Pattaya");
  const [days, setDays] = useState<TripDay[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ dayIndex: number; eventIndex: number } | null>(null);
  
  const [mapOverlayOpen, setMapOverlayOpen] = useState(false);
  const [showFullRouteMap, setShowFullRouteMap] = useState(false); 

  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<{ dayIndex: number; eventIndex: number } | null>(null);
  const [form, setForm] = useState({ title: "", desc: "", location: "", time: "" });
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const [peopleCount, setPeopleCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  
  const [startTime, setStartTime] = useState("10.00");
  const [endTime, setEndTime] = useState("18.00");

  const formatDate = (date: Date | null): string => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-GB", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  // ... (useEffect ทั้งหมดเหมือนเดิม) ...
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(prevDays => {
        const newDays: TripDay[] = [];
        for (let i = 0; i < diffDays; i++) {
          const existingDayData = prevDays[i]; 
          newDays.push({
            dayLabel: `Day ${i + 1}`,
            dateOffset: i,
            events: existingDayData ? existingDayData.events : [], 
          });
        }
        return newDays;
      });
      
    } else {
      setDays([]);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    let firstTime = null;
    for (const day of days) {
      if (day.events.length > 0) {
        firstTime = day.events[0].time; 
        break;
      }
    }
    let lastTime = null;
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      if (day.events.length > 0) {
        lastTime = day.events[day.events.length - 1].time;
        break;
      }
    }
    setStartTime(firstTime || "10.00");
    setEndTime(lastTime || "18.00");
  }, [days]); 

  useEffect(() => {
    if (popupOpen || mapOverlayOpen || showFullRouteMap){ 
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [popupOpen, mapOverlayOpen, showFullRouteMap]); 

  // ... (โค้ด handler เดิม: openAddPopup, openEditPopup, closePopup, handleSubmit, handleRequestDelete, handleConfirmDelete, addDays, ...)
  const openAddPopup = (dayIndex: number) => {
    setForm({ title: "", desc: "", location: "", time: "" });
    setSelectedCoords(null);
    setActiveDay(dayIndex);
    setEditTarget(null);
    setError(null);
    setPopupOpen(true);
  };
  const openEditPopup = (dayIndex: number, eventIndex: number, event: EventRowProps) => {
    setForm({
      title: event.title,
      desc: event.desc || "",
      location: event.chip?.label || "",
      time: event.time,
    });
    setSelectedCoords(event.chip?.lat && event.chip?.lng ? { lat: event.chip.lat, lng: event.chip.lng } : null);
    setEditTarget({ dayIndex, eventIndex });
    setError(null);
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
    setForm({ title: "", desc: "", location: "", time: "" });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("กรุณากรอกชื่อกิจกรรม");
      return;
    }
    if (!form.time) {
      setError("กรุณาเลือกเวลา");
      return;
    }
    if (activeDay === null) return;
    const locationLabel = form.location || (selectedCoords ? `${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)}` : "");
    const newEvent: EventRowProps = {
      title: form.title,
      desc: form.desc,
      time: form.time,
      chip: locationLabel 
        ? { icon: MapPin, label: locationLabel, lat: selectedCoords?.lat, lng: selectedCoords?.lng } 
        : undefined,
    };
    const updatedDays = [...days];
    if (editTarget) {
      updatedDays[editTarget.dayIndex].events[editTarget.eventIndex] = newEvent;
    } else {
      updatedDays[activeDay].events.push(newEvent);
    }
    updatedDays[activeDay].events.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    setDays(updatedDays);
    closePopup();
  };
  const handleRequestDelete = (dayIndex: number, eventIndex: number) => {
    setConfirmDelete({ dayIndex, eventIndex });
  };
  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    const updatedDays = [...days];
    updatedDays[confirmDelete.dayIndex].events.splice(confirmDelete.eventIndex, 1);
    setDays(updatedDays);
    setConfirmDelete(null);
  };
  function addDays(date: Date | null, days: number): Date | null {
    if (!date) return null;
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
  const handleOpenMapOverlay = () => setMapOverlayOpen(true);
  const handleCloseMapOverlay = () => setMapOverlayOpen(false);
  const handleOpenFullRouteMap = () => { setShowFullRouteMap(true); };
  const handleCloseFullRouteMap = () => { setShowFullRouteMap(false); };
  const handleSelectLocation = (lng: number, lat: number, name?: string) => { 
    setSelectedCoords({ lat, lng }); 
    const locationName = name ? `${name} (${lat.toFixed(4)}, ${lng.toFixed(4)})` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`; 
    setForm({ ...form, location: locationName });
    setMapOverlayOpen(false);
  };

  // ----------------------------------------------------
  // [REQ 1] Handler สำหรับสลับ Private/Public
  // ----------------------------------------------------
  const handleTogglePrivacy = () => {
    setIsPublic(prev => !prev);
  };

  // ----------------------------------------------------
  // [REQ 2] Handler สำหรับ Discard (ใช้ window.confirm)
  // ----------------------------------------------------
  const handleDiscard = () => {
    // คุณสามารถเปลี่ยนไปใช้ "Toast" ที่สวยงามได้ในภายหลัง
    // แต่ `window.confirm` ทำงานได้ทันที
    if (window.confirm("คุณต้องการยกเลิกการเปลี่ยนแปลงและย้อนกลับหรือไม่?")) {
      router.back(); // ย้อนกลับไปหน้าก่อนหน้า
    }
  };

  // ----------------------------------------------------
  // [REQ 3] Handler สำหรับ Save (เตรียม API)
  // ----------------------------------------------------
  const handleSaveTrip = async () => {
    setIsSaving(true);
    
    // รวบรวมข้อมูลทั้งหมด
    const tripData = {
      title: tripTitle,
      isPublic: isPublic,
      startDate: startDate,
      endDate: endDate,
      peopleCount: peopleCount,
      roomCount: roomCount,
      days: days // นี่คือ array ที่มี events ทั้งหมด
    };

    console.log("Saving trip data:", JSON.stringify(tripData, null, 2));

    try {
      // -----------------------------------------------
      // 💯 นี่คือส่วนที่คุณจะยิง API
      // -----------------------------------------------
      // const response = await fetch("/api/trips/save", { // 👈 เปลี่ยนเป็น endpoint ของคุณ
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(tripData),
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      // console.log("Save successful:", result);
      
      //จำลองการหน่วงเวลา
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      alert("Trip saved successfully!"); // ใช้ Toast แทน alert ภายหลัง
      // router.push('/my-trips'); // (ทางเลือก) ไปยังหน้า "ทริปของฉัน"
      
    } catch (error) {
      console.error("Failed to save trip:", error);
      alert("Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <section className="relative w-full p-4 bg-custom-white rounded-[10px] flex flex-col gap-3">
      {/* Header */}
      <header className="w-full pt-1 pb-3 border-b border-neutral-200 inline-flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          
          {/* [แก้ไข] เพิ่ม div หุ้ม, เปลี่ยน h1 เป็น input, และเพิ่มไอคอนดินสอ */}
          <div className="relative flex items-center group">
            <input
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              className="text-custom-black text-2xl font-extrabold font-[Manrope] truncate bg-transparent outline-none ring-gray-300 ring-1 focus:ring-1 focus:ring-blue-300 rounded-md px-2 -ml-2"
            />
            {/* ไอคอนดินสอ */}
            <Edit3 
              className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-1 absolute top-auto right-3"
            />
          </div>
          <span className="text-gray text-lg font-semibold font-[Manrope] shrink-0">#123456</span>
        </div>

        <div className="flex items-center gap-2.5">
          
          {/* [REQ 1] ปุ่ม Private/Public */}
          <button 
            onClick={handleTogglePrivacy}
            className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-light-blue flex items-center gap-1.5 transition-all hover:bg-gray-100"
          >
            <span className="inline-flex items-center gap-1">
              {isPublic ? (
                // ใช้ Users icon ที่ import มาแล้ว
                <Users className="w-4 h-4 text-custom-black" /> 
              ) : (
                // ใช้ MapPin icon เดิมของคุณ
                <MapPin className="w-4 h-4 text-custom-black" /> 
              )}
              <span className="text-custom-black text-sm font-semibold font-[Manrope]">
                {isPublic ? "Public" : "Private"}
              </span>
            </span>
          </button>

          <button className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-custom-black inline-flex items-center gap-1">
            <Copy className="w-4 h-4 text-custom-black" />
            <span className="text-custom-black text-sm font-semibold font-[Manrope] whitespace-nowrap">Copy from trips</span>
          </button>

          <div className="flex items-center gap-2.5">
            
            {/* [REQ 2] ปุ่ม Discard */}
            <button 
              onClick={handleDiscard}
              className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-dark-blue inline-flex items-center gap-1 hover:bg-red-50"
            >
              <Eye className="w-4 h-4 text-dark-blue" />
              <span className="text-dark-blue text-sm font-semibold font-[Manrope]">Discard</span>
            </button>
            
            {/* [REQ 3] ปุ่ม Save */}
            <button 
              onClick={handleSaveTrip}
              disabled={isSaving} // 👈 disable ขณะกำลัง save
              className="h-8 px-2.5 bg-dark-blue rounded-[10px] inline-flex items-center gap-1 transition-opacity disabled:opacity-70"
            >
              {/* 👈 [FIX] เปลี่ยน icon จาก Eye เป็น Check */}
              <Check className="w-4 h-4 text-gray-50" /> 
              <span className="text-gray-50 text-sm font-semibold font-[Manrope]">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Body 3-column layout (เหมือนเดิม) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-2.5">
        {/* Left rail (เหมือนเดิม) */}
        <aside className="w-full px-2 py-2.5 border-r lg:border-r border-neutral-200 flex flex-col items-center gap-2.5">
          
          <div className="w-full flex justify-center px-2">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => { setDateRange(update); }}
              minDate={new Date()} 
              inline 
              calendarClassName="border-0 shadow-none w-full" 
            />
          </div>

          {/* ... (โค้ด CSS override) ... */}
          <style>{`
            .react-datepicker {
              font-size: 0.8rem; 
              width: 100%;
              background-color: transparent; 
            }
            .react-datepicker__header {
              background-color: #f0f3f7; 
              border-bottom: none;
            }
            .react-datepicker__month-container {
              width: 100%;
            }
            .react-datepicker__day-names,
            .react-datepicker__week {
              display: flex;
              justify-content: space-between;
            }
            .react-datepicker__day,
            .react-datepicker__day-name {
              margin: 0.1rem;
              width: 1.5rem; 
              line-height: 1.5rem;
            }
            .react-datepicker__navigation {
              top: 0.5rem; 
            }
            /* ซ่อนลูกศรขึ้นลงของ input[type=number] */
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
              -webkit-appearance: none; 
              margin: 0; 
            }
            input[type=number] {
              -moz-appearance: textfield;
            }
          `}</style>

          {/* ... (โค้ด Dates card) ... */}
          <div className="w-full px-2.5 pt-2.5 bg-custom-white rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-2">
            {/* From */}
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">From :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">
                  {formatDate(startDate) || "Select date"}
                </span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">{startTime}</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            <div className="w-full flex items-center justify-center">
              <div className="h-4 w-px bg-neutral-300" />
            </div>

            {/* To */}
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">To :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">
                  {formatDate(endDate) || "Select date"}
                </span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">{endTime}</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            {/* People counters */}
            <div className="w-full py-2.5 border-t border-neutral-200 grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <input
                    type="number"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))} 
                    min="1"
                    className="w-full text-gray text-sm font-medium font-[Manrope] bg-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <input
                    type="number"
                    value={roomCount}
                    onChange={(e) => setRoomCount(Math.max(1, parseInt(e.target.value) || 1))} 
                    min="1"
                    className="w-full text-gray text-sm font-medium font-[Manrope] bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location preview */}
          <div className="w-full h-44 rounded-xl outline-neutral-200 flex flex-col gap-1.5">
            <div className="relative h-32 w-full rounded-xl shadow-sm overflow-hidden">
              <img className="w-full h-full object-cover" src="/images/bangkok.png" alt="map preview" />
              <button 
                onClick={handleOpenFullRouteMap}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 h-6 min-w-24 px-4 py-1 bg-custom-white rounded-xl shadow inline-flex items-center gap-1 min-w-fit">
                <span className="text-custom-black text-sm font-semibold font-[Manrope] w-fit whitespace-nowrap">View on map</span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Middle column (เหมือนเดิม) */}
        <main className="flex flex-col gap-3">
          {days.length === 0 && (
            <div className="text-center text-gray p-4 bg-pale-blue/50 rounded-lg">
              กรุณาเลือกช่วงวันที่ในปฏิทินเพื่อเริ่มวางแผน
            </div>
          )}

          {days.map((day, i) => (
            <motion.section
              key={i}
              className="w-full rounded-[10px] shadow-sm outline outline-1 outline-light-blue p-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between bg-pale-blue rounded-md p-2">
                <span className="font-semibold text-custom-black">{day.dayLabel}</span>
                <span className="text-gray text-sm flex items-center gap-1">
                  {formatDate(addDays(startDate, day.dateOffset))} <Calendar className="w-4 h-4" />
                </span>
                <button
                    onClick={() => openAddPopup(i)}
                    className="py-1.5 px-3 rounded-4xl border bg-custom-white border-light-blue text-dark-blue font-medium flex items-center justify-center gap-1"
                  >
                    Event <Plus className="w-4 h-4" /> 
                  </button>
              </div>

              {day.events.length === 0 ? (
                <div className="text-gray text-sm py-2">No events yet</div>
              ) : (
                day.events.map((e, j) => (
                  <motion.div
                    key={j}
                    className="w-full pl-2 pr-2 py-1 bg-custom-white border-b border-neutral-200 flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-16 text-custom-black text-base font-medium">{e.time}</div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="text-custom-black text-base font-medium">{e.title}</div>
                      {e.desc && <div className="text-gray text-sm">{e.desc}</div>}
                    </div>
                    {e.chip && (
                      <span className="px-1.5 py-0.5 rounded-lg outline outline-1 outline-light-blue flex items-center gap-1 text-sm">
                        <e.chip.icon className="w-3.5 h-3.5" /> {e.chip.label}
                      </span>
                    )}
                    <div className="flex items-center gap-2 ml-2">
                      <button onClick={() => openEditPopup(i, j, e)} className="p-1 hover:bg-pale-blue rounded-md">
                        <Edit3 className="w-4 h-4 text-dark-blue" />
                      </button>
                      <button onClick={() => handleRequestDelete(i, j)} className="p-1 hover:bg-pale-blue rounded-md">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.section>
          ))}

        </main>
      </div>

      {/* Popup / Overlay Section (เหมือนเดิม) */}
      <div className={`fixed top-0 left-0 h-full w-full z-10 ${popupOpen || confirmDelete ? "" : "hidden"}`}>
        {/* Popup สำหรับเพิ่ม/แก้ไขกิจกรรม */}
        <AnimatePresence>
          {popupOpen && (
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button onClick={closePopup} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <h3 className="text-lg font-bold text-custom-black mb-2">
                  {editTarget ? "Edit Event" : "Add Event"}
                </h3>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md mb-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Activity name"
                    className="p-2 border border-neutral-300 rounded-md text-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                  <TextareaAutosize
                    placeholder="Activity details"
                    className="p-2 border border-neutral-300 rounded-md text-sm resize-none overflow-hidden"
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    minRows={2}
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      className="flex-1 p-2 border border-neutral-300 rounded-md text-sm"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={handleOpenMapOverlay}
                      className="px-3 py-2 bg-pale-blue rounded-md text-dark-blue text-sm font-medium hover:bg-light-blue/50"
                    >
                      <MapPin className="w-4 h-4 inline mr-1" /> Map
                    </button>
                  </div>
                  <select
                    className="p-2 border border-neutral-300 rounded-md text-sm"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 24 * 2 }, (_, i) => {
                      const hour = Math.floor(i / 2);
                      const minute = i % 2 === 0 ? "00" : "30";
                      const formatted = `${hour.toString().padStart(2, "0")}.${minute}`;
                      return (
                        <option key={formatted} value={formatted}>
                          {formatted}
                        </option>
                      );
                    })}
                  </select>
                  <button type="submit" className="px-4 py-2 bg-dark-blue text-white rounded-md text-sm hover:opacity-90">
                    {editTarget ? "Save Changes" : "Add Event"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popup ยืนยันการลบ */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-5 rounded-lg shadow-lg max-w-sm text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="font-bold text-custom-black text-lg mb-2">ยืนยันการลบ</h3>
                <p className="text-gray-600 text-sm mb-4">คุณต้องการลบกิจกรรมนี้จริงหรือไม่?</p>
                <div className="flex justify-center gap-3">
                  <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">ลบ</button>
                  <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border rounded-md">ยกเลิก</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay สำหรับ Map (เลือกพิกัด) */}
      {mapOverlayOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center">
          <div className="relative w-full h-full bg-white">
            <button
              onClick={handleCloseMapOverlay}
              className="absolute top-3 right-3 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 z-[70]"
            >
              <X className="w-6 h-6 text-dark-blue" />
            </button>
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
              <FinalMap onMapClick={(lng, lat, name) => handleSelectLocation(lng, lat, name)} />
            </div>
          </div>
        </div>
      )}

      {/* Overlay สำหรับ Map (แสดงเส้นทางรวม) */}
      {showFullRouteMap && (
        <div className="fixed inset-0 z-[60] bg-white">
          <TripRouteDisplay
            onClose={handleCloseFullRouteMap}
            events={
              days.flatMap(day => {
                const dayDate = addDays(startDate, day.dateOffset);
                const formattedDate = formatDate(dayDate); // 👈 แก้ไข format ที่นี่
                return day.events
                  .map(event => 
                    (event.chip && event.chip.lat && event.chip.lng) 
                      ? { 
                          lat: event.chip.lat, 
                          lng: event.chip.lng, 
                          title: event.title,
                          time: event.time,      
                          date: formattedDate  
                        } 
                      : null
                  )
                  .filter(Boolean) 
              }) as { lat: number, lng: number, title: string, time: string, date: string }[] 
            }
          />
        </div>
      )}
    </section>
  );
}


// (PersonRow function - เหมือนเดิม)
function PersonRow({ name, role, you = false }: { name: string; role: string; you?: boolean }) {
  // ... (โค้ดเหมือนเดิม)
  return (
    <div className="w-full inline-flex items-center gap-2">
      <img className="w-7 h-7 rounded-full object-cover" src="https://placehold.co/28x28" alt={name} />
      <div className="flex-1 flex flex-col">
        <div className="w-full inline-flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-custom-black text-sm font-medium font-[Manrope] truncate">{name}</span>
          </div>
          <span className="text-gray text-xs font-normal font-[Manrope] shrink-0">{you ? "(You)" : ""}</span>
        </div>
        <span className="text-gray text-xs font-normal font-[Manrope]">{role}</span>
      </div>
    </div>
  );
}