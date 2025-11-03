"use client"

import { X } from 'lucide-react';

export default function EditModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-['Manrope']">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit {title}</h2>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}