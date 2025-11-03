"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import Toast from "@/components/ui/toast"

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  groupCode: string
}

export default function InviteModal({ isOpen, onClose, groupCode }: InviteModalProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(groupCode).then(() => {
      setIsCopied(true)
      setShowToast(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-3xl font-bold mb-4">Invite Members</h2>
          <p className="text-gray-600 mb-6">Share this code with others to let them join your group.</p>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <span className="text-2xl font-mono text-gray-800">{groupCode}</span>
            <button onClick={handleCopy} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
      <Toast message="Group code copied to clipboard!" isVisible={showToast} onClose={() => setShowToast(false)} type="success" />
    </>
  )
}