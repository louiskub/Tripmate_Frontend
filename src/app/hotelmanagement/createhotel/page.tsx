"use client"

import { useState, useEffect } from "react" // 1. ลบ useRef
import Navbar from "@/components/navbar/navbar"
import VendorSideNav from "@/components/navbar/hotelvendorsidenav"
import axios from "axios"
import Cookies from "js-cookie"
import { endpoints } from "@/config/endpoints.config"
import LocationModal from "@/app/hotelmanagement/createhotel/LocationModal"
// 2. ลบ imageCompression

// Type สำหรับ Form Data
type HotelFormData = {
  name: string
  type: string
  description: string
  serviceDescription: string
  locationId: string
  star: number
  facilities: string
  checkIn: string
  checkOut: string
  breakfast: string
  petAllow: boolean
  contact: string
  locationSummary: string
  nearbyLocations: string
  policy: string
}

export default function CreateHotelPage() {
  // 3. ลบ State ที่เกี่ยวกับไฟล์
  // const [file, setFile] = useState<File | null>(null)
  // const [preview, setPreview] = useState<string | null>(null)
  // const inputRef = useRef<HTMLInputElement | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)

  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    type: "",
    description: "",
    serviceDescription: "",
    locationId: "",
    star: 5,
    facilities: "",
    checkIn: "14:00",
    checkOut: "12:00",
    breakfast: "",
    petAllow: false,
    contact: "",
    locationSummary: "",
    nearbyLocations: "",
    policy: "",
  })

  // 4. ลบ useEffect ของ Preview และฟังก์ชันจัดการไฟล์
  
  // 5. ⭐️ (คืนชีพ) ฟังก์ชัน handleChange กลับมาแล้วครับ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }))
    }
  }

  // 6. ลบ getCompressedImageDataUrl

  // 7. ฟังก์ชันสร้างโรงแรม (ฉบับไม่ส่งรูป)
  const handleCreateHotel = async () => {
    setError(null)

    if (!formData.locationId) {
      alert("กรุณาระบุ Location ID")
      return
    }

    setIsLoading(true)
    const token = Cookies.get("token")
    if (!token) {
      setError("No token found. Please login.")
      setIsLoading(false)
      return
    }

    try {
      // --- ขั้นตอนที่ 0: ตรวจสอบ Location ID ---
      try {
        console.log(`Checking location ID: ${formData.locationId}`)
        await axios.get(endpoints.location.Search(formData.locationId), {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Location ID validated successfully.")
      } catch (locationErr) {
        throw new Error(
          "Location ID not found in database. Please create it first."
        )
      }

      // --- ขั้นตอนที่ 1: (ข้ามการอัปโหลดรูป) ---
      const imageDataUrl = "" // ⭐️ (ส่งค่าว่าง)

      // --- ขั้นตอนที่ 2: เตรียม JSON Payload ---
      const facilitiesObject = formData.facilities
        .split(",")
        .reduce((acc, fac) => {
          const key = fac.trim()
          if (key) acc[key] = true
          return acc
        }, {} as Record<string, any>)

      const nearbyArray = formData.nearbyLocations
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc)

      const payloadBase64 = token.split(".")[1]
      const decoded = JSON.parse(atob(payloadBase64))
      const userId = decoded.sub || decoded.id
      if (!userId) throw new Error("Token ไม่ถูกต้อง")

      const userresponse = await axios.get(endpoints.user.profile(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Profile response data:", userresponse.data)
      const ownerId = userresponse.data.id // ⭐️ (ดึง ID จาก Profile)
      console.log("Fetched owner ID from profile:", ownerId)
      if (!userId) throw new Error("ไม่พบ Owner ID จากการดึง Profile") // ⭐️ (แก้ตัวแปรที่เช็ค)

      const payload = {
        dto: {
          ownerId: userId, // ⭐️ (แก้เป็น ownerId)
          locationId: formData.locationId,
          name: formData.name,
          description: formData.serviceDescription,
          serviceImg: imageDataUrl, // ⭐️ ใช้ค่าว่าง
          status: "active",
          type: formData.type,
        },
        createHotelDto: {
          name: formData.name,
          type: formData.type,
          star: formData.star,
          description: formData.description,
          image: imageDataUrl, // ⭐️ ใช้ค่าว่าง
          pictures: [], // ⭐️ ส่ง Array ว่าง
          facilities: facilitiesObject,
          rating: 0,
          subtopicRatings: {
            cleanliness: 0,
            staff: 0,
            location: 0,
            comfort: 0,
          },
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          breakfast: formData.breakfast,
          petAllow: formData.petAllow,
          contact: formData.contact,
          locationSummary: formData.locationSummary,
          nearbyLocations: nearbyArray,
        },
      }

      // --- ขั้นตอนที่ 3: ส่ง JSON Payload ไปยัง API ---
      await axios.post(endpoints.user_services.createhotel, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      alert("สร้างโรงแรมสำเร็จ!")
      // TODO: Redirect
    } catch (err) {
      console.error(err)
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred."
      setError(errorMessage)
      alert(`เกิดข้อผิดพลาด: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // (ฟังก์ชันเมื่อสร้าง Location เสร็จ)
  const handleLocationCreated = (newLocation: any) => {
    if (newLocation && newLocation.id) {
      setFormData((prev) => ({ ...prev, locationId: newLocation.id }))
    }
  }

  // --- 8. ⭐️ JSX (Layout ที่จัดแล้ว) ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <VendorSideNav />
        <main className="flex-1 p-4 sm:p-7">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">
            Create Hotel
          </h1>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Layout คอลัมน์เดียว */}
          <div className="flex flex-col gap-5">
            
            {/* คอลัมน์สำหรับฟอร์ม (w-full) */}
            <div className="w-full">
              <div className="bg-white rounded-[10px] border-2 border-sky-300 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">
                  Hotel Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Hotel Name */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Type */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Type (e.g., hotel, resort)
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Service Description */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Service Description (For Service DTO)
                    </label>
                    <textarea
                      rows={3}
                      name="serviceDescription"
                      value={formData.serviceDescription}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full px-3 py-2 bg-white rounded-[10px] border-2 border-blue-200 resize-none"
                      placeholder="e.g., Luxury resort by the beach"
                    />
                  </div>
                  {/* Hotel Description */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Hotel Description (For Hotel DTO)
                    </label>
                    <textarea
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full px-3 py-2 bg-white rounded-[10px] border-2 border-blue-200 resize-none"
                      placeholder="e.g., Hotel with outdoor pool and seaside restaurant..."
                    />
                  </div>
                  {/* Star */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Star (1-5)
                    </label>
                    <input
                      type="number"
                      name="star"
                      min="1"
                      max="5"
                      value={formData.star}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Contact */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Contact (Phone Number)
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Check-in */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Check-in time (e.g., 14:00)
                    </label>
                    <input
                      type="text"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Check-out */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Check-out time (e.g., 12:00)
                    </label>
                    <input
                      type="text"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Breakfast */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Breakfast (e.g., Buffet, Included)
                    </label>
                    <input
                      type="text"
                      name="breakfast"
                      value={formData.breakfast}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200"
                    />
                  </div>
                  {/* Facilities */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Facilities (comma separated, e.g., pool, spa, gym)
                    </label>
                    <textarea
                      rows={3}
                      name="facilities"
                      value={formData.facilities}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full px-3 py-2 bg-white rounded-[10px] border-2 border-blue-200 resize-none"
                      placeholder="pool, spa, gym, wifi"
                    />
                  </div>
                  {/* Location ID */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Location ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange} // ⭐️ (ต้องมี)
                        className="flex-1 w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200"
                        placeholder="e.g., loc_001 (must exist in system)"
                      />
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="px-4 h-10 bg-green-500 text-white rounded-[10px] hover:bg-green-600"
                      >
                        New
                      </button>
                    </div>
                  </div>
                  {/* Location Summary */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Location Summary (Address)
                    </label>
                    <input
                      type="text"
                      name="locationSummary"
                      value={formData.locationSummary}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200"
                    />
                  </div>
                  {/* Nearby Locations */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Nearby Locations (comma separated)
                    </label>
                    <input
                      type="text"
                      name="nearbyLocations"
                      value={formData.nearbyLocations}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200"
                      placeholder="Patong Beach, Jungceylon Mall"
                    />
                  </div>
                  {/* Policy */}
                  <div>
                    <label className="block text-slate-900 text-base font-medium mb-2">
                      Policy
                    </label>
                    <input
                      type="text"
                      name="policy"
                      value={formData.policy}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200"
                    />
                  </div>
                  {/* Pet Allow */}
                  <div className="flex items-center pt-5">
                    <input
                      type="checkbox"
                      id="petAllow"
                      name="petAllow"
                      checked={formData.petAllow}
                      onChange={handleChange} // ⭐️ (ต้องมี)
                      className="w-5 h-5 text-sky-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="petAllow"
                      className="ml-3 text-base font-medium text-slate-900"
                    >
                      Pet Allowed
                    </label>
                  </div>
                </div>

                {/* ปุ่ม Create ย้ายมาไว้ท้ายฟอร์ม */}
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleCreateHotel}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-8 py-3 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:bg-gray-400"
                  >
                    {isLoading ? "Creating..." : "Create Hotel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Render Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationCreated={handleLocationCreated}
      />
    </div>
  )
}