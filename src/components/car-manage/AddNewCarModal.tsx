"use client"

import { useState } from 'react';
import { X, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import type React from "react";

// --- Component ย่อยสำหรับ Input Field ---
const FormField = ({ label, id, type = 'text', placeholder, value, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === 'textarea' ? (
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
);

// --- Main Component ---
export default function AddNewCarModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    price: '',
    mapLink: '',
    description: '',
    policies: '',
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target; 
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      
      setImagePreviews((prev) => {
        const updatedPreviews = [...prev, ...newPreviews];
        if (prev.length === 0 && updatedPreviews.length > 0) {
          setCurrentImageIndex(0);
        }
        return updatedPreviews;
      });
    }
  };

  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    const indexToRemove = currentImageIndex;
    const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);
    setImagePreviews(newPreviews);
    if (currentImageIndex >= newPreviews.length) {
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagePreviews.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length);
    }
  };

  // ฟังก์ชันสำหรับ Reset State และ ปิด Modal
  const resetAndClose = () => {
    setFormData({
      title: '',
      tags: '',
      price: '',
      mapLink: '',
      description: '',
      policies: '',
    });
    setImagePreviews([]);
    setCurrentImageIndex(0);
    onClose(); // เรียกฟังก์ชัน onClose ที่ส่งมาจาก Parent
  };

  // อัปเดต handleSubmit
  const handleSubmit = () => {
    // ส่ง object ที่มี *ทั้ง* formData และ imagePreviews กลับไป
    onSubmit({ ...formData, imagePreviews });
    resetAndClose(); // เรียกใช้ฟังก์ชัน reset และปิด
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row">

          {/* คอลัมน์ซ้าย: Form Fields */}
          <div className="w-full lg:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Rental Car Details</h2>
            <div className="space-y-4">
              <FormField label="Rental Car Title" id="title" placeholder="e.g., Toyota Yaris Ativ" value={formData.title} onChange={handleChange} />
              <FormField label="Tags" id="tags" placeholder="e.g., sedan, eco, 4-seater" value={formData.tags} onChange={handleChange} />
              <FormField label="Price per day (THB)" id="price" type="number" placeholder="e.g., 1200" value={formData.price} onChange={handleChange} />
              <FormField label="Google map link" id="mapLink" placeholder="https://maps.google.com/..." value={formData.mapLink} onChange={handleChange} />
              <FormField label="Description" id="description" type="textarea" placeholder="Describe the car..." value={formData.description} onChange={handleChange} />
              <FormField label="Policies" id="policies" placeholder="e.g., No smoking" value={formData.policies} onChange={handleChange} />
            </div>
          </div>

          {/* คอลัมน์ขวา: Image Uploader */}
          <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Images</h3>
            <div 
              className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100 overflow-hidden"
              onClick={() => (document.getElementById('imageUpload') as HTMLInputElement)?.click()}
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
                    src={imagePreviews[currentImageIndex]} 
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
  );
}