"use client"

import React from "react" // ต้อง Import React

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void 
  onConfirm: () => void
  title?: string 
  message?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "ยืนยันการกระทำ",
  message = "คุณแน่ใจหรือไม่?",
}: ConfirmModalProps) {
  
  if (!isOpen) {
    return null
  }

  // ปิด Modal เมื่อคลิกพื้นหลังสีเทา
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onClose} // <-- กด "No" จะเรียก onClose
          >
            No
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={onConfirm} // <-- กด "Yes" จะเรียก onConfirm
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}