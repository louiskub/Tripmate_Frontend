"use client"

import {
  Calendar,
  MapPin,
  Eye,
  Plus,
  Trash2,
  Edit3,
  X,
  AlertCircle,
  Clock,
  Copy,
  Users,
  Star,
  Bed,
  Check,
  Hotel,
  UserCircle,
  Car,
  Search,
  ArrowLeft,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Shield,
  Award,
  Languages,
  MapPinned,
  Minus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "maplibre-gl/dist/maplibre-gl.css"
import FinalMap from "./map"
import TripRouteDisplay from "./trip-route"
import TextareaAutosize from "react-textarea-autosize"

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
}

interface TripDay {
  dayLabel: string
  dateOffset: number
  events: EventRowProps[]
  services: ServiceItem[]
}

interface Service {
  id: string
  name: string
  description: string
  price?: string
  rating?: number
  image?: string
}

interface HotelRoom {
  id: string
  type: string
  price: string
  capacity: number
  amenities: string[]
  image?: string
}

interface GuideDetail {
  experience: string
  languages: string[]
  specialties: string[]
  certifications: string[]
}

interface CarDetail {
  seats: number
  transmission: string
  fuelType: string
  features: string[]
  insurance: string
}

interface ServiceCategory {
  hotels: Service[]
  guides: Service[]
  cars: Service[]
}

const mockServices: ServiceCategory = {
  hotels: [
    {
      id: "h1",
      name: "Grand Palace Hotel",
      description: "Luxury 5-star hotel in city center",
      price: "฿3,500/night",
      rating: 4.8,
      image: "https://placehold.co/100x100",
    },
    {
      id: "h2",
      name: "Seaside Resort",
      description: "Beautiful beachfront resort",
      price: "฿2,800/night",
      rating: 4.6,
      image: "https://placehold.co/100x100",
    },
    {
      id: "h3",
      name: "Mountain View Lodge",
      description: "Cozy mountain retreat",
      price: "฿1,500/night",
      rating: 4.5,
      image: "https://placehold.co/100x100",
    },
    {
      id: "h4",
      name: "City Center Inn",
      description: "Affordable downtown hotel",
      price: "฿1,200/night",
      rating: 4.2,
      image: "https://placehold.co/100x100",
    },
    {
      id: "h5",
      name: "Boutique Hotel Bangkok",
      description: "Stylish boutique accommodation",
      price: "฿2,200/night",
      rating: 4.7,
      image: "https://placehold.co/100x100",
    },
  ],
  guides: [
    {
      id: "g1",
      name: "John Smith",
      description: "Expert local guide - 10 years experience",
      price: "฿1,500/day",
      rating: 4.9,
      image: "https://placehold.co/100x100",
    },
    {
      id: "g2",
      name: "Sarah Johnson",
      description: "Cultural heritage specialist",
      price: "฿1,800/day",
      rating: 4.8,
      image: "https://placehold.co/100x100",
    },
    {
      id: "g3",
      name: "Mike Chen",
      description: "Adventure tour guide",
      price: "฿2,000/day",
      rating: 4.7,
      image: "https://placehold.co/100x100",
    },
    {
      id: "g4",
      name: "Anna Lee",
      description: "Food and culture expert",
      price: "฿1,600/day",
      rating: 4.6,
      image: "https://placehold.co/100x100",
    },
  ],
  cars: [
    {
      id: "c1",
      name: "Toyota Camry",
      description: "Comfortable sedan for 4 passengers",
      price: "฿1,200/day",
      rating: 4.5,
      image: "https://placehold.co/100x100",
    },
    {
      id: "c2",
      name: "Honda CR-V",
      description: "Spacious SUV for 7 passengers",
      price: "฿1,800/day",
      rating: 4.6,
      image: "https://placehold.co/100x100",
    },
    {
      id: "c3",
      name: "Mercedes-Benz E-Class",
      description: "Luxury sedan with driver",
      price: "฿3,500/day",
      rating: 4.9,
      image: "https://placehold.co/100x100",
    },
    {
      id: "c4",
      name: "Toyota Commuter",
      description: "Van for 12 passengers",
      price: "฿2,500/day",
      rating: 4.4,
      image: "https://placehold.co/100x100",
    },
    {
      id: "c5",
      name: "Yamaha PCX",
      description: "Motorbike rental",
      price: "฿300/day",
      rating: 4.3,
      image: "https://placehold.co/100x100",
    },
  ],
}

