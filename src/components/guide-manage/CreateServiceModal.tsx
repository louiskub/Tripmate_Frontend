"use client"

import { useState } from "react"
// [แก้ไข] 1. import ไอคอนสำหรับเลื่อนซ้าย/ขวาเพิ่ม
import { UploadCloud, X, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"

// --- [TS] 1. กำหนด Type ของข้อมูลใน Form --- (เหมือนเดิม)
interface GuideFormData {
  postName: string
  maxGuests: string
  contact: string
  province: string
  googleMap: string
  duration: string
  cost: string
  description: string
}

// --- [TS] 2. Interface สำหรับ Props ของ FormField --- (เหมือนเดิม)
interface FormFieldProps {
  label: string
  id: keyof GuideFormData
  type?: string
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

// --- 3. Component ย่อยสำหรับ Input Field (เหมือนเดิม) ---
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
        rows={5}
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

// --- [TS] 4. Interface สำหรับ Props ของ Modal (เหมือนเดิม) ---
interface CreateServiceModalProps {
  onClose: () => void
  onSubmit?: (formData: GuideFormData) => void
}

// --- 5. Main Component ---
export default function CreateServiceModal({ onClose, onSubmit = () => {} }: CreateServiceModalProps) {
  // (States ... )
  const [formData, setFormData] = useState<GuideFormData>({
    postName: "",
    maxGuests: "",
    contact: "",
    province: "",
    googleMap: "",
    duration: "",
    cost: "",
    description: "",
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  // [ใหม่] 2. เพิ่ม State สำหรับเก็บลำดับภาพที่แสดงอยู่
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // [แก้ไข] 3. ปรับ `handleImageChange` ให้ตั้งค่า index เมื่อเพิ่มภาพชุดแรก
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      
      setImagePreviews((prev) => {
        const updatedPreviews = [...prev, ...newPreviews]
        // ถ้าเป็นการอัปโหลดครั้งแรก (prev.length === 0) ให้ตั้งค่า index ไปที่ 0
        if (prev.length === 0 && updatedPreviews.length > 0) {
          setCurrentImageIndex(0)
        }
        return updatedPreviews
      })
    }
  }

  // [แก้ไข] 4. เปลี่ยน `handleRemoveImage` เป็น `handleRemoveCurrentImage`
  // เพื่อลบภาพที่ *กำลังแสดงอยู่* ใน Carousel
  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation() // ป้องกันไม่ให้ trigger การคลิกเพื่ออัปโหลด
    
    const indexToRemove = currentImageIndex
    const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove)
    setImagePreviews(newPreviews)
    
    // ปรับ index หลังจากลบ
    if (currentImageIndex >= newPreviews.length) {
      // ถ้าลบภาพสุดท้าย ให้เลื่อนไปแสดงภาพก่อนหน้า (หรือ 0 ถ้าหมดแล้ว)
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1))
    }
    // ถ้าลบภาพอื่นที่ไม่ใช่ภาพสุดท้าย index จะชี้ไปที่ภาพถัดไปโดยอัตโนมัติ
  }

  // [ใหม่] 5. ฟังก์ชันสำหรับเลื่อนภาพถัดไป
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation() // ป้องกันไม่ให้ trigger การคลิกเพื่ออัปโหลด
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagePreviews.length)
    }
  }

  // [ใหม่] 6. ฟังก์ชันสำหรับเลื่อนภาพก่อนหน้า
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation() // ป้องกันไม่ให้ trigger การคลิกเพื่ออัปโหลด
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length)
    }
  }

  const handleSubmit = () => {
    console.log("Submitting Guide data:", formData)
    // หมายเหตุ: คุณต้องจัดการ `imagePreviews` (ซึ่งเป็น object URLs)
    // โดยการอัปโหลดไฟล์จริง (จาก `e.target.files` ที่ควรเก็บไว้ใน state อื่น) ไปยัง server ของคุณ
    onSubmit(formData)
    onClose()
  }

  return (
    // Overlay (พื้นหลัง)
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Guide</h2>

            {/* ... FormFields ทั้งหมด (เหมือนเดิม) ... */}
            <FormField
              label="Post Name"
              id="postName"
              placeholder="e.g., Chiang Mai Day Trip"
              value={formData.postName}
              onChange={handleChange}
            />
            <FormField
              label="Max guests"
              id="maxGuests"
              type="number"
              placeholder="e.g., 10"
              value={formData.maxGuests}
              onChange={handleChange}
            />
            <FormField
              label="Contact"
              id="contact"
              placeholder="e.g., 081-234-5678"
              value={formData.contact}
              onChange={handleChange}
            />
            <FormField
              label="Province"
              id="province"
              placeholder="e.g., Chiang Mai"
              value={formData.province}
              onChange={handleChange}
            />
            <FormField
              label="Google map link"
              id="googleMap"
              placeholder="https://maps.app.goo.gl/..."
              value={formData.googleMap}
              onChange={handleChange}
            />
            <FormField
              label="Duration"
              id="duration"
              placeholder="e.g., 8 hours"
              value={formData.duration}
              onChange={handleChange}
            />
            <FormField
              label="Cost (THB)"
              id="cost"
              type="number"
              placeholder="e.g., 2500"
              value={formData.cost}
              onChange={handleChange}
            />
            <FormField
              label="Description"
              id="description"
              type="textarea"
              placeholder="Describe the guide service..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Guide Images</h3>

            {/* [แก้ไข] 7. ลบ Grid แสดงภาพตัวอย่างเดิมทิ้ง */}
            {/* <div className="grid grid-cols-2 gap-3 mb-4">
                ... (โค้ดเดิมถูกลบ) ...
              </div>
            */}

            {/* [แก้ไข] 8. ปรับปรุงกล่องอัปโหลดไฟล์ */}
            <div
              className="relative h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 overflow-hidden" // [แก้ไข] เพิ่ม `relative`, `overflow-hidden` และปรับ `h`
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

              {/* [ใหม่] 9. ใช้ Conditional Rendering */}
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
                  {/* แสดงภาพปัจจุบัน */}
                  <img
                    src={imagePreviews[currentImageIndex]}
                    alt={`Preview ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover" // ให้ภาพเต็มพื้นที่กล่อง
                  />
                  
                  {/* ปุ่มลบภาพปัจจุบัน */}
                  <button
                    onClick={handleRemoveCurrentImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 transition-opacity opacity-80 hover:opacity-100"
                    type="button"
                  >
                    <X size={16} />
                  </button>

                  {/* ปุ่มเลื่อนซ้าย (แสดงเมื่อมีมากกว่า 1 ภาพ) */}
                  {imagePreviews.length > 1 && (
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 transition-opacity opacity-70 hover:opacity-100"
                      type="button"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  
                  {/* ปุ่มเลื่อนขวา (แสดงเมื่อมีมากกว่า 1 ภาพ) */}
                  {imagePreviews.length > 1 && (
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 transition-opacity opacity-70 hover:opacity-100"
                      type="button"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}

                  {/* ตัวนับจำนวนภาพ */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {imagePreviews.length}
                  </div>
                </>
              )}
            </div>

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