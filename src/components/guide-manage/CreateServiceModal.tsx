"use client"

import { useState } from "react"
import { UploadCloud, X, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"

// --- [TS] 1. กำหนด Type ของข้อมูลที่ API ต้องการ (Nested) ---
interface ApiPolicyData {
  start: string
  end: string
  max_guest: number // API ควรรับเป็น number
  contact: string
}

// [ใหม่] กำหนด Type สำหรับ enum
type GuideType = "culture" | "easy" | "nature" | "adventure" | "local" | "other"

interface ApiGuideData {
  name: string
  type: GuideType
  price: number // API ควรรับเป็น number
  description: string
  location: string
  nearby_locations: string[] // API ควรรับเป็น array
  policy: ApiPolicyData
  // 'duration' ถูกลบออก (คำนวณได้จาก start/end)
  // 'rating' ถูกลบออก (ไม่ได้สร้างตอนแรก)
}

// --- [TS] 2. กำหนด Type ของข้อมูลใน Form (ใช้ State แบบ Flat เพื่อง่ายต่อการจัดการ) ---
interface GuideFormData {
  name: string
  type: GuideType
  price: string // เก็บเป็น string ใน form
  description: string
  location: string
  nearby_locations: string // ใน form ใช้ comma-separated string
  policy_start: string
  policy_end: string
  policy_max_guest: string // เก็บเป็น string ใน form
  policy_contact: string
}

// --- [TS] 3. Interface สำหรับ Props ของ FormField ---
interface FormFieldProps {
  label: string
  id: keyof GuideFormData // ใช้ key ของ flat state
  type?: string
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

// --- [TS] 4. [ใหม่] Interface สำหรับ Props ของ Select Field ---
interface FormSelectProps {
  label: string
  id: keyof GuideFormData
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: GuideType; label: string }[]
}

// --- 5. Component ย่อยสำหรับ Input Field (เหมือนเดิม) ---
const FormField = ({ label, id, type = "text", placeholder, value, onChange }: FormFieldProps) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4} // ลดขนาดลงเล็กน้อย
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
)

// --- 6. [ใหม่] Component ย่อยสำหรับ Select Field ---
const FormSelectField = ({ label, id, value, onChange, options }: FormSelectProps) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

// --- [TS] 7. Interface สำหรับ Props ของ Modal ---
// [แก้ไข] onSubmit จะส่งข้อมูลที่แปลงแล้ว (ApiGuideData) และ File objects
interface CreateServiceModalProps {
  onClose: () => void
  onSubmit?: (apiData: ApiGuideData, files: File[]) => void
}