const mockHotelRooms: Record<string, HotelRoom[]> = {
  h1: [
    {
      id: "h1r1",
      type: "Deluxe Room",
      price: "฿3,500/night",
      capacity: 2,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar"],
      image: "https://placehold.co/300x200",
    },
    {
      id: "h1r2",
      type: "Executive Suite",
      price: "฿5,500/night",
      capacity: 3,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Living Room", "City View"],
      image: "https://placehold.co/300x200",
    },
    {
      id: "h1r3",
      type: "Presidential Suite",
      price: "฿12,000/night",
      capacity: 4,
      amenities: [
        "Free WiFi",
        "Air Conditioning",
        "TV",
        "Mini Bar",
        "Living Room",
        "City View",
        "Jacuzzi",
        "Butler Service",
      ],
      image: "https://placehold.co/300x200",
    },
  ],
  h2: [
    {
      id: "h2r1",
      type: "Standard Room",
      price: "฿2,800/night",
      capacity: 2,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Beach View"],
      image: "https://placehold.co/300x200",
    },
    {
      id: "h2r2",
      type: "Ocean View Suite",
      price: "฿4,500/night",
      capacity: 3,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Beach View", "Balcony", "Mini Bar"],
      image: "https://placehold.co/300x200",
    },
  ],
  h3: [
    {
      id: "h3r1",
      type: "Cozy Room",
      price: "฿1,500/night",
      capacity: 2,
      amenities: ["Free WiFi", "Heating", "Mountain View"],
      image: "https://placehold.co/300x200",
    },
    {
      id: "h3r2",
      type: "Family Room",
      price: "฿2,200/night",
      capacity: 4,
      amenities: ["Free WiFi", "Heating", "Mountain View", "Fireplace"],
      image: "https://placehold.co/300x200",
    },
  ],
  h4: [
    {
      id: "h4r1",
      type: "Standard Room",
      price: "฿1,200/night",
      capacity: 2,
      amenities: ["Free WiFi", "Air Conditioning", "TV"],
      image: "https://placehold.co/300x200",
    },
  ],
  h5: [
    {
      id: "h5r1",
      type: "Boutique Room",
      price: "฿2,200/night",
      capacity: 2,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Designer Furniture"],
      image: "https://placehold.co/300x200",
    },
    {
      id: "h5r2",
      type: "Luxury Suite",
      price: "฿3,800/night",
      capacity: 3,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Designer Furniture", "Balcony", "Mini Bar"],
      image: "https://placehold.co/300x200",
    },
  ],
}

const mockGuideDetails: Record<string, GuideDetail> = {
  g1: {
    experience: "10 years of professional guiding experience",
    languages: ["English", "Thai", "Chinese", "Japanese"],
    specialties: ["Historical Sites", "Cultural Tours", "Food Tours"],
    certifications: ["Licensed Tour Guide", "First Aid Certified", "Cultural Heritage Expert"],
  },
  g2: {
    experience: "8 years specializing in cultural heritage",
    languages: ["English", "Thai", "French"],
    specialties: ["Temple Tours", "Art & Architecture", "Traditional Crafts"],
    certifications: ["Licensed Tour Guide", "Art History Degree", "UNESCO Heritage Specialist"],
  },
  g3: {
    experience: "12 years of adventure tourism",
    languages: ["English", "Thai", "German"],
    specialties: ["Trekking", "Rock Climbing", "Water Sports"],
    certifications: ["Licensed Tour Guide", "Wilderness First Responder", "Adventure Tourism Certified"],
  },
  g4: {
    experience: "6 years of culinary and cultural tours",
    languages: ["English", "Thai", "Korean"],
    specialties: ["Street Food", "Cooking Classes", "Market Tours"],
    certifications: ["Licensed Tour Guide", "Culinary Arts Certificate", "Food Safety Certified"],
  },
}

