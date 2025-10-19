"use client"

import { Pencil } from 'lucide-react';

export default function SectionCard({ title, onEdit, children }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 relative">
      {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-6 right-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <Pencil size={14} />
          <span>Edit</span>
        </button>
      )}
      
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      )}
      
      <div>
        {children}
      </div>
    </div>
  );
}