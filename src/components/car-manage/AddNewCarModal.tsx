"use client"

import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';

// --- Component ย่อยสำหรับ Input Field เพื่อลดโค้ดซ้ำซ้อน ---
const FormField = ({ label, id, type = 'text', placeholder, value, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={id}
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
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      // In a real app, you'd handle the file upload here
    }
  };

  const handleSubmit = () => {
    // In a real app, you'd probably upload the image first, get the URL,
    // and then submit the formData with the imageUrl.
    console.log("Submitting form data:", formData);
    onSubmit(formData);
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden">
        {/* --- Left Side: Form --- */}
        <div className="w-1/2 p-8 overflow-y-auto">
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

        {/* --- Right Side: Image Upload & Actions --- */}
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Image</h3>
          <div 
            className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => document.getElementById('imageUpload').click()}
          >
            <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview ? (
              <img src={imagePreview} alt="Car preview" className="max-h-full w-auto object-contain rounded-md" />
            ) : (
              <div className="text-gray-500">
                <UploadCloud size={48} className="mx-auto mb-2" />
                <p className="font-semibold">Click to upload image</p>
                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
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
      </div>
    </div>
  );
}