// --- 8. Main Component ---
export default function CreateServiceModal({ onClose, onSubmit = () => {} }: CreateServiceModalProps) {
  // [แก้ไข] 8.1. ปรับ State เริ่มต้นตาม GuideFormData (Flat)
  const [formData, setFormData] = useState<GuideFormData>({
    name: "",
    type: "culture", // ค่าเริ่มต้น
    price: "",
    description: "",
    location: "",
    nearby_locations: "",
    policy_start: "",
    policy_end: "",
    policy_max_guest: "",
    policy_contact: "",
  })

  // [ใหม่] 8.2. State สำหรับเก็บ File objects
  const [imageFiles, setImageFiles] = useState<File[]>([])
  
  // (States สำหรับ Carousel - เหมือนเดิม)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 8.3. Handler สำหรับ Input/Textarea (เหมือนเดิม)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value as any }))
  }
  
  // [ใหม่] 8.4. Handler สำหรับ Select
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value as GuideType }))
  }

  // [แก้ไข] 8.5. ปรับ `handleImageChange` ให้เก็บ File objects ด้วย
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      
      // [ใหม่] เก็บ File objects
      setImageFiles((prev) => [...prev, ...filesArray])

      setImagePreviews((prev) => {
        const updatedPreviews = [...prev, ...newPreviews]
        if (prev.length === 0 && updatedPreviews.length > 0) {
          setCurrentImageIndex(0)
        }
        return updatedPreviews
      })
    }
  }

  // [แก้ไข] 8.6. ปรับ `handleRemoveCurrentImage` ให้ลบ File objects ด้วย
  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const indexToRemove = currentImageIndex
    
    // [ใหม่] ลบ File object
    const newFiles = imageFiles.filter((_, i) => i !== indexToRemove)
    setImageFiles(newFiles)

    // ลบ Preview
    const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove)
    setImagePreviews(newPreviews)
    
    if (currentImageIndex >= newPreviews.length) {
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1))
    }
  }

  // (Carousel Handlers: 8.7 & 8.8 - เหมือนเดิม)
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation() 
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagePreviews.length)
    }
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation() 
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length)
    }
  }

  // [แก้ไข] 8.9. `handleSubmit` - แปลงข้อมูล (Flat -> Nested) และส่งออก
  const handleSubmit = () => {
    
    // 1. แปลง State (Flat) ไปเป็นโครงสร้าง API (Nested)
    const apiData: ApiGuideData = {
      name: formData.name,
      type: formData.type,
      price: parseFloat(formData.price) || 0, // แปลงเป็น number
      description: formData.description,
      location: formData.location,
      // แปลง "loc1, loc2" เป็น ["loc1", "loc2"]
      nearby_locations: formData.nearby_locations.split(',').map(s => s.trim()).filter(Boolean),
      policy: {
        start: formData.policy_start,
        end: formData.policy_end,
        max_guest: parseInt(formData.policy_max_guest, 10) || 1, // แปลงเป็น number
        contact: formData.policy_contact,
      },
    }

    console.log("Submitting API data:", apiData)
    console.log("Submitting Files:", imageFiles)
    
    // 2. ส่งข้อมูลที่แปลงแล้วและ File objects กลับไปให้ Component แม่
    onSubmit(apiData, imageFiles)
    onClose()
  }

  // [ใหม่] 8.10. ตัวเลือกสำหรับ Dropdown
  const guideTypeOptions: { value: GuideType; label: string }[] = [
    { value: "culture", label: "Culture" },
    { value: "easy", label: "Easy Going" },
    { value: "nature", label: "Nature" },
    { value: "adventure", label: "Adventure" },
    { value: "local", label: "Local Experience" },
    { value: "other", label: "Other" },
  ]

  return (
    // Overlay
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          
          {/* === Form Section === */}
          <div className="w-full lg:w-1/2 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Guide</h2>

            {/* [แก้ไข] 9. อัปเดต FormFields ทั้งหมด */}
            
            <FormField
              label="Name"
              id="name"
              placeholder="e.g., Chiang Mai Day Trip"
              value={formData.name}
              onChange={handleChange}
            />
            
            <FormSelectField
              label="Type"
              id="type"
              value={formData.type}
              onChange={handleSelectChange}
              options={guideTypeOptions}
            />

            <FormField
              label="Price (THB)"
              id="price"
              type="number"
              placeholder="e.g., 2500"
              value={formData.price}
              onChange={handleChange}
            />

            <FormField
              label="Location (Google map link)"
              id="location"
              placeholder="https://maps.app.goo.gl/..."
              value={formData.location}
              onChange={handleChange}
            />
            
            <FormField
              label="Nearby Locations (comma-separated)"
              id="nearby_locations"
              type="textarea"
              placeholder="e.g., Wat Chedi Luang, Tha Phae Gate"
              value={formData.nearby_locations}
              onChange={handleChange}
            />

            <h3 className="text-lg font-semibold text-gray-700 pt-2">Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Start Time"
                id="policy_start"
                type="time" 
                value={formData.policy_start}
                onChange={handleChange}
              />
              <FormField
                label="End Time"
                id="policy_end"
                type="time"
                value={formData.policy_end}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Max guests"
                id="policy_max_guest"
                type="number"
                placeholder="e.g., 10"
                value={formData.policy_max_guest}
                onChange={handleChange}
              />
              <FormField
                label="Contact"
                id="policy_contact"
                placeholder="e.g., 081-234-5678"
                value={formData.policy_contact}
                onChange={handleChange}
              />
            </div>
            
            <FormField
              label="Description"
              id="description"
              type="textarea"
              placeholder="Describe the guide service..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* === Image Upload Section (Carousel) === */}
          {/* (ส่วนนี้เหมือนเดิม ไม่มีการแก้ไข) */}
          <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Guide Images</h3>

            <div
              className="relative h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 overflow-hidden"
              onClick={() => (document.getElementById("imageUpload") as HTMLInputElement)?.click()}
            >
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              {imagePreviews.length === 0 ? (
                // --- ถ้าไม่มีภาพ ---
                <div className="text-gray-500 p-4">
                  <UploadCloud size={48} className="mx-auto mb-2" />
                  <p className="font-semibold">Click to upload images</p>
                  <p className="text-xs">PNG, JPG, etc. (Multiple files supported)</p>
                </div>
              ) : (
                // --- ถ้ามีภาพ ---
                <>
                  <img
                    src={imagePreviews[currentImageIndex]}
                    alt={`Preview ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover" 
                  />
                  
                  <button
                    onClick={handleRemoveCurrentImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 transition-opacity opacity-80 hover:opacity-100"
                    type="button"
                  >
                    <X size={16} />
                  </button>

                  {imagePreviews.length > 1 && (
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 transition-opacity opacity-70 hover:opacity-100"
                      type="button"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  
                  {imagePreviews.length > 1 && (
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 transition-opacity opacity-70 hover:opacity-100"
                      type="button"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {imagePreviews.length}
                  </div>
                </>
              )}
            </div>

            {/* (ปุ่ม Submit/Cancel - เหมือนเดิม) */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Guide
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}