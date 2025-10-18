import React, { useEffect, useState } from 'react'
import UploadIcon from '@/assets/icons/upload.svg'
import Img from 'next/image'

export default function UploadImg({ text, id, onFileChange}: { text: string, id: string, onFileChange: (file: File | null) => void }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setSelectedFile(file.name)
      setPreviewUrl(URL.createObjectURL(file))
    }
    onFileChange(file || null);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setSelectedFile(file.name)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    onFileChange(null);
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--color-light-blue)] bg-[var(--color-custom-white)] p-4 shadow-md">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {/* <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-contain" /> */}
            <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-contain" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="truncate text-sm text-[var(--color-gray)]">{selectedFile}</p>
            <button
              onClick={handleClear}
              className="rounded-lg border-2 border-[var(--color-dark-red)] bg-[var(--color-custom-white)] px-4 py-2 text-sm font-medium text-[var(--color-dark-red)] transition-all duration-200 hover:bg-[var(--color-dark-red)] hover:text-[var(--color-custom-white)]"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`
          group relative flex cursor-pointer flex-col items-center justify-center
          rounded-2xl border-2 border-dashed py-5 px-5
          transition-all duration-300 ease-in-out
          ${
            isDragging
              ? "border-[var(--color-dark-blue)] bg-[var(--color-pale-blue)] shadow-[var(--boxshadow-lifted)]"
              : "border-[var(--color-light-blue)] bg-[var(--color-custom-white)] hover:border-[var(--color-dark-blue)] hover:bg-[var(--color-pale-blue)] hover:shadow-md"
          }
        `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id={id}
            name={id}
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center gap-4 text-center">
            {/* Upload Icon */}
            <div
              className={`
            rounded-full bg-[var(--color-pale-blue)] p-4 transition-all duration-300
            ${isDragging ? "scale-110 bg-[var(--color-light-blue)]" : "group-hover:scale-105 group-hover:bg-[var(--color-light-blue)]"}
          `}
            >
              <UploadIcon className="h-8 w-8 opacity-70 transition-opacity group-hover:opacity-100" />
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[var(--color-custom-black)]">Upload Image</h3>
              <p className="text-[0.95rem] text-[var(--color-gray)]">{text}</p>
            </div>

            {/* Choose File Button */}
            <div
              className={`
            mt-2 rounded-lg border-2 border-[var(--color-dark-blue)] bg-[var(--color-custom-white)] px-6 py-2.5
            text-sm font-medium text-[var(--color-dark-blue)] transition-all duration-200
            ${isDragging ? "scale-105" : "group-hover:bg-[var(--color-dark-blue)] group-hover:text-[var(--color-custom-white)]"}
          `}
            >
              Choose File
            </div>
          </div>

          {/* Subtle hint text */}
          {/* <p className="mt-6 text-xs text-[var(--color-gray)] opacity-60">Supports: JPG, PNG, GIF, WebP</p> */}
        </label>
      )}
    </div>
  )
}
