"use client"

import { useState, useEffect } from "react"
import { X, UploadCloud, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"

// --- Component ย่อยสำหรับ Input Field ---
const FormField = ({ label, id, type = "text", placeholder, value, onChange, required = false }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : type === "select" ? (
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {id === "transmission" && (
          <>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </>
        )}
        {id === "fuelType" && (
          <>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </>
        )}
      </select>
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

// --- Main Component ---
export default function AddNewCarModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    crcId: "",
    model: "",
    description: "",
    seats: "",
    pricePerDay: "",
    pricePerHour: "",
    brand: "",
    currency: "THB",
    deposit: "",
    doors: "",
    features: "",
    fuelType: "",
    luggage: "",
    mileageLimitKm: "",
    transmission: "",
    year: "",
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))

      setImagePreviews((prev) => {
        const updatedPreviews = [...prev, ...newPreviews]
        if (prev.length === 0 && updatedPreviews.length > 0) {
          setCurrentImageIndex(0)
        }
        return updatedPreviews
      })
    }
  }

  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const indexToRemove = currentImageIndex
    const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove)
    setImagePreviews(newPreviews)
    if (currentImageIndex >= newPreviews.length) {
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1))
    }
  }

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

  const resetAndClose = () => {
    setFormData({
      name: "",
      id: "",
      crcId: "",
      model: "",
      description: "",
      seats: "",
      pricePerDay: "",
      pricePerHour: "",
      brand: "",
      currency: "THB",
      deposit: "",
      doors: "",
      features: "",
      fuelType: "",
      luggage: "",
      mileageLimitKm: "",
      transmission: "",
      year: "",
    })
    setImagePreviews([])
    setCurrentImageIndex(0)
    onClose()
  }

  const handleSubmit = () => {
    // Convert string values to appropriate types and format features array
    const formattedData = {
      name: formData.name,
      id: formData.id,
      crcId: formData.crcId,
      model: formData.model,
      description: formData.description,
      seats: Number.parseInt(formData.seats) || 0,
      pricePerDay: Number.parseFloat(formData.pricePerDay) || 0,
      pricePerHour: Number.parseFloat(formData.pricePerHour) || 0,
      brand: formData.brand,
      currency: formData.currency,
      deposit: Number.parseFloat(formData.deposit) || 0,
      doors: Number.parseInt(formData.doors) || 0,
      features: formData.features ? formData.features.split(",").map((f) => f.trim()) : [],
      fuelType: formData.fuelType,
      luggage: Number.parseInt(formData.luggage) || 0,
      mileageLimitKm: Number.parseInt(formData.mileageLimitKm) || 0,
      pictures: imagePreviews,
      transmission: formData.transmission,
      year: Number.parseInt(formData.year) || new Date().getFullYear(),
    }

    onSubmit(formattedData)
    resetAndClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Rental Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <FormField
                label="Car Name"
                id="name"
                placeholder="e.g., Toyota Yaris Ativ"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FormField
                label="Car ID"
                id="id"
                placeholder="e.g., ดด5678"
                value={formData.id}
                onChange={handleChange}
                required
              />
              <FormField
                label="CRC ID"
                id="crcId"
                placeholder="e.g., svc-003"
                value={formData.crcId}
                onChange={handleChange}
                required
              />
              <FormField
                label="Brand"
                id="brand"
                placeholder="e.g., Toyota"
                value={formData.brand}
                onChange={handleChange}
              />
              <FormField
                label="Model"
                id="model"
                placeholder="e.g., Yaris Ativ 1.2 Sport"
                value={formData.model}
                onChange={handleChange}
              />
              <FormField
                label="Year"
                id="year"
                type="number"
                placeholder="e.g., 2023"
                value={formData.year}
                onChange={handleChange}
              />

              {/* Specifications */}
              <FormField
                label="Seats"
                id="seats"
                type="number"
                placeholder="e.g., 4"
                value={formData.seats}
                onChange={handleChange}
              />
              <FormField
                label="Doors"
                id="doors"
                type="number"
                placeholder="e.g., 4"
                value={formData.doors}
                onChange={handleChange}
              />
              <FormField
                label="Luggage Capacity"
                id="luggage"
                type="number"
                placeholder="e.g., 2"
                value={formData.luggage}
                onChange={handleChange}
              />
              <FormField
                label="Transmission"
                id="transmission"
                type="select"
                placeholder="Select transmission"
                value={formData.transmission}
                onChange={handleChange}
              />
              <FormField
                label="Fuel Type"
                id="fuelType"
                type="select"
                placeholder="Select fuel type"
                value={formData.fuelType}
                onChange={handleChange}
              />
              <FormField
                label="Mileage Limit (km/day)"
                id="mileageLimitKm"
                type="number"
                placeholder="e.g., 300"
                value={formData.mileageLimitKm}
                onChange={handleChange}
              />

              {/* Pricing */}
              <FormField
                label="Price per Day (THB)"
                id="pricePerDay"
                type="number"
                placeholder="e.g., 1200.50"
                value={formData.pricePerDay}
                onChange={handleChange}
              />
              <FormField
                label="Price per Hour (THB)"
                id="pricePerHour"
                type="number"
                placeholder="e.g., 180.25"
                value={formData.pricePerHour}
                onChange={handleChange}
              />
              <FormField
                label="Deposit (THB)"
                id="deposit"
                type="number"
                placeholder="e.g., 3000"
                value={formData.deposit}
                onChange={handleChange}
              />
              <FormField
                label="Currency"
                id="currency"
                placeholder="THB"
                value={formData.currency}
                onChange={handleChange}
              />

              {/* Description and Features */}
              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  id="description"
                  type="textarea"
                  placeholder="Describe the car..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  label="Features (comma-separated)"
                  id="features"
                  placeholder="e.g., Air Conditioner, Bluetooth, ABS, Airbags"
                  value={formData.features}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* คอลัมน์ขวา: Image Uploader */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Images</h3>
            <div
              className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100 overflow-hidden"
              onClick={() => (document.getElementById("imageUpload") as HTMLInputElement)?.click()}
            >
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                multiple
              />
              {imagePreviews.length === 0 ? (
                <div className="text-gray-500">
                  <UploadCloud size={48} className="mx-auto mb-2" />
                  <p className="font-semibold">Click to upload images</p>
                  <p className="text-xs">PNG, JPG, etc. (Multiple files supported)</p>
                </div>
              ) : (
                <>
                  <img
                    src={imagePreviews[currentImageIndex] || "/placeholder.svg"}
                    alt={`Car preview ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain rounded-md"
                  />
                  <button
                    onClick={handleRemoveCurrentImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 transition-opacity opacity-80 hover:opacity-100"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                  {imagePreviews.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 transition-opacity opacity-70 hover:opacity-100"
                        type="button"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 transition-opacity opacity-70 hover:opacity-100"
                        type="button"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {imagePreviews.length}
                  </div>
                </>
              )}
            </div>

            {/* ปุ่ม */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Rental Car
              </button>
              <button
                onClick={resetAndClose}
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
