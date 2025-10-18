"use client"

import { useState, useEffect } from "react"
import { X, DollarSign } from "lucide-react"
import Image from "next/image"

// --- Interfaces ---
interface Member {
  id: string
  name: string
  role: "head" | "member"
  avatar?: string 
}

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (expense: {
    description: string
    amount: number
    paidBy: string
    splitBetween: string[]
  }) => void
  members: Member[]
}

export default function AddExpenseModal({ isOpen, onClose, onSubmit, members }: AddExpenseModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [splitBetween, setSplitBetween] = useState<string[]>([])

  // ฟังก์ชันสำหรับ Reset state เมื่อ Modal เปิด
  const resetState = () => {
    setDescription("")
    setAmount("")
    if (members.length > 0) {
      const headMember = members.find(m => m.role === 'head') || members[0];
      setPaidBy(headMember.name);
    }
    setSplitBetween(members.map(m => m.id));
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, members]);

  const handleSubmit = () => {
    if (description && amount && paidBy && splitBetween.length > 0) {
      const numAmount = Number.parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      
      onSubmit({
        description,
        amount: numAmount,
        paidBy,
        splitBetween,
      })
      onClose()
    }
  }

  const toggleMember = (memberId: string) => {
    setSplitBetween((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }
  
  const handleSelectAll = () => {
    if (splitBetween.length === members.length) {
      setSplitBetween([]);
    } else {
      setSplitBetween(members.map(m => m.id));
    }
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative border border-gray-200 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
        </div>

        <div className="space-y-5">
          {/* --- Description Input --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Hotel, Dinner, Taxi"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* --- Amount Input --- */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">฿</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            {/* --- Paid By Select --- */}
            <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Paid by</label>
                <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white appearance-none"
                >
                    <option value="" disabled>Select member</option>
                    {members.map((member) => (
                        <option key={member.id} value={member.name}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>
          </div>

          {/* --- Split Between Section --- */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-600">Split between</label>
                <button 
                  onClick={handleSelectAll} 
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {splitBetween.length === members.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
              {members.map((member) => (
                <label key={member.id} className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors ${splitBetween.includes(member.id) ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                  <input
                    type="checkbox"
                    checked={splitBetween.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full relative overflow-hidden flex-shrink-0">
                        <Image 
                            src={member.avatar || "/placeholder.svg"} 
                            alt={member.name} 
                            layout="fill" 
                            className="object-cover"
                        />
                    </div>
                    <span className="font-medium text-gray-800">{member.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!description || !amount || !paidBy || splitBetween.length === 0}
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  )
}