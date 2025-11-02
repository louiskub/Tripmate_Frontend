"use client"

import { useState, useEffect, useRef } from "react"
import { X, Camera, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"

const InfoCard = ({ title, children }) => (
  <div className="p-4 bg-white rounded-lg border border-neutral-200 w-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-4 text-sm text-gray-600">{children}</div>
  </div>
)

const EditableField = ({ label, name, value, onChange, isEditing, type = "text" }) => {
  if (isEditing) {
    return (
      <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-500">
          {label}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
    )
  }
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  )
}

const StatusBadge = ({ status }: { status: "available" | "rented" | "under repair" }) => {
  const statusStyles = {
    available: "bg-green-100 text-green-800",
    rented: "bg-yellow-100 text-yellow-800",
    "under repair": "bg-red-100 text-red-800",
  }

  const statusLabels = {
    available: "Available",
    rented: "Rented",
    "under repair": "Under Repair",
  }

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  )
}

export default function CarDetailModal({ isOpen, onClose, car, onSave, onRemove }) {
  const [isEditing, setIsEditing] = useState(false)

  const [editedCar, setEditedCar] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    pictures: [] as string[],
    image: "",
    description: "",
    id: "",
    crcId: "",
    transmission: "",
    fuelType: "",
    seats: "",
    doors: "",
    luggage: "",
    pricePerDay: "",
    pricePerHour: "",
    deposit: "",
    insurance: {} as any,
    currency: "THB",
    mileageLimitKm: "",
    features: [] as string[],
    availability: {} as any,
    status: "available" as "available" | "rented" | "under repair",
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (car) {
      setEditedCar({
        ...car,
        pictures: car.pictures || [],
        features: car.features || [],
        insurance: car.insurance || {},
        availability: car.availability || {},
        status: car.status || "available",
      })
      setCurrentImageIndex(0)
    }
    setIsEditing(false)
  }, [car])

  if (!isOpen || !car) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("insurance.")) {
      const insuranceField = name.split(".")[1]
      setEditedCar((prev) => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          [insuranceField]: value,
        },
      }))
    } else {
      setEditedCar((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file))

      setEditedCar((prev) => {
        const updatedPictures = [...prev.pictures, ...newImageUrls]
        if (prev.pictures.length === 0 && updatedPictures.length > 0) {
          setCurrentImageIndex(0)
        }
        return { ...prev, pictures: updatedPictures }
      })
    }
  }

  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditedCar((prev) => {
      const newPictures = prev.pictures.filter((_, i) => i !== currentImageIndex)
      if (currentImageIndex >= newPictures.length) {
        setCurrentImageIndex(Math.max(0, newPictures.length - 1))
      }
      return { ...prev, pictures: newPictures }
    })
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const images = editedCar.pictures.length > 0 ? editedCar.pictures : editedCar.image ? [editedCar.image] : []
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const images = editedCar.pictures.length > 0 ? editedCar.pictures : editedCar.image ? [editedCar.image] : []
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const handleSave = () => {
    const formattedData = {
      name: editedCar.name,
      id: editedCar.id,
      crcId: localStorage.getItem("serviceId"),
      model: editedCar.model,
      description: editedCar.description,
      seats: Number.parseInt(editedCar.seats) || 0,
      pricePerDay: Number.parseFloat(editedCar.pricePerDay) || 0,
      pricePerHour: Number.parseFloat(editedCar.pricePerHour) || 0,
      brand: editedCar.brand,
      currency: editedCar.currency,
      deposit: Number.parseFloat(editedCar.deposit) || 0,
      doors: Number.parseInt(editedCar.doors) || 0,
      features: editedCar.features,
      fuelType: editedCar.fuelType,
      luggage: Number.parseInt(editedCar.luggage) || 0,
      mileageLimitKm: Number.parseInt(editedCar.mileageLimitKm) || 0,
      pictures: editedCar.pictures,
      insurance: editedCar.insurance,
      transmission: editedCar.transmission,
      year: Number.parseInt(editedCar.year) || new Date().getFullYear(),
    }
    onSave(formattedData)
    setIsEditing(false)
    onClose()
  }

  const handleCancel = () => {
    setEditedCar({
      ...car,
      pictures: car.pictures || [],
      features: car.features || [],
      insurance: car.insurance || {},
      availability: car.availability || {},
      status: car.status || "available",
    })
    setCurrentImageIndex(0)
    setIsEditing(false)
  }

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove "${car.name}"?`)) {
      onRemove?.(car)
      onClose()
    }
  }

  const displayImages = isEditing
    ? editedCar.pictures.length > 0
      ? editedCar.pictures
      : editedCar.image
        ? [editedCar.image]
        : []
    : car?.pictures?.length > 0
      ? car.pictures
      : car?.image
        ? [car.image]
        : []

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditing
              ? `${editedCar?.name || `${editedCar?.brand} ${editedCar?.model}`}`
              : `${car?.name || `${car?.brand} ${car?.model}`}`}
          </h2>
          {!isEditing && <StatusBadge status={car?.status || "available"} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            {/* Image Carousel */}
            <div className="relative aspect-video w-full h-100 rounded-lg shadow-md overflow-hidden group">
              {displayImages && displayImages.length > 0 ? (
                <img
                  src={displayImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`${car?.name || "Car"} image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
              )}
              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-lg"
                  >
                    <Camera size={48} />
                    <p className="mt-2 font-semibold">
                      {displayImages.length > 0 ? "Change/Add Images" : "Upload Images"}
                    </p>
                  </button>
                  {displayImages.length > 0 && (
                    <button
                      onClick={handleRemoveCurrentImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 transition-opacity opacity-80 hover:opacity-100"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}
                </>
              )}
              {displayImages.length > 1 && (
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
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {displayImages.length}
                  </div>
                </>
              )}
            </div>

            <InfoCard title="Description">
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedCar?.description || ""}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <div className="h-28 overflow-y-auto pr-2">
                  <p className="text-sm text-gray-600 leading-relaxed break-words">
                    {car?.description || "No description available"}
                  </p>
                </div>
              )}
            </InfoCard>

            <InfoCard title="Features">
              <div className="flex flex-wrap gap-2">
                {(car?.features || []).map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {feature}
                  </span>
                ))}
              </div>
            </InfoCard>
          </div>

          <div className="flex flex-col gap-6">
            <InfoCard title="Car Information">
              <EditableField
                label="Brand"
                name="brand"
                value={editedCar?.brand || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableField
                label="Model"
                name="model"
                value={editedCar?.model || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableField
                label="Year"
                name="year"
                value={`${editedCar?.year || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Car ID"
                name="id"
                value={editedCar?.id || ""}
                onChange={handleChange}
                isEditing={0}
              />
              {isEditing ? (
                <div>
                  <label htmlFor="status" className="block text-xs font-medium text-gray-500">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={editedCar?.status || "available"}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="under repair">Under Repair</option>
                  </select>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={car?.status || "available"} />
                </div>
              )}
              <EditableField
                label="Transmission"
                name="transmission"
                value={editedCar?.transmission || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableField
                label="Fuel Type"
                name="fuelType"
                value={editedCar?.fuelType || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableField
                label="Seats"
                name="seats"
                value={`${editedCar?.seats || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Doors"
                name="doors"
                value={`${editedCar?.doors || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Luggage"
                name="luggage"
                value={`${editedCar?.luggage || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Mileage Limit (km)"
                name="mileageLimitKm"
                value={`${editedCar?.mileageLimitKm || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
            </InfoCard>

            <InfoCard title="Rental Price">
              <EditableField
                label="Price / Day"
                name="pricePerDay"
                value={`${editedCar?.pricePerDay || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Price / Hour"
                name="pricePerHour"
                value={`${editedCar?.pricePerHour || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Deposit"
                name="deposit"
                value={`${editedCar?.deposit || ""}`}
                onChange={handleChange}
                isEditing={isEditing}
                type="number"
              />
              <EditableField
                label="Currency"
                name="currency"
                value={editedCar?.currency || "THB"}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </InfoCard>

            <InfoCard title="Insurance">
              {isEditing ? (
                <>
                  <div>
                    <label htmlFor="insurance.provider" className="block text-xs font-medium text-gray-500">
                      Provider
                    </label>
                    <input
                      type="text"
                      id="insurance.provider"
                      name="insurance.provider"
                      value={editedCar?.insurance?.provider || ""}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="insurance.coverage" className="block text-xs font-medium text-gray-500">
                      Coverage
                    </label>
                    <input
                      type="text"
                      id="insurance.coverage"
                      name="insurance.coverage"
                      value={editedCar?.insurance?.coverage || ""}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="insurance.expiry" className="block text-xs font-medium text-gray-500">
                      Expiry
                    </label>
                    <input
                      type="date"
                      id="insurance.expiry"
                      name="insurance.expiry"
                      value={editedCar?.insurance?.expiry || ""}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider:</span>
                    <span className="font-semibold text-gray-800">{car?.insurance?.provider || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coverage:</span>
                    <span className="font-semibold text-gray-800">{car?.insurance?.coverage || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expiry:</span>
                    <span className="font-semibold text-gray-800">{car?.insurance?.expiry || "N/A"}</span>
                  </div>
                </>
              )}
            </InfoCard>

            <div className="w-full mt-auto flex flex-col gap-3">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                  >
                    Edit Car
                  </button>
                  <button
                    onClick={handleRemove}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove Car
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
