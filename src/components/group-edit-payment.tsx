"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

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
    if (initialData) {
      setBank(initialData.bank)
      setAccount(initialData.account)
      setPromptPay(initialData.promptPay)
    }
  }, [initialData])

  const handleSubmit = () => {
    if (bank && account && promptPay) {
      onSubmit({ bank, account, promptPay })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-black">
          <X className="h-8 w-8" />
        </button>

        <h2 className="text-3xl font-bold mb-6">✏️ Edit Payment</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Bank</label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="e.g. Kasikorn, SCB"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Account</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="xxx-x-xxxxx-x"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">PromptPay</label>
            <input
              type="text"
              value={promptPay}
              onChange={(e) => setPromptPay(e.target.value)}
              placeholder="0xx-xxx-xxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!bank || !account || !promptPay}
            className="w-full py-3 bg-blue-400 hover:bg-blue-500 disabled:bg-blue-200 text-white rounded-lg font-medium text-lg transition-colors"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  )
}
