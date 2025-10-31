"use client"

import { useState } from 'react';
// [แก้ไข] 1. import ไอคอนสำหรับเลื่อนซ้าย/ขวา
import { X, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Component ย่อยสำหรับ Input Field (เหมือนเดิม) ---
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


export default function AddNewCarModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    price: '',
    mapLink: '',
    description: '',
    policies: '',
  });
  
  // [แก้ไข] 2. เปลี่ยน State จากภาพเดียวเป็นหลายภาพ (array)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // [ใหม่] 3. เพิ่ม State สำหรับเก็บลำดับภาพที่แสดงอยู่
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target; 
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // [แก้ไข] 4. ปรับ `handleImageChange` ให้รองรับหลายไฟล์
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      
      setImagePreviews((prev) => {
        const updatedPreviews = [...prev, ...newPreviews];
        // ถ้าเป็นการอัปโหลดครั้งแรก (prev.length === 0) ให้ตั้งค่า index ไปที่ 0
        if (prev.length === 0 && updatedPreviews.length > 0) {
          setCurrentImageIndex(0);
        }
        return updatedPreviews;
      });
    }
  };

  // [ใหม่] 5. ฟังก์ชันสำหรับลบภาพที่แสดงอยู่
  const handleRemoveCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันไม่ให้ trigger การคลิกเพื่ออัปโหลด
    
    const indexToRemove = currentImageIndex;
    const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);
    setImagePreviews(newPreviews);
    
    // ปรับ index หลังจากลบ
    if (currentImageIndex >= newPreviews.length) {
      // ถ้าลบภาพสุดท้าย ให้เลื่อนไปแสดงภาพก่อนหน้า (หรือ 0 ถ้าหมดแล้ว)
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1));
    }
  };

  // [ใหม่] 6. ฟังก์ชันสำหรับเลื่อนภาพถัดไป
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันไม่ให้ trigger การคลิกเพื่ออัปโหลด
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagePreviews.length);
    }
  };

  // [ใหม่] 7. ฟังก์ชันสำหรับเลื่อนภาพก่อนหน้า
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันไม่ให้ trigger การคลิกเพื่ออัปโหลด
    if (imagePreviews.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imagePreviews.length) % imagePreviews.length);
    }
  };


  const handleSubmit = () => {
    console.log("Submitting form data:", formData);
    // หมายเหตุ: อย่าลืมส่ง imagePreviews (หรือไฟล์จริง) ไปด้วย
    onSubmit(formData);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex flex-col lg:flex-row">

          {/* คอลัมน์ซ้าย: Form Fields (เหมือนเดิม) */}
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

          {/* คอลัมน์ขวา: Image Uploader (แก้ไข) */}
          <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex flex-col">
            
            {/* [แก้ไข] 8. เปลี่ยนหัวข้อเล็กน้อย */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Images</h3>
            
            {/* [แก้ไข] 9. ปรับปรุงกล่องอัปโหลดไฟล์ */}
            <div 
              className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100 overflow-hidden" // [แก้ไข] เพิ่ม `relative` และ `overflow-hidden`
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <input 
                type="file" 
                id="imageUpload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                multiple // [แก้ไข] 10. เพิ่ม `multiple`
              />

              {/* [แก้ไข] 11. เปลี่ยนเงื่อนไขเป็น `imagePreviews.length` */}
              {imagePreviews.length === 0 ? (
                // --- ถ้าไม่มีภาพ ---
                <div className="text-gray-500">
                  <UploadCloud size={48} className="mx-auto mb-2" />
                  <p className="font-semibold">Click to upload images</p>
                  <p className="text-xs">PNG, JPG, etc. (Multiple files supported)</p>
                </div>
              ) : (
                // --- ถ้ามีภาพ (โครงสร้าง Carousel ใหม่) ---
                <>
                  <img 
                    src={imagePreviews[currentImageIndex]} 
                    alt={`Car preview ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain rounded-md" // ใช้ object-contain เพื่อให้เห็นรถทั้งคัน
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
            
            {/* ปุ่ม (เหมือนเดิม) */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Rental Car
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

        </div> {/* ปิด div ครอบ 2 คอลัมน์ */}
      </div> {/* ปิด div ที่เลื่อนได้ */}
    </div>
  );
}