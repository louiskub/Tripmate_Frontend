"use client"

import { useState } from "react"
import { X, Upload } from "lucide-react"

interface UploadSlipModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (slip: File) => void
  transactionInfo: { from: string; to: string; amount: number }
}

export default function UploadSlipModal({ isOpen, onClose, onSubmit, transactionInfo }: UploadSlipModalProps) {
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSlipFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (slipFile) {
      onSubmit(slipFile)
      handleClose()
    }
  }

  const handleClose = () => {
    setSlipFile(null)
    setPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative">
        <button onClick={handleClose} className="absolute top-6 right-6 text-gray-500 hover:text-black">
          <X className="h-8 w-8" />
        </button>

        <h2 className="text-3xl font-bold mb-4">Confirm Payment</h2>
        <p className="text-lg text-gray-600 mb-6">
          You are paying <span className="font-bold text-blue-600">${transactionInfo.amount.toFixed(2)}</span> from{" "}
          <span className="font-bold">{transactionInfo.from}</span> to{" "}
          <span className="font-bold">{transactionInfo.to}</span>
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Upload Slip</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-60 flex items-center justify-center relative hover:border-blue-500 transition-colors">
              {preview ? (
                <img src={preview} alt="Slip preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="w-10 h-10 mx-auto mb-2" />
                  <p>Click to upload</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!slipFile}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium text-lg transition-colors"
          >
            Confirm and Send
          </button>
        </div>
      </div>
    </div>
  )
}