"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, Trash2 } from "lucide-react";

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

export default function CarDetailModal({ isOpen, onClose, car, onSave, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState({
    name: "",
    imageUrl: "",
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

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (car) {
      setEditedCar(car);
    }
    setIsEditing(false);
  }, [car]);

  if (!isOpen || !car) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);
      setEditedCar((prev) => ({ ...prev, imageUrl: newImageUrl }));
    }
  };

  const handleSave = () => {
    onSave(editedCar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCar(car);
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${car.name}?`)) {
      onRemove?.(car);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto p-8">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* ชื่อรถ */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditing ? editedCar?.name || "" : car?.name || ""}
          </h2>
          {!isEditing && <StatusBadge status={car?.status || "N/A"} />}
        </div>

        {/* เนื้อหา */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ---------- ซ้าย ---------- */}
          <div className="flex flex-col gap-6">
            <div className="relative">
              <img
                src={editedCar?.imageUrl || car?.imageUrl || "/placeholder.png"}
                alt={car?.name || "Car image"}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />

              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-lg"
                  >
                    <Camera size={48} />
                    <p className="mt-2 font-semibold">Change Image</p>
                  </button>
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
                <p className="text-sm text-gray-600 leading-relaxed">
                  {car?.description || "No description available"}
                </p>
              )}
            </InfoCard>
          </div>

          {/* ---------- ขวา ---------- */}
          <div className="flex flex-col gap-6">
            <InfoCard title="Car Information">
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

            {/* ✅ ปุ่ม */}
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

                  {/* ❌ แสดงเฉพาะตอนยังไม่ edit */}
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
  );
}
