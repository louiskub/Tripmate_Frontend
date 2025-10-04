"use client"

import { Heart, User } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface GroupCardProps {
  id: string
  code: string
  name: string
  hostName: string
  description: string
  imageUrl?: string
}

export default function GroupCard({ id, code, name, hostName, description, imageUrl }: GroupCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  console.log("[v0] GroupCard rendered with id:", id)

  return (
    <Link
      href={`/group/${id}`}
      className="block"
      onClick={() => {
        console.log("[v0] GroupCard clicked, navigating to:", `/group/${id}`)
      }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-4 p-4 cursor-pointer">
        <div className="relative w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-200 to-blue-400">
          {imageUrl ? (
            <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400" />
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("[v0] Heart button clicked, preventing navigation")
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md z-10"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
          {/* Image carousel dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center gap-1.5 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{hostName}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  )
}
