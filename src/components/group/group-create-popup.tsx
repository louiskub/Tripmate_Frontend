"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload } from "lucide-react"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description: string; image?: File }) => void
}

export default function CreateGroupModal({ isOpen, onClose, onSubmit }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Modal handleSubmit called")
    console.log("[v0] Group name:", groupName)
    console.log("[v0] Description:", description)
    console.log("[v0] Has image:", !!selectedImage)

    if (groupName.trim()) {
      console.log("[v0] Calling onSubmit callback")
      const data = {
        name: groupName,
        description: description,
        image: selectedImage || undefined,
      }
      console.log("[v0] Data being sent:", data)
      onSubmit(data)

      // Reset form
      console.log("[v0] Resetting form")
      setGroupName("")
      setDescription("")
      setSelectedImage(null)
      setImagePreview(null)
      onClose()
      console.log("[v0] Modal closed")
    } else {
      console.log("[v0] Group name is empty, not submitting")
    }
  }

  const handleCancel = () => {
    // Reset form
    setGroupName("")
    setDescription("")
    setSelectedImage(null)
    setImagePreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-6xl mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors z-10"
        >
          <X className="h-12 w-12" />
        </button>

        <div className="mb-8">
          <h2 className="text-5xl font-bold text-gray-800 text-center">Create New Group</h2>
          <p className="text-2xl text-gray-600 text-center mt-2">Fill in the details to create your group</p>
        </div>

        <div className="flex gap-8 mt-6">
          <div className="flex-1">
            <label className="block text-2xl font-semibold text-gray-700 mb-4">Group Image</label>
            <div className="border-2 border-dashed border-gray-400 rounded-xl h-79 flex items-center justify-center relative overflow-hidden hover:border-blue-400 transition-colors">
              {imagePreview ? (
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <span className="text-gray-500 font-medium text-xl">Click to upload image</span>
                  <p className="text-gray-400 text-lg mt-2">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-2xl font-semibold text-gray-700 mb-3">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 text-xl border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter group name"
              />
            </div>

            <div>
              <label className="block text-2xl font-semibold text-gray-700 mb-3">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 text-xl border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-5">
          <button
            onClick={handleSubmit}
            disabled={!groupName.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-12 py-3 rounded-xl font-semibold text-lg transition-colors"
          >
            Create Group
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-xl font-semibold text-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
