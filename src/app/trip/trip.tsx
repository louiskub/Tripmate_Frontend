"use client";

import { Calendar, MapPin, Eye, Plus, Trash2, Edit3, X, AlertCircle, Clock, Copy, Users, Star, Utensils, Bed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import FinalMap from "./map";

interface EventRowProps {
  time: string;
  title: string;
  desc?: string;
  chip?: { icon: React.ComponentType<{ className?: string }>; label: string };
}

interface TripDay {
  dayLabel: string;
  date: string;
  events: EventRowProps[];
}

export default function TripEditor() {
  const [tripTitle, setTripTitle] = useState("Trip to Pattaya");
  const [days, setDays] = useState<TripDay[]>([
    {
      dayLabel: "Day 1",
      date: "Sat, 25 Aug 2025",
      events: [],
    },
  ]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ dayIndex: number; eventIndex: number } | null>(null);
  const [mapOverlayOpen, setMapOverlayOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<{ dayIndex: number; eventIndex: number } | null>(null);
  const [form, setForm] = useState({ title: "", desc: "", location: "", time: "" });
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setSelectedCoords(null);
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
      chip: locationLabel ? { icon: MapPin, label: locationLabel } : undefined,
    };

    const updatedDays = [...days];

    if (editTarget) {
      updatedDays[editTarget.dayIndex].events[editTarget.eventIndex] = newEvent;
    } else {
      updatedDays[activeDay].events.push(newEvent);
    }

    // sort events by time automatically
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

  const handleAddDay = () => {
    const newDayIndex = days.length + 1;
    setDays([...days, { dayLabel: `Day ${newDayIndex}`, date: "TBD", events: [] }]);
  };

  const handleOpenMapOverlay = () => setMapOverlayOpen(true);
  const handleCloseMapOverlay = () => setMapOverlayOpen(false);

  const handleSelectLocation = (lat: number, lng: number, name?: string) => {
    setSelectedCoords({ lat, lng });
    console.log("sel", { ...form, location: `${name} (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
    setForm({ ...form, location: name || `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    setMapOverlayOpen(false);
  };

  return (
    <section className="relative w-full p-4 bg-custom-white rounded-[10px] flex flex-col gap-3">
      <header className="w-full pb-3 border-b border-neutral-200 flex items-center justify-between">
        <input
          className="text-custom-black text-2xl font-extrabold font-[Manrope] bg-transparent outline-none"
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
        />
        <button className="h-8 px-3 bg-dark-blue rounded-[10px] text-white font-semibold">Save</button>
      </header>

      {/* Body 3-column layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[14rem_1fr_14rem] gap-2.5">
        {/* Left rail */}
        <aside className="w-full px-2 py-2.5 border-r lg:border-r border-neutral-200 flex flex-col items-center gap-2.5">
          <img className="w-48 h-52 rounded-lg object-cover" src="https://placehold.co/200x204" alt="cover" />

          {/* Dates card */}
          <div className="w-full px-2.5 pt-2.5 bg-custom-white rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-2">
            {/* From */}
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">From :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">Sat, 25 Aug 2025</span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">10.00</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            {/* Divider */}
            <div className="w-full flex items-center justify-center">
              <div className="h-4 w-px bg-neutral-300" />
            </div>

            {/* To */}
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">To :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">Sun, 26 Aug 2025</span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">18.00</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            {/* People counters */}
            <div className="w-full py-2.5 border-t border-neutral-200 grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <span className="text-gray text-sm font-medium font-[Manrope]">2</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <span className="text-gray text-sm font-medium font-[Manrope]">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location preview */}
          <div className="w-full h-44 p-1.5 rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-1.5">
            <div className="w-full inline-flex items-center gap-1">
              <MapPin className="w-5 h-5 text-custom-black" />
              <div className="flex-1 h-6 min-w-24 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                <span className="text-gray text-sm font-medium font-[Manrope]">Pattaya</span>
              </div>
            </div>

            <div className="relative h-32 w-full rounded-[10px] shadow-sm overflow-hidden">
              <img className="w-full h-full object-cover" src="https://placehold.co/196x131" alt="map preview" />
              <button className="absolute bottom-2 left-1/2 -translate-x-1/2 h-6 min-w-24 px-2 py-1 bg-custom-white rounded-[20px] shadow inline-flex items-center gap-1">
                <span className="text-custom-black text-sm font-semibold font-[Manrope]">View on map</span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Middle column – Days & Events */}
        <main className="flex flex-col gap-3">
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
                  {day.date} <Calendar className="w-4 h-4" />
                </span>
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

              <button
                onClick={() => openAddPopup(i)}
                className="w-full mt-2 py-1.5 rounded-md border border-light-blue text-dark-blue font-medium flex items-center justify-center gap-1 hover:bg-pale-blue"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </motion.section>
          ))}

          <button
            onClick={handleAddDay}
            className="flex-1 h-9 px-5 bg-pale-blue rounded-[10px] inline-flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4" />
            <span className="text-custom-black text-base font-bold font-[Manrope]">Add Day</span>
          </button>
        </main>

        {/* Right rail – People */}
        <aside className="w-full p-2.5 border-l lg:border-l border-neutral-200 flex flex-col gap-3">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full pb-1.5 border-b border-neutral-200 inline-flex items-center gap-2.5">
              <h3 className="flex-1 text-custom-black text-base font-bold font-[Manrope]">People in trip (2)</h3>
              <Users className="w-5 h-5 text-custom-black" />
            </div>

            <PersonRow name="full name" role="head" you />
            <PersonRow name="full name" role="member" />
          </div>
        </aside>
      </div>

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
                <textarea
                  placeholder="Activity details"
                  className="p-2 border border-neutral-300 rounded-md text-sm"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
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

      {mapOverlayOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center">
          <div className="relative w-full h-full bg-white">
            <button
              onClick={handleCloseMapOverlay}
              className="absolute top-3 right-3 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 z-50"
            >
              <X className="w-6 h-6 text-dark-blue" />
            </button>
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
              {/* <p>Map Overlay Placeholder (คลิกตำแหน่งเพื่อเลือก)</p> */}
              <FinalMap onMapClick={(lat, lng, name) => handleSelectLocation(lat, lng, name)} />
            </div>
            {/* ตัวอย่าง: onMapClick={(lat, lng, name) => handleSelectLocation(lat, lng, name)} */}
          </div>
        </div>
      )}
    </section>
  );
}




function PersonRow({ name, role, you = false }: { name: string; role: string; you?: boolean }) {
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