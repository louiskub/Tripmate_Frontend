"use client"

import { Heart, Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// --- Interfaces (เหมือนเดิม) ---
interface Member {
  id: string
  avatar?: string
}
interface GroupCardProps {
  id: string
  name: string
  description: string
  imageUrl?: string
  members: Member[]
  isFavorite: boolean 
  onToggleFavorite: (id: string) => void
  onJoinGroup: (groupName: string) => void
}


export default function GroupCard({
  id,
  name,
  description,
  imageUrl,
  members,
  isFavorite,
  onToggleFavorite,
  onJoinGroup,
}: GroupCardProps) {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showPopup])

  const hasDescription = description && description.trim() !== ""
  const MAX_LENGTH = 200
  const isLongText = description.length > MAX_LENGTH

  return (
    <>
      <Link href={`/group/${id}`} className="block group">
        <div
          className={`relative bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition-all flex flex-col sm:flex-row gap-6 p-4 ${
            isFavorite ? "border-2 border-pink-300" : ""
          }`}
        >
          <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <Image src={imageUrl} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-300" />
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite(id)
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-white backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-[1.3] transition-all shadow-md z-10"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <div>
              {/* --- CHANGE 1: สร้าง container ใหม่สำหรับชื่อและจำนวนสมาชิก --- */}
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
                {/* --- CHANGE 2: ย้ายป้าย Members มาไว้ที่นี่ --- */}
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-600">
                  <Users className="w-4 h-4" />
                  <span>{members.length} Members</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mt-3 mb-2 break-all min-h-[40px]">
                {hasDescription ? (
                  <>
                    <p className={`whitespace-pre-wrap break-words ${isLongText ? "line-clamp-3" : ""}`}>
                      {description}
                    </p>
                    {isLongText && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShowPopup(true)
                        }}
                        className="font-semibold text-blue-600 hover:underline mt-1 z-20 relative"
                      >
                        Read more
                      </button>
                    )}
                  </>
                ) : (
                  <p className="italic text-gray-400">No description provided.</p>
                )}
              </div>
            </div>

            {/* --- CHANGE 3: ส่วนท้ายการ์ดจะเหลือแค่ Avatar --- */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt="member"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                {members.length > 3 && (
                  <div className="ml-2 text-sm text-gray-500">+{members.length - 3} others</div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onJoinGroup(name)
                }}
                className="flex items-center gap-2 bg-blue-300 hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors z-20"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Popup Modal (เหมือนเดิม) */}
      <AnimatePresence>
        {showPopup && (
           <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-4xl shadow-xl relative max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                <X className="w-10 h-10" />
              </button>
              <h2 className="text-2xl font-bold mb-3">{name}</h2>
              <p className="text-gray-700 whitespace-pre-wrap break-words">{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}