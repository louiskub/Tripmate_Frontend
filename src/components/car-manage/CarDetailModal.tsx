"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, Trash2, ChevronLeft, ChevronRight } from "lucide-react"; 
import type React from "react";
// [ใหม่] 1. Import ConfirmModal
import ConfirmModal from "@/components/ui/ConfirmModal"; // (ตรวจสอบ Path ให้ถูกต้อง)

// --- (InfoCard, EditableField, StatusBadge components... เหมือนเดิม) ---
const InfoCard = ({ title, children }) => (
  <div className="p-4 bg-white rounded-lg border border-neutral-200 w-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-4 text-sm text-gray-600">{children}</div>
  </div>
);

const EditableField = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
}) => {
  if (isEditing) {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-xs font-medium text-gray-500"
        >
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
    );
  }
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Rented: "bg-yellow-100 text-yellow-800",
    "Under Repair": "bg-red-100 text-red-800",
    Unavailable: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};
// --- (จบส่วน components ย่อย) ---


export default function CarDetailModal({ isOpen, onClose, car, onSave, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  // [ใหม่] 2. เพิ่ม State สำหรับควบคุม Modal ยืนยัน
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [editedCar, setEditedCar] = useState({
    name: "",
    imageUrls: [] as string[], 
    description: "",
    registration: "",
    transmission: "",
    engine: "",
    fuel: "",
    passengers: "",
    price: "",
    deposit: "",
    insurance: "",
    status: "",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (car) {
      setEditedCar({ 
        ...car,
        imageUrls: car.imageUrls || [] 
      });
      setCurrentImageIndex(0); 
    }
    setIsEditing(false);
  }, [car]);

  if (!isOpen || !car) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCar((prev) => ({ ...prev, [name]: value }));
  };

  // --- (ฟังก์ชันจัดการรูปภาพ handleImageChange, handleRemoveCurrentImage, handleNextImage, handlePrevImage... เหมือนเดิม) ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      
      setEditedCar((prev) => {
        const updatedImageUrls = [...prev.imageUrls, ...newImageUrls];
        if (prev.imageUrls.length === 0 && updatedImageUrls.length > 0) {
          setCurrentImageIndex(0);
        }
        return { ...prev, imageUrls: updatedImageUrls };
      });
    }
  };

  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setEditedCar((prev) => {
      const newImageUrls = prev.imageUrls.filter((_, i) => i !== currentImageIndex);
      if (currentImageIndex >= newImageUrls.length) {
        setCurrentImageIndex(Math.max(0, newImageUrls.length - 1));
      }
      return { ...prev, imageUrls: newImageUrls };
    });
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (editedCar.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % editedCar.imageUrls.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (editedCar.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + editedCar.imageUrls.length) % editedCar.imageUrls.length);
    }
  };
  // --- (จบฟังก์ชันจัดการรูปภาพ) ---


  const handleSave = () => {
    onSave(editedCar);
    setIsEditing(false);
    onClose(); 
  };

  const handleCancel = () => {
    setEditedCar({ ...car, imageUrls: car.imageUrls || [] }); 
    setCurrentImageIndex(0); 
    setIsEditing(false);
  };

  // [แก้ไข] 3. แก้ไข `handleRemove` ให้เปิด Modal ยืนยัน
  const handleRemove = () => {
    // if (confirm(...)) { ... } // <-- ลบอันเก่าทิ้ง
    setIsConfirmOpen(true); // <-- เปลี่ยนเป็นเปิด Modal
  };

  // [ใหม่] 4. สร้างฟังก์ชันสำหรับการยืนยันลบ
  const handleConfirmRemove = () => {
    onRemove?.(car);       // 1. สั่งลบรถ (เหมือนเดิม)
    setIsConfirmOpen(false); // 2. ปิด Modal ยืนยัน
    onClose();               // 3. ปิด Modal รายละเอียด
  };

  const displayImageUrls = isEditing ? editedCar.imageUrls : (car?.imageUrls || []);

  return (
    // [ใหม่] 5. หุ้มด้วย Fragment (<>) เพื่อให้ render Modal ซ้อนกันได้
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto p-8">
          {/* (ปุ่มปิด, ชื่อรถ ... เหมือนเดิม) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEditing ? editedCar?.name || "" : car?.name || ""}
            </h2>
            {!isEditing && <StatusBadge status={car?.status || "N/A"} />}
          </div>
          
          {/* (เนื้อหา Carousel, Description, Fields ... เหมือนเดิม) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ---------- ซ้าย ---------- */}
            <div className="flex flex-col gap-6">
              {/* Carousel */}
              <div className="relative aspect-video w-full h-100 rounded-lg shadow-md overflow-hidden group">
                {displayImageUrls && displayImageUrls.length > 0 ? (
                  <img
                    src={displayImageUrls[currentImageIndex]}
                    alt={`${car?.name || "Car"} image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
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
                        {displayImageUrls.length > 0 ? "Change/Add Images" : "Upload Images"}
                      </p>
                    </button>
                    {displayImageUrls.length > 0 && (
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
                {displayImageUrls.length > 1 && (
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
                      {currentImageIndex + 1} / {displayImageUrls.length}
                    </div>
                  </>
                )}
              </div>

              {/* Description (เลื่อนได้) */}
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
            </div>

            {/* ---------- ขวา ---------- */}
            <div className="flex flex-col gap-6">
              <InfoCard title="Car Information">
                {/* (EditableField Status) */}
                {isEditing ? (
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-xs font-medium text-gray-500"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={editedCar?.status || "Available"}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option>Available</option>
                      <option>Rented</option>
                      <option>Under Repair</option>
                      <option>Unavailable</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <StatusBadge status={car?.status || "N/A"} />
                  </div>
                )}
                {/* (EditableField อื่นๆ ... เหมือนเดิม) */}
                <EditableField
                  label="Registration"
                  name="registration"
                  value={editedCar?.registration || ""}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Transmission"
                  name="transmission"
                  value={editedCar?.transmission || ""}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Engine"
                  name="engine"
                  value={editedCar?.engine || ""}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Fuel"
                  name="fuel"
                  value={editedCar?.fuel || ""}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Passengers"
                  name="passengers"
                  value={`${editedCar?.passengers || ""}`}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
              </InfoCard>

              <InfoCard title="Rental Price">
                {/* (EditableField Price ... เหมือนเดิม) */}
                <EditableField
                  label="Price / Day"
                  name="price"
                  value={`${editedCar?.price || ""}`}
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
                  label="Insurance Fee"
                  name="insurance"
                  value={`${editedCar?.insurance || ""}`}
                  onChange={handleChange}
                  isEditing={isEditing}
                  type="number"
                />
              </InfoCard>

              {/* ปุ่ม */}
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
                      onClick={handleRemove} // <-- ตัวนี้จะเรียก setIsConfirmOpen(true)
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

      {/* [ใหม่] 6. Render Modal ยืนยัน (มันจะอยู่นอก Modal หลัก) */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Car"
        message={`Are you sure you want to permanently remove "${car.name}"? This action cannot be undone.`}
      />
    </>
  );
}