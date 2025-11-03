"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"

// --- Interfaces ---
interface Contacts {
  discord?: string
  line?: string
  messenger?: string
}

interface EditContactsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contacts: Contacts) => void
  initialData?: Contacts
}

export default function EditContactsModal({ isOpen, onClose, onSubmit, initialData }: EditContactsModalProps) {
  const [discord, setDiscord] = useState("")
  const [line, setLine] = useState("")
  const [messenger, setMessenger] = useState("")

  useEffect(() => {
    if(isOpen) {
        setDiscord(initialData?.discord || "")
        setLine(initialData?.line || "")
        setMessenger(initialData?.messenger || "")
    }
  }, [isOpen, initialData])

  const handleSubmit = () => {
    onSubmit({ discord, line, messenger })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative border border-gray-200 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Group Contacts</h2>

        <div className="space-y-6">
          {/* Discord Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/images/discord.png" alt="Discord" width={24} height={24} />
              <label className="font-semibold text-gray-700">Discord</label>
            </div>
            <input 
              type="text" 
              value={discord} 
              onChange={(e) => setDiscord(e.target.value)} 
              placeholder="https://discord.gg/..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow hover:shadow-sm" 
            />
          </div>

          {/* Line Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/images/line.png" alt="Line" width={24} height={24} />
              <label className="font-semibold text-gray-700">Line</label>
            </div>
            <input 
              type="text" 
              value={line} 
              onChange={(e) => setLine(e.target.value)} 
              placeholder="https://line.me/ti/g/..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow hover:shadow-sm" 
            />
          </div>

          {/* Messenger Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/images/messenger.png" alt="Messenger" width={24} height={24} />
              <label className="font-semibold text-gray-700">Messenger</label>
            </div>
            <input 
              type="text" 
              value={messenger} 
              onChange={(e) => setMessenger(e.target.value)} 
              placeholder="https://m.me/j/..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow hover:shadow-sm"
            />
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Save Contacts
          </button>
        </div>
      </div>
    </div>
  )
}