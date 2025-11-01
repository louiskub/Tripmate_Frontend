"use client"

import {
  Calendar,
  MapPin,
  Eye, // --- เปลี่ยนมาใช้ ArrowLeft แทน
  Plus, // --- ลบออก
  Trash2, // --- ลบออก
  Edit3, // --- ลบออก
  X, // --- ลบออก
  AlertCircle, // --- ลบออก
  Clock,
  Copy, // --- ลบออก
  Users,
  Star, // --- อาจจะยังได้ใช้ ถ้า service มี rating
  Bed,
  Check, // --- ลบออก
  Hotel,
  UserCircle,
  Car,
  Search, // --- ลบออก
  ArrowLeft, // +++ เพิ่ม
  Wifi, // --- (ไอคอนย่อยๆ พวกนี้ยังอยู่ได้)
  Coffee,
  Tv,
  Wind,
  Shield,
  Award,
  Languages,
  MapPinned,
  Minus, // --- ลบออก
  DollarSign,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useState, useEffect, useMemo } from "react" // --- ลบ useMemo
import { useRouter } from "next/navigation"
// --- ลบ DatePicker และ CSS ---
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"
import "maplibre-gl/dist/maplibre-gl.css"
// --- ลบ FinalMap (ใช้สำหรับเลือก) ---
// import FinalMap from "./map"
import TripRouteDisplay from "../create/trip-route"
// --- ลบ TextareaAutosize ---
// import TextareaAutosize from "react-textarea-autosize"

// --- INTERFACES (สำหรับแสดงผล) ---
// เราจะใช้ Interface เดิมจาก Editor เพื่อให้แสดงผลได้
// แต่ข้อมูลเหล่านี้จะถูกส่งเข้ามาทาง Props

interface EventRowProps {
  time: string
  title: string
  desc?: string
  chip?: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    lat?: number
    lng?: number
  }
}

interface ServiceItem {
  id: string
  type: "hotel" | "guide" | "car"
  name: string
  details: string
  price: string
  quantity?: number
  icon: React.ComponentType<{ className?: string }>
  chipLabel: string
  roomId?: string
  packageId?: string
}

interface TripDay {
  dayLabel: string
  dateOffset: number
  events: EventRowProps[]
  services: ServiceItem[]
}

interface Person {
  name: string
  role: string
  you?: boolean
  // image: string (อาจจะเพิ่ม)
}

// --- นี่คือ Interface หลักสำหรับ Prop ---
export interface TripData {
  id: string // เช่น "123456"
  title: string
  isPublic: boolean
  startDate: string | Date
  endDate: string | Date
  peopleCount: number
  roomCount: number
  totalBudget: number
  days: TripDay[]
  startTime: string // สันนิษฐานว่าดึงเวลาที่คำนวณแล้วมาด้วย
  endTime: string
  people: Person[]
}

interface TripViewerProps {
  trip: TripData
}