const mockCarDetails: Record<string, CarDetail> = {
  c1: {
    seats: 4,
    transmission: "Automatic",
    fuelType: "Gasoline",
    features: ["GPS Navigation", "Bluetooth", "USB Charging", "Air Conditioning"],
    insurance: "Full insurance included",
  },
  c2: {
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    features: ["GPS Navigation", "Bluetooth", "USB Charging", "Air Conditioning", "Rear Camera", "3rd Row Seats"],
    insurance: "Full insurance included",
  },
  c3: {
    seats: 4,
    transmission: "Automatic",
    fuelType: "Gasoline",
    features: [
      "GPS Navigation",
      "Bluetooth",
      "USB Charging",
      "Climate Control",
      "Leather Seats",
      "Professional Driver",
    ],
    insurance: "Premium insurance included",
  },
  c4: {
    seats: 12,
    transmission: "Manual",
    fuelType: "Diesel",
    features: ["Air Conditioning", "USB Charging", "Large Luggage Space"],
    insurance: "Standard insurance included",
  },
  c5: {
    seats: 2,
    transmission: "Automatic",
    fuelType: "Gasoline",
    features: ["Storage Box", "Helmet Included"],
    insurance: "Basic insurance included",
  },
}

export default function TripEditor() {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [tripTitle, setTripTitle] = useState("Trip to Pattaya")
  const [days, setDays] = useState<TripDay[]>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ dayIndex: number; eventIndex: number } | null>(null)

  const [mapOverlayOpen, setMapOverlayOpen] = useState(false)
  const [showFullRouteMap, setShowFullRouteMap] = useState(false)

  const [activeDay, setActiveDay] = useState<number | null>(null)
  const [editTarget, setEditTarget] = useState<{ dayIndex: number; eventIndex: number } | null>(null)
  const [form, setForm] = useState({ title: "", desc: "", location: "", time: "" })
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange

  const [peopleCount, setPeopleCount] = useState(2)
  const [roomCount, setRoomCount] = useState(1)

  const [startTime, setStartTime] = useState("10.00")
  const [endTime, setEndTime] = useState("18.00")

  const [servicePopupOpen, setServicePopupOpen] = useState(false)
  const [activeServiceTab, setActiveServiceTab] = useState<"hotels" | "guides" | "cars">("hotels")
  const [serviceSearchQuery, setServiceSearchQuery] = useState("")
  const [activeDayForService, setActiveDayForService] = useState<number | null>(null)

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showServiceDetail, setShowServiceDetail] = useState(false)

  const [roomQuantity, setRoomQuantity] = useState(1)

  const formatDate = (date: Date | null): string => {
    if (!date) return "Select date"
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
  }

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setDays((prevDays) => {
        const newDays: TripDay[] = []
        for (let i = 0; i < diffDays; i++) {
          const existingDayData = prevDays[i]
          newDays.push({
            dayLabel: `Day ${i + 1}`,
            dateOffset: i,
            events: existingDayData ? existingDayData.events : [],
            services: existingDayData ? existingDayData.services : [],
          })
        }
        return newDays
      })
    } else {
      setDays([])
    }
  }, [startDate, endDate])

  useEffect(() => {
    let firstTime = null
    for (const day of days) {
      if (day.events.length > 0) {
        firstTime = day.events[0].time
        break
      }
    }
    let lastTime = null
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i]
      if (day.events.length > 0) {
        lastTime = day.events[day.events.length - 1].time
        break
      }
    }
    setStartTime(firstTime || "10.00")
    setEndTime(lastTime || "18.00")
  }, [days])

  useEffect(() => {
    if (popupOpen || mapOverlayOpen || showFullRouteMap || servicePopupOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [popupOpen, mapOverlayOpen, showFullRouteMap, servicePopupOpen])

  const openAddPopup = (dayIndex: number) => {
    setForm({ title: "", desc: "", location: "", time: "" })
    setSelectedCoords(null)
    setActiveDay(dayIndex)
    setEditTarget(null)
    setError(null)
    setPopupOpen(true)
  }

  const openEditPopup = (dayIndex: number, eventIndex: number, event: EventRowProps) => {
    setForm({
      title: event.title,
      desc: event.desc || "",
      location: event.chip?.label || "",
      time: event.time,
    })
    setSelectedCoords(event.chip?.lat && event.chip?.lng ? { lat: event.chip.lat, lng: event.chip.lng } : null)
    setEditTarget({ dayIndex, eventIndex })
    setError(null)
    setPopupOpen(true)
  }

  const closePopup = () => {
    setPopupOpen(false)
    setForm({ title: "", desc: "", location: "", time: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError("กรุณากรอกชื่อกิจกรรม")
      return
    }
    if (!form.time) {
      setError("กรุณาเลือกเวลา")
      return
    }
    if (activeDay === null) return
    const locationLabel =
      form.location || (selectedCoords ? `${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)}` : "")
    const newEvent: EventRowProps = {
      title: form.title,
      desc: form.desc,
      time: form.time,
      chip: locationLabel
        ? { icon: MapPin, label: locationLabel, lat: selectedCoords?.lat, lng: selectedCoords?.lng }
        : undefined,
    }
    const updatedDays = [...days]
    if (editTarget) {
      updatedDays[editTarget.dayIndex].events[editTarget.eventIndex] = newEvent
    } else {
      updatedDays[activeDay].events.push(newEvent)
    }
    updatedDays[activeDay].events.sort((a, b) => Number.parseFloat(a.time) - Number.parseFloat(b.time))
    setDays(updatedDays)
    closePopup()
  }

  const handleRequestDelete = (dayIndex: number, eventIndex: number) => {
    setConfirmDelete({ dayIndex, eventIndex })
  }

  const handleConfirmDelete = () => {
    if (!confirmDelete) return
    const updatedDays = [...days]
    updatedDays[confirmDelete.dayIndex].events.splice(confirmDelete.eventIndex, 1)
    setDays(updatedDays)
    setConfirmDelete(null)
  }

  function addDays(date: Date | null, days: number): Date | null {
    if (!date) return null
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate
  }

  const handleOpenMapOverlay = () => setMapOverlayOpen(true)
  const handleCloseMapOverlay = () => setMapOverlayOpen(false)
  const handleOpenFullRouteMap = () => {
    setShowFullRouteMap(true)
  }
  const handleCloseFullRouteMap = () => {
    setShowFullRouteMap(false)
  }
  const handleSelectLocation = (lng: number, lat: number, name?: string) => {
    setSelectedCoords({ lat, lng })
    const locationName = name
      ? `${name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      : `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    setForm({ ...form, location: locationName })
    setMapOverlayOpen(false)
  }

  const handleTogglePrivacy = () => {
    setIsPublic((prev) => !prev)
  }

  const handleDiscard = () => {
    if (window.confirm("คุณต้องการยกเลิกการเปลี่ยนแปลงและย้อนกลับหรือไม่?")) {
      router.back()
    }
  }

  const handleSaveTrip = async () => {
    setIsSaving(true)

    const tripData = {
      title: tripTitle,
      isPublic: isPublic,
      startDate: startDate,
      endDate: endDate,
      peopleCount: peopleCount,
      roomCount: roomCount,
      days: days,
    }

    console.log("Saving trip data:", JSON.stringify(tripData, null, 2))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Trip saved successfully!")
    } catch (error) {
      console.error("Failed to save trip:", error)
      alert("Failed to save trip. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const openServicePopup = (dayIndex: number) => {
    setActiveDayForService(dayIndex)
    setServicePopupOpen(true)
    setServiceSearchQuery("")
    setActiveServiceTab("hotels")
    setShowServiceDetail(false)
    setSelectedService(null)
    setRoomQuantity(1)
  }

  const closeServicePopup = () => {
    setServicePopupOpen(false)
    setActiveDayForService(null)
    setServiceSearchQuery("")
    setShowServiceDetail(false)
    setSelectedService(null)
    setRoomQuantity(1)
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setShowServiceDetail(true)
  }

  const handleAddServiceToTrip = (service: Service, details: string, quantity?: number) => {
    if (activeDayForService === null) return

    let icon: React.ComponentType<{ className?: string }>
    let chipLabel: string
    let type: "hotel" | "guide" | "car"

    if (activeServiceTab === "hotels") {
      icon = Hotel
      chipLabel = "Hotel"
      type = "hotel"
    } else if (activeServiceTab === "guides") {
      icon = UserCircle
      chipLabel = "Guide"
      type = "guide"
    } else {
      icon = Car
      chipLabel = "Car Rental"
      type = "car"
    }

    const newService: ServiceItem = {
      id: `${service.id}-${Date.now()}`,
      type,
      name: service.name,
      details,
      price: service.price || "",
      quantity,
      icon,
      chipLabel,
    }

    const updatedDays = [...days]
    updatedDays[activeDayForService].services.push(newService)
    setDays(updatedDays)
    closeServicePopup()
  }

  const handleBackToServiceList = () => {
    setShowServiceDetail(false)
    setSelectedService(null)
    setRoomQuantity(1)
  }

  const handleDeleteService = (dayIndex: number, serviceIndex: number) => {
    const updatedDays = [...days]
    updatedDays[dayIndex].services.splice(serviceIndex, 1)
    setDays(updatedDays)
  }

  const getFilteredServices = (): Service[] => {
    const services = mockServices[activeServiceTab]
    if (!serviceSearchQuery.trim()) return services

    const query = serviceSearchQuery.toLowerCase()
    return services.filter(
      (service) => service.name.toLowerCase().includes(query) || service.description.toLowerCase().includes(query),
    )
  }

  return (
    <section className="relative w-full p-4 bg-custom-white rounded-[10px] flex flex-col gap-3">
      <header className="w-full pt-1 pb-3 border-b border-neutral-200 inline-flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center group">
            <input
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              className="text-custom-black text-2xl font-extrabold font-[Manrope] truncate bg-transparent outline-none ring-gray-300 ring-1 focus:ring-1 focus:ring-blue-300 rounded-md px-2 -ml-2"
            />
            <Edit3 className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-1 absolute top-auto right-3" />
          </div>
          <span className="text-gray text-lg font-semibold font-[Manrope] shrink-0">#123456</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTogglePrivacy}
            className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-light-blue flex items-center gap-1.5 transition-all hover:bg-gray-100"
          >
            <span className="inline-flex items-center gap-1">
              {isPublic ? (
                <Users className="w-4 h-4 text-custom-black" />
              ) : (
                <MapPin className="w-4 h-4 text-custom-black" />
              )}
              <span className="text-custom-black text-sm font-semibold font-[Manrope]">
                {isPublic ? "Public" : "Private"}
              </span>
            </span>
          </button>

          <button className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-custom-black inline-flex items-center gap-1">
            <Copy className="w-4 h-4 text-custom-black" />
            <span className="text-custom-black text-sm font-semibold font-[Manrope] whitespace-nowrap">
              Copy from trips
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDiscard}
              className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-dark-blue inline-flex items-center gap-1 hover:bg-red-50"
            >
              <Eye className="w-4 h-4 text-dark-blue" />
              <span className="text-dark-blue text-sm font-semibold font-[Manrope]">Discard</span>
            </button>

            <button
              onClick={handleSaveTrip}
              disabled={isSaving}
              className="h-8 px-2.5 bg-dark-blue rounded-[10px] inline-flex items-center gap-1 transition-opacity disabled:opacity-70"
            >
              <Check className="w-4 h-4 text-gray-50" />
              <span className="text-gray-50 text-sm font-semibold font-[Manrope]">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-2.5">
        <aside className="w-full px-2 py-2.5 border-r lg:border-r border-neutral-200 flex flex-col items-center gap-2.5">
          <div className="w-full flex justify-center px-2">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update)
              }}
              minDate={new Date()}
              inline
              calendarClassName="border-0 shadow-none w-full"
            />
          </div>

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
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
              -webkit-appearance: none; 
              margin: 0; 
            }
            input[type=number] {
              -moz-appearance: textfield;
            }
          `}</style>

          <div className="w-full px-2.5 pt-2.5 bg-custom-white rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-2">
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

            <div className="w-full py-2.5 border-t border-neutral-200 grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <input
                    type="number"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
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
                    onChange={(e) => setRoomCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full text-gray text-sm font-medium font-[Manrope] bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>
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
          {days.length === 0 && (
            <div className="text-center text-gray p-4 bg-pale-blue/50 rounded-lg">กรุณาเลือกช่วงวันที่ในปฏิทินเพื่อเริ่มวางแผน</div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAddPopup(i)}
                    className="py-1.5 px-3 rounded-4xl border bg-custom-white border-light-blue text-dark-blue font-medium flex items-center justify-center gap-1"
                  >
                    Event <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openServicePopup(i)}
                    className="py-1.5 px-3 rounded-4xl border bg-dark-blue border-dark-blue text-white font-medium flex items-center justify-center gap-1"
                  >
                    Service <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Events Section */}
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

              {/* Services Section - Separated from Events */}
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
                                <span className="text-sm font-medium text-dark-blue">{service.price}</span>
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
                        <button
                          onClick={() => handleDeleteService(i, j)}
                          className="p-1 hover:bg-red-100 rounded-md shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          ))}
        </main>
      </div>

      {/* Event Popup */}
      <div className={`fixed top-0 left-0 h-full w-full z-10 ${popupOpen || confirmDelete ? "" : "hidden"}`}>
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
                <h3 className="text-lg font-bold text-custom-black mb-2">{editTarget ? "Edit Event" : "Add Event"}</h3>
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
                      const hour = Math.floor(i / 2)
                      const minute = i % 2 === 0 ? "00" : "30"
                      const formatted = `${hour.toString().padStart(2, "0")}.${minute}`
                      return (
                        <option key={formatted} value={formatted}>
                          {formatted}
                        </option>
                      )
                    })}
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-dark-blue text-white rounded-md text-sm hover:opacity-90"
                  >
                    {editTarget ? "Save Changes" : "Add Event"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">
                    ลบ
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border rounded-md">
                    ยกเลิก
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {servicePopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-white rounded-lg shadow-lg relative max-h-[80vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-4 border-b border-neutral-200">
                <button
                  onClick={closeServicePopup}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {showServiceDetail && (
                  <button
                    onClick={handleBackToServiceList}
                    className="absolute top-3 left-3 p-1 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>
                )}

                <h3 className="text-lg font-bold text-custom-black mb-3">
                  {showServiceDetail ? selectedService?.name : "Add Service"}
                </h3>

                {!showServiceDetail && (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveServiceTab("hotels")}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          activeServiceTab === "hotels"
                            ? "bg-dark-blue text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Hotel className="w-4 h-4 inline mr-1" />
                        โรงแรม
                      </button>
                      <button
                        onClick={() => setActiveServiceTab("guides")}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          activeServiceTab === "guides"
                            ? "bg-dark-blue text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <UserCircle className="w-4 h-4 inline mr-1" />
                        ไกด์
                      </button>
                      <button
                        onClick={() => setActiveServiceTab("cars")}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          activeServiceTab === "cars"
                            ? "bg-dark-blue text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Car className="w-4 h-4 inline mr-1" />
                        รถเช่า
                      </button>
                    </div>

                    <div className="mt-3 relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ค้นหา..."
                        value={serviceSearchQuery}
                        onChange={(e) => setServiceSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dark-blue"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!showServiceDetail ? (
                  <div className="space-y-2">
                    {getFilteredServices().map((service) => (
                      <motion.div
                        key={service.id}
                        className="p-3 border border-neutral-200 rounded-lg hover:border-dark-blue hover:bg-pale-blue/30 cursor-pointer transition-all"
                        onClick={() => handleSelectService(service)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-custom-black">{service.name}</h4>
                              {service.rating && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-gray-600">{service.rating}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            {service.price && (
                              <p className="text-sm font-medium text-dark-blue mt-1">{service.price}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {getFilteredServices().length === 0 && (
                      <div className="text-center py-8 text-gray-400">ไม่พบข้อมูลที่ค้นหา</div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeServiceTab === "hotels" && selectedService && mockHotelRooms[selectedService.id] && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-custom-black text-lg">เลือกประเภทห้อง</h4>
                        {mockHotelRooms[selectedService.id].map((room) => (
                          <motion.div
                            key={room.id}
                            className="p-4 border border-neutral-200 rounded-lg hover:border-dark-blue transition-all"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex gap-4">
                              <img
                                src={room.image || "/placeholder.svg"}
                                alt={room.type}
                                className="w-32 h-24 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-custom-black">{room.type}</h5>
                                  <span className="text-dark-blue font-semibold">{room.price}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <Users className="w-4 h-4" />
                                  <span>{room.capacity} guests</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {room.amenities.map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-pale-blue text-dark-blue text-xs rounded-full flex items-center gap-1"
                                    >
                                      {amenity.includes("WiFi") && <Wifi className="w-3 h-3" />}
                                      {amenity.includes("Air") && <Wind className="w-3 h-3" />}
                                      {amenity.includes("TV") && <Tv className="w-3 h-3" />}
                                      {amenity.includes("Bar") && <Coffee className="w-3 h-3" />}
                                      {amenity}
                                    </span>
                                  ))}
                                </div>

                                {/* Room Quantity Input */}
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-200">
                                  <span className="text-sm font-medium text-gray-700">จำนวนห้อง:</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setRoomQuantity(Math.max(1, roomQuantity - 1))}
                                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{roomQuantity}</span>
                                    <button
                                      onClick={() => setRoomQuantity(roomQuantity + 1)}
                                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleAddServiceToTrip(
                                        selectedService,
                                        `${room.type} - ${room.price} (${room.capacity} guests)`,
                                        roomQuantity,
                                      )
                                    }
                                    className="ml-auto px-4 py-2 bg-dark-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                  >
                                    เลือกห้องนี้
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeServiceTab === "guides" && selectedService && mockGuideDetails[selectedService.id] && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={selectedService.image || "/placeholder.svg"}
                            alt={selectedService.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-custom-black text-lg">{selectedService.name}</h4>
                                <p className="text-sm text-gray-600">{selectedService.description}</p>
                              </div>
                              {selectedService.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold">{selectedService.rating}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-dark-blue font-semibold">{selectedService.price}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-5 h-5 text-dark-blue" />
                              <h5 className="font-semibold text-custom-black">ประสบการณ์</h5>
                            </div>
                            <p className="text-sm text-gray-700">{mockGuideDetails[selectedService.id].experience}</p>
                          </div>

                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Languages className="w-5 h-5 text-dark-blue" />
                              <h5 className="font-semibold text-custom-black">ภาษาที่พูดได้</h5>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {mockGuideDetails[selectedService.id].languages.map((lang, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white text-dark-blue text-sm rounded-full">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPinned className="w-5 h-5 text-dark-blue" />
                              <h5 className="font-semibold text-custom-black">ความเชี่ยวชาญ</h5>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {mockGuideDetails[selectedService.id].specialties.map((specialty, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white text-dark-blue text-sm rounded-full">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-5 h-5 text-dark-blue" />
                              <h5 className="font-semibold text-custom-black">ใบรับรอง</h5>
                            </div>
                            <ul className="space-y-1">
                              {mockGuideDetails[selectedService.id].certifications.map((cert, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                  <Check className="w-4 h-4 text-green-600" />
                                  {cert}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleAddServiceToTrip(
                              selectedService,
                              `${selectedService.description} - ${selectedService.price}`,
                            )
                          }
                          className="w-full py-3 bg-dark-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                          เลือกไกด์นี้
                        </button>
                      </div>
                    )}

                    {activeServiceTab === "cars" && selectedService && mockCarDetails[selectedService.id] && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={selectedService.image || "/placeholder.svg"}
                            alt={selectedService.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-custom-black text-lg">{selectedService.name}</h4>
                                <p className="text-sm text-gray-600">{selectedService.description}</p>
                              </div>
                              {selectedService.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold">{selectedService.rating}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-dark-blue font-semibold">{selectedService.price}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-dark-blue" />
                              <span className="text-sm font-medium text-gray-600">ที่นั่ง</span>
                            </div>
                            <p className="font-semibold text-custom-black">
                              {mockCarDetails[selectedService.id].seats} ที่นั่ง
                            </p>
                          </div>

                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Car className="w-4 h-4 text-dark-blue" />
                              <span className="text-sm font-medium text-gray-600">เกียร์</span>
                            </div>
                            <p className="font-semibold text-custom-black">
                              {mockCarDetails[selectedService.id].transmission}
                            </p>
                          </div>

                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Wind className="w-4 h-4 text-dark-blue" />
                              <span className="text-sm font-medium text-gray-600">เชื้อเพลิง</span>
                            </div>
                            <p className="font-semibold text-custom-black">
                              {mockCarDetails[selectedService.id].fuelType}
                            </p>
                          </div>

                          <div className="p-3 bg-pale-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="w-4 h-4 text-dark-blue" />
                              <span className="text-sm font-medium text-gray-600">ประกัน</span>
                            </div>
                            <p className="font-semibold text-custom-black text-xs">
                              {mockCarDetails[selectedService.id].insurance}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-pale-blue/30 rounded-lg">
                          <h5 className="font-semibold text-custom-black mb-2">สิ่งอำนวยความสะดวก</h5>
                          <div className="flex flex-wrap gap-2">
                            {mockCarDetails[selectedService.id].features.map((feature, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white text-dark-blue text-sm rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleAddServiceToTrip(
                              selectedService,
                              `${selectedService.description} - ${selectedService.price}`,
                            )
                          }
                          className="w-full py-3 bg-dark-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                          เลือกรถคันนี้
                        </button>
                      </div>
                    )}
                  </div>
                )}
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

      {showFullRouteMap && (
        <div className="fixed inset-0 z-[60] bg-white">
          <TripRouteDisplay
            onClose={handleCloseFullRouteMap}
            events={
              days.flatMap((day) => {
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
            }
          />
        </div>
      )}
    </section>
  )
}
