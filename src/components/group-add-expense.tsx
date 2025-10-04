"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface Member {
  id: string
  name: string
  role: "head" | "member"
}

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (expense: {
    description: string
    amount: number
    paidBy: string
    splitBetween: string[]
    perPerson: number
  }) => void
  members: Member[]
}

export default function AddExpenseModal({ isOpen, onClose, onSubmit, members }: AddExpenseModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [splitBetween, setSplitBetween] = useState<string[]>([])

  const handleSubmit = () => {
    if (description && amount && paidBy && splitBetween.length > 0) {
      const numAmount = Number.parseFloat(amount)
      const perPerson = numAmount / splitBetween.length

      onSubmit({
        description,
        amount: numAmount,
        paidBy,
        splitBetween,
        perPerson,
      })

      // Reset form
      setDescription("")
      setAmount("")
      setPaidBy("")
      setSplitBetween([])
      onClose()
    }
  }

  const toggleMember = (memberId: string) => {
    setSplitBetween((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-black">
          <X className="h-8 w-8" />
        </button>

        <h2 className="text-3xl font-bold mb-6">+ Add Expense</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Breakfast, Taxi fare"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Paid by</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select who paid</option>
              {members.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">Split between</label>
            <div className="space-y-3">
              {members.map((member) => (
                <label key={member.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={splitBetween.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                    <span className="font-medium">{member.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!description || !amount || !paidBy || splitBetween.length === 0}
            className="w-full py-3 bg-blue-400 hover:bg-blue-500 disabled:bg-blue-200 text-white rounded-lg font-medium text-lg transition-colors"
          >
            + Add Expense
          </button>
        </div>
      </div>
    </div>
  )
}