// --- HELPER FUNCTIONS (ยังคงจำเป็น) ---
const formatDate = (date: Date | null): string => {
  if (!date) return "N/A"
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function addDays(date: Date | null, days: number): Date | null {
  if (!date) return null
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

// --- TRIP VIEWER COMPONENT ---

export default function TripViewer({ trip }: TripViewerProps) {
  const router = useRouter()
  
  // --- State ที่เหลืออยู่ มีแค่การเปิด/ปิดแผนที่ ---
  const [showFullRouteMap, setShowFullRouteMap] = useState(false)

  // แปลงค่าวันที่จาก Prop (เผื่อเป็น String)
  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)

  useEffect(() => {
    // Logic คุม Overflow ของ Body เมื่อเปิดแผนที่
    if (showFullRouteMap) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showFullRouteMap])

  const handleOpenFullRouteMap = () => {
    setShowFullRouteMap(true)
  }
  const handleCloseFullRouteMap = () => {
    setShowFullRouteMap(false)
  }

  // --- ดึงข้อมูล Event ทั้งหมดสำหรับแสดงบนแผนที่ ---
  const mapEvents = trip.days
    .flatMap((day) => {
      const dayDate = addDays(startDate, day.dateOffset)
      const formattedDate = formatDate(dayDate)
      return day.events
        .map((event) =>
          event.chip && event.chip.lat && event.chip.lng
            ? {
                lat: event.chip.lat,
                lng: event.chip.lng,
                title: event.title,
                time: event.time,
                date: formattedDate,
              }
            : null,
        )
        .filter(Boolean)
    }) as { lat: number; lng: number; title: string; time: string; date: string }[]

  return (
    <section className="relative w-full p-4 bg-custom-white rounded-[10px] flex flex-col gap-3">
      <header className="w-full pt-1 pb-3 border-b border-neutral-200 inline-flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* --- Title (Read-only) --- */}
          <h1 className="text-custom-black text-2xl font-extrabold font-[Manrope] truncate px-2 -ml-2">
            {trip.title}
          </h1>
          <span className="text-gray text-lg font-semibold font-[Manrope] shrink-0">#{trip.id}</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* --- Privacy (Read-only) --- */}
          <div className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-light-blue flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1">
              {trip.isPublic ? (
                <Users className="w-4 h-4 text-custom-black" />
              ) : (
                <MapPin className="w-4 h-4 text-custom-black" />
              )}
              <span className="text-custom-black text-sm font-semibold font-[Manrope]">
                {trip.isPublic ? "Public" : "Private"}
              </span>
            </span>
          </div>

          {/* --- ลบปุ่ม Copy, Discard, Save --- */}
          {/* --- เพิ่มปุ่ม Back --- */}
          <button
            onClick={() => router.back()}
            className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-dark-blue inline-flex items-center gap-1 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 text-dark-blue" />
            <span className="text-dark-blue text-sm font-semibold font-[Manrope]">Back</span>
          </button>
        </div>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[14rem_1fr_14rem] gap-2.5">
        <aside className="w-full px-2 py-2.5 border-r lg:border-r border-neutral-200 flex flex-col items-center gap-2.5">
          {/* --- ลบ DatePicker --- */}
          {/* <div className="w-full flex justify-center px-2"> ... </div> */}
          
          <div className="w-full text-center px-2 py-2">
            <h3 className="text-lg font-bold text-custom-black">Trip Details</h3>
          </div>


          <div className="w-full px-2.5 pt-2.5 bg-custom-white rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-2">
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">From :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                {/* --- Date (Read-only) --- */}
                <span className="text-gray text-sm font-medium font-[Manrope]">{formatDate(startDate)}</span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                {/* --- Time (Read-only) --- */}
                <span className="text-gray text-sm font-medium font-[Manrope]">{trip.startTime}</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            <div className="w-full flex items-center justify-center">
              <div className="h-4 w-px bg-neutral-300" />
            </div>

            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">To :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                {/* --- Date (Read-only) --- */}
                <span className="text-gray text-sm font-medium font-[Manrope]">{formatDate(endDate)}</span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                {/* --- Time (Read-only) --- */}
                <span className="text-gray text-sm font-medium font-[Manrope]">{trip.endTime}</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            <div className="w-full py-2.5 border-t border-neutral-200 grid grid-cols-2 gap-1">
              {/* --- People (Read-only) --- */}
              <div className="flex items-center gap-1 px-1">
                <Users className="w-4 h-4 text-custom-black" />
                <span className="text-gray text-sm font-medium font-[Manrope]">
                  {trip.peopleCount} {trip.peopleCount > 1 ? "People" : "Person"}
                </span>
              </div>
              {/* --- Rooms (Read-only) --- */}
              <div className="flex items-center gap-1 px-1">
                <Bed className="w-4 h-4 text-custom-black" />
                <span className="text-gray text-sm font-medium font-[Manrope]">
                  {trip.roomCount} {trip.roomCount > 1 ? "Rooms" : "Room"}
                </span>
              </div>
            </div>

            {/* --- BUDGET DISPLAY (Read-only) --- */}
            <div className="w-full px-1 py-2.5 border-t border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-custom-black" />
                <span className="text-custom-black text-sm font-medium font-[Manrope]">Total Budget (Est.)</span>
              </div>
              <span className="text-custom-black text-lg font-bold font-[Manrope]">
                ฿{trip.totalBudget.toLocaleString("en-US")}
              </span>
            </div>
            {/* --- END BUDGET DISPLAY --- */}
          </div>

          <div className="w-full h-44 rounded-xl outline-neutral-200 flex flex-col gap-1.5">
            <div className="relative h-32 w-full rounded-xl shadow-sm overflow-hidden">
              <img className="w-full h-full object-cover" src="/images/bangkok.png" alt="map preview" />
              <button
                onClick={handleOpenFullRouteMap}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 h-6 min-w-24 px-4 py-1 bg-custom-white rounded-xl shadow inline-flex items-center gap-1 min-w-fit"
              >
                <span className="text-custom-black text-sm font-semibold font-[Manrope] w-fit whitespace-nowrap">
                  View on map
                </span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex flex-col gap-3">
          {/* --- ลบ Logic แสดง "กรุณาเลือกวัน" --- */}

          {trip.days.map((day, i) => (
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
                {/* --- ลบปุ่ม "Add Event" และ "Add Service" --- */}
              </div>

              {/* Events Section (Read-only) */}
              {day.events.length === 0 ? (
                <div className="text-gray text-sm py-2">No events for this day</div>
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
                    {/* --- ลบปุ่ม Edit/Delete --- */}
                  </motion.div>
                ))
              )}

              {/* Services Section (Read-only) */}
              {day.services.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-300">
                  <div className="text-sm font-semibold text-custom-black mb-2 px-2">Services</div>
                  <div className="space-y-2">
                    {day.services.map((service, j) => (
                      <motion.div
                        key={service.id}
                        className="w-full px-3 py-2 bg-pale-blue/40 rounded-lg flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <service.icon className="w-5 h-5 text-dark-blue mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-custom-black">{service.name}</div>
                              <div className="text-sm text-gray-600 mt-0.5">{service.details}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium text-dark-blue">
                                  {service.type === "hotel"
                                    ? ""
                                    : service.type === "guide" && service.packageId
                                      ? ""
                                      : service.price}
                                </span>
                                {service.quantity && (
                                  <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                                    x{service.quantity}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-white text-xs font-medium text-dark-blue shrink-0">
                              {service.chipLabel}
                            </span>
                          </div>
                        </div>
                        {/* --- ลบปุ่ม Delete --- */}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          ))}
        </main>
        
        {/* Right rail – People (Read-only) */}
        <aside className="w-full p-2.5 border-l lg:border-l border-neutral-200 flex flex-col gap-3">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full pb-1.5 border-b border-neutral-200 inline-flex items-center gap-2.5">
              <h3 className="flex-1 text-custom-black text-base font-bold font-[Manrope]">
                People in trip ({trip.people.length})
              </h3>
              <Users className="w-5 h-5 text-custom-black" />
            </div>

            {/* --- Map ข้อมูล People จาก Prop --- */}
            {trip.people.map((person, idx) => (
              <PersonRow key={idx} name={person.name} role={person.role} you={person.you} />
            ))}
          </div>
        </aside>
      </div>

      {/* --- ลบ Event Popup, Delete Confirm, Service Popup, Map Overlay --- */}

      {/* --- คงเหลือไว้แค่ Full Route Map Modal --- */}
      <AnimatePresence>
        {showFullRouteMap && (
          <div className="fixed inset-0 z-[60] bg-white">
            <TripRouteDisplay onClose={handleCloseFullRouteMap} events={mapEvents} />
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

// --- PersonRow Component (ไม่เปลี่ยนแปลง) ---
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
  )
}