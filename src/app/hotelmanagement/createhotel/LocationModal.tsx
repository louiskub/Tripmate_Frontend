"use client"

import { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { endpoints } from "@/config/endpoints.config"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationCreated: (newLocation: any) => void // ส่งข้อมูล Location ใหม่กลับไป
}

// 1. สร้าง State สำหรับฟอร์ม Location
type LocationFormData = {
  name: string
  lat: string
  long: string
  detail?: string
  status?: string
  zone?: string
  country?: string
  province?: string
  address?: string
  district?: string
  street?: string
  zipCode?: string
}

export default function LocationModal({
  isOpen,
  onClose,
  onLocationCreated,
}: LocationModalProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    lat: "",
    long: "",
    detail: "",
    status: "active",
    zone: "",
    country: "Thailand",
    province: "",
    address: "",
    district: "",
    street: "",
    zipCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2. ฟังก์ชันสำหรับสร้าง Location (ฉบับเพิ่ม Validation)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // ⭐️ 1. เคลียร์ Error เก่าออกก่อนทุกครั้ง

    // --- ⭐️ 2. ส่วนดักจับ Error (Validation) ---

    // 2.1 เช็คช่องว่าง (Required fields)
    if (!formData.name.trim()) { // .trim() เพื่อกันการพิมพ์ space ว่างๆ
      setError("กรุณากรอกชื่อ (Name)")
      return
    }
    if (!formData.lat.trim()) {
      setError("กรุณากรอก Latitude (lat)")
      return
    }
    if (!formData.long.trim()) {
      setError("กรุณากรอก Longitude (long)")
      return
    }

    // 2.2 แปลงค่าเป็นตัวเลข
    const latNum = parseFloat(formData.lat)
    const longNum = parseFloat(formData.long)

    // 2.3 เช็คว่าเป็นตัวเลขที่ถูกต้อง (กัน User พิมพ์ "abc")
    if (isNaN(latNum)) {
      setError("Latitude (lat) ต้องเป็นตัวเลขเท่านั้น")
      return
    }
    if (isNaN(longNum)) {
      setError("Longitude (long) ต้องเป็นตัวเลขเท่านั้น")
      return
    }

    // 2.4 ⭐️ เช็คช่วง (Range) ของพิกัดโลก (นี่คือจุดที่แก้ Error 400)
    if (latNum < -90 || latNum > 90) {
      setError("Latitude (lat) ไม่ถูกต้อง (ต้องอยู่ระหว่าง -90 และ +90)")
      return
    }
    if (longNum < -180 || longNum > 180) {
      setError("Longitude (long) ไม่ถูกต้อง (ต้องอยู่ระหว่าง -180 และ +180)")
      return
    }
    // --- (จบส่วน Validation) ---


    // 3. ถ้าผ่านหมด ค่อยเริ่ม Loading
    setIsLoading(true)
    const token = Cookies.get("token")

    // --- 4. สร้าง Payload ที่ "สะอาด" ---
    const payload: any = {
      name: formData.name,
      lat: latNum, // ⭐️ 5. ใช้ตัวเลขที่แปลงค่าแล้ว
      long: longNum, // ⭐️ 5. ใช้ตัวเลขที่แปลงค่าแล้ว
    }

    const optionalKeys: (keyof LocationFormData)[] = [
      "detail", "status", "zone", "country", "province",
      "address", "district", "street", "zipCode",
    ]

    optionalKeys.forEach((key) => {
      if (formData[key] && formData[key] !== "") {
        payload[key] = formData[key]
      }
    })

    if (!payload.status && formData.status) {
      payload.status = formData.status
    }
    if (!payload.country && formData.country) {
      payload.country = formData.country
    }
    
    console.log("Sending CLEANED payload:", payload)

    try {
      // 6. เรียก API
      const response = await axios.post(
        endpoints.location.all,
        payload, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("สร้าง Location สำเร็จ!")
      onLocationCreated(response.data)
      onClose()
    } catch (err) {
      // 7. ⭐️ แสดง Error จาก Server (เผื่อมี Validation อื่นอีก)
      setError(axios.isAxiosError(err) ? err.message : "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {/* 5. (ปรับแก้) เพิ่ม max-h และ overflow-y-auto สำหรับฟอร์มยาว */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New Location
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* --- Fields ที่บังคับ (Required) --- */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Name (Required)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude (Required)
              </label>
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude (Required)
              </label>
              <input
                type="text"
                name="long"
                value={formData.long}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>

            {/* --- Fields ที่ไม่บังคับ (Optional) --- */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Detail
              </label>
              <textarea
                name="detail"
                rows={3}
                value={formData.detail}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded-md"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone
              </label>
              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full h-10 px-3 border-2 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-md disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}