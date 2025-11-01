"use client"

import { X, CheckCircle } from "lucide-react"
import { useEffect } from "react"

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error" | "info"
}

export default function Toast({ message, isVisible, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[320px]">
        {type === "success" && <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />}
        <p className="text-gray-800 font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
