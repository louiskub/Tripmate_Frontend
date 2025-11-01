"use client"

import { useState, useEffect, useMemo } from "react"
import { X, Landmark, Wallet, Smartphone, Hash } from "lucide-react"

interface EditPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (paymentInfo: { bank: string; account: string; promptPay: string }) => void
  initialData?: { bank: string; account: string; promptPay: string }
}

export default function EditPaymentModal({ isOpen, onClose, onSubmit, initialData }: EditPaymentModalProps) {
  const [bank, setBank] = useState("")
  const [account, setAccount] = useState("")
  const [promptPay, setPromptPay] = useState("")

  useEffect(() => {
    if (isOpen) {
      setBank(initialData?.bank || "")
      setAccount(initialData?.account || "")
      setPromptPay(initialData?.promptPay || "")
    }
  }, [isOpen, initialData])

  const handleSubmit = () => {
    onSubmit({ bank, account, promptPay })
    onClose()
  }

  const isSaveDisabled = useMemo(() => {
    const isBankInfoPartial = (bank.trim() && !account.trim()) || (!bank.trim() && account.trim());
    const isBankInfoComplete = bank.trim() && account.trim();
    const isPromptPayComplete = promptPay.trim();
    
    return isBankInfoPartial || (!isBankInfoComplete && !isPromptPayComplete);
  }, [bank, account, promptPay]);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative border border-gray-200 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Payment Info</h2>
        </div>

        <div className="space-y-6">
          {/* Bank Name */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-5 h-5 text-gray-500" />
              <label className="text-base font-semibold text-gray-700">Bank Name</label>
            </div>
            <input
              type="text" value={bank} onChange={(e) => setBank(e.target.value)}
              placeholder="e.g. Kasikorn, SCB"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Account Number */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-gray-500" />
              <label className="text-base font-semibold text-gray-700">Account Number</label>
            </div>
            <input
              type="text" value={account} onChange={(e) => setAccount(e.target.value)}
              placeholder="xxx-x-xxxxx-x"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* PromptPay */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <label className="text-base font-semibold text-gray-700">PromptPay</label>
            </div>
            <input
              type="text" value={promptPay} onChange={(e) => setPromptPay(e.target.value)}
              placeholder="0xx-xxx-xxxx"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaveDisabled}
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  )
}