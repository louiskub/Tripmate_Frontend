"use client"

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import React from 'react';

// --- [TS] 1. กำหนด Type ของข้อมูลใน Form ---
interface GuideFormData {
  postName: string;
  maxGuests: string;
  contact: string;
  province: string;
  googleMap: string;
  duration: string;
  cost: string;
  description: string;
}

// --- [TS] 2. Interface สำหรับ Props ของ FormField ---
interface FormFieldProps {
  label: string;
  id: keyof GuideFormData;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// --- 3. Component ย่อยสำหรับ Input Field (เหมือนเดิม) ---
const FormField = ({ label, id, type = 'text', placeholder, value, onChange }: FormFieldProps) => (
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

// --- [TS] 4. Interface สำหรับ Props ของ Modal (เหมือนเดิม) ---
interface CreateServiceModalProps {
  onClose: () => void;
  onSubmit?: (formData: GuideFormData) => void; 
}

// --- 5. Main Component ---
export default function CreateServiceModal({ onClose, onSubmit = () => {} }: CreateServiceModalProps) {
  
  // (States และ Handlers ... เหมือนเดิม)
  const [formData, setFormData] = useState<GuideFormData>({
    postName: '',
    maxGuests: '',
    contact: '',
    province: '',
    googleMap: '',
    duration: '',
    cost: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    console.log("Submitting Guide data:", formData);
    onSubmit(formData);
    onClose();
  };

  return (
    // Overlay (พื้นหลัง)
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {/* [แก้ไขจุดที่ 1] 
        - เอา 'flex' และ 'overflow-hidden' ออก
        - เพิ่ม 'overflow-y-auto' ที่นี่ เพื่อให้กรอบนี้เลื่อนได้ทั้งอัน 
      */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* [ใหม่] เพิ่ม flex container ครอบ 2 คอลัมน์ (เพื่อจัด layout) */}
        <div className="flex flex-col lg:flex-row">

          {/* [แก้ไขจุดที่ 2] คอลัมน์ซ้าย
            - เอา 'overflow-y-auto' ออก
            - เปลี่ยน 'w-1/2' เป็น 'w-full lg:w-1/2' (เพื่อ responsive)
          */}
          <div className="w-full lg:w-1/2 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Guide</h2>
            
            <FormField label="Post Name" id="postName" placeholder="e.g., Chiang Mai Day Trip" value={formData.postName} onChange={handleChange} />
            <FormField label="Max guests" id="maxGuests" type="number" placeholder="e.g., 10" value={formData.maxGuests} onChange={handleChange} />
            <FormField label="Contact" id="contact" placeholder="e.g., 081-234-5678" value={formData.contact} onChange={handleChange} />
            <FormField label="Province" id="province" placeholder="e.g., Chiang Mai" value={formData.province} onChange={handleChange} />
            <FormField label="Google map link" id="googleMap" placeholder="https://maps.app.goo.gl/..." value={formData.googleMap} onChange={handleChange} />
            <FormField label="Duration" id="duration" placeholder="e.g., 8 hours" value={formData.duration} onChange={handleChange} />
            <FormField label="Cost (THB)" id="cost" type="number" placeholder="e.g., 2500" value={formData.cost} onChange={handleChange} />
            <FormField label="Description" id="description" type="textarea" placeholder="Describe the guide service..." value={formData.description} onChange={handleChange} />
          </div>

          {/* [แก้ไขจุดที่ 3] คอลัมน์ขวา
            - เปลี่ยน 'w-1/2' เป็น 'w-full lg:w-1/2' (เพื่อ responsive)
          */}
          <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Guide Image</h3>
            
            {/* [แก้ไขจุดที่ 4] ส่วนอัปโหลด
              - เอา 'flex-1' ออก (สำคัญมาก)
              - เพิ่ม 'h-96' (หรือความสูงที่ต้องการ) เพื่อกำหนดขนาดให้มัน
            */}
            <div 
              className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => (document.getElementById('imageUpload') as HTMLInputElement)?.click()}
            >
              <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} alt="Guide preview" className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-gray-500">
                  <UploadCloud size={48} className="mx-auto mb-2" />
                  <p className="font-semibold">Click to upload image</p>
                  <p className="text-xs">PNG, JPG, etc.</p>
                </div>
              )}
            </div>
            
            {/* ปุ่ม (เหมือนเดิม) */}
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

        </div> {/* ปิด flex container */}
      </div> {/* ปิด Modal Panel ที่เลื่อนได้ */}
    </div>
  );
}