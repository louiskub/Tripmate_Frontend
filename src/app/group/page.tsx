"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Users } from "lucide-react"
import axios from "axios"
import CreateGroupModal from "@/components/group/group-create-popup"
import Toast from "@/components/ui/toast"
import DefaultPage from "@/components/layout/default-layout"
import GroupCard from "@/components/group/group-card"
import { endpoints } from "@/config/endpoints.config"

// --- Interfaces ---
interface Member {
  id: string
  avatar?: string
}
interface Group {
  id: string
  code: string
  name: string
  description: string
  imageUrl?: string
  hostName: string
  members: Member[]
  isFavorite: boolean
}

// ✅ helper อ่าน token จาก cookie
const getToken = () => {
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/)
  return match ? match[1] : ""
}

export default function BookingHistory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [searchedGroupId, setSearchedGroupId] = useState<string | null>(null)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // --- 🧠 Fetch groups from backend ---
  useEffect(() => {
    const fetchGroups = async () => {
      console.log("[FetchGroups] Start fetching groups...")

      try {
        const token = getToken()
        console.log("[FetchGroups] Token found:", token)

        const res = await axios.get(endpoints.group.all, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = Array.isArray(res.data) ? res.data : [res.data]

        const mappedGroups = data.map((g: any, index: number) => {
          return {
            id: g.id,
            code: g.id,
            name: g.groupName,
            description: g.description || "No description",
            imageUrl: g.groupImg,
            hostName: g.ownerId || "Unknown",
            members: (g.members || []).map((m: any, i: number) => ({
              id: m.userId,
              name: m.user?.username || `User ${i + 1}`,
              avatar: m.user?.profileImg || `https://placehold.co/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/FFFFFF?text=${(m.user?.username?.slice(0,2) || "U").toUpperCase()}`,
            })),
            isFavorite: false,
          }
        })

        console.log("[FetchGroups] Mapped groups:", mappedGroups)
        setGroups(mappedGroups)
        console.log("[FetchGroups] Groups set successfully.")
      } catch (err) {
        console.error("[FetchGroups] Error fetching groups:", err)
      }
    }

    fetchGroups()
  }, [])

  // --- ✅ Create group function ---
  const handleCreateGroup = async (data: { name: string; description: string; image?: File }) => {
    try {
      const token = getToken()
      if (!token) {
        setToastMessage("No token found. Please log in again.")
        setToastType("error")
        setShowToast(true)
        return
      }

      // 1️⃣ ดึงข้อมูล user ปัจจุบัน
      const userRes = await axios.get("http://161.246.5.236:8800/user", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const currentUser = userRes.data.data?.[0]
      const ownerId = currentUser?.id
      if (!ownerId) throw new Error("Cannot get user ID")

      // 2️⃣ เตรียม FormData
      const formData = new FormData()
      formData.append("ownerId", ownerId)
      formData.append("groupName", data.name)
      formData.append("description", data.description)
      formData.append("status", "active")
      if (data.image) formData.append("groupImg", data.image)

      console.log("[CreateGroup] Sending payload:", Object.fromEntries(formData.entries()))

      // 3️⃣ ยิง POST /group
      const res = await axios.post(endpoints.group.all, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("[CreateGroup] Response:", res.data)

      // 4️⃣ เพิ่ม group ใหม่ใน state
      const newGroup = {
        id: res.data.id,
        code: res.data.id,
        name: res.data.groupName,
        description: res.data.description || "No description",
        imageUrl: res.data.groupImg,
        hostName: res.data.ownerId || "Unknown",
        members: [],
        isFavorite: false,
      }

      setGroups((prev) => [...prev, newGroup])
      setToastMessage("Group created successfully!")
      setToastType("success")
      setShowToast(true)
    } catch (err: any) {
      console.error("[CreateGroup] Error:", err.response?.data || err)
      setToastMessage("Failed to create group.")
      setToastType("error")
      setShowToast(true)
    }
  }

  // --- Favorite toggle ---
  const handleToggleFavorite = (groupId: string) => {
    console.log("[ToggleFavorite] Group ID:", groupId)
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, isFavorite: !group.isFavorite } : group
      )
    )
  }

  // --- Join group handler ---
  const handleJoinGroup = (groupName: string) => {
    console.log("[JoinGroup] Joining group:", groupName)
    setToastMessage(`Joined "${groupName}" successfully!`)
    setToastType("success")
    setShowToast(true)
  }

  // --- Search handler ---
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchedGroupId(null)
      return
    }

    const foundGroup = groups.find((group) => group.code === searchTerm.trim())
    if (foundGroup) {
      setSearchedGroupId(foundGroup.id)
    } else {
      setSearchedGroupId(null)
      setToastMessage(`Group with code "${searchTerm}" not found.`)
      setToastType("error")
      setShowToast(true)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") setSearchedGroupId(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch()
  }

  // --- Sorting ---
  const sortedGroups = useMemo(() => {
    const sorted = [...groups].sort((a, b) => {
      if (searchedGroupId) {
        if (a.id === searchedGroupId) return -1
        if (b.id === searchedGroupId) return 1
      }
      return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
    })
    console.log("[Sorting] Sorted groups:", sorted)
    return sorted
  }, [groups, searchedGroupId])

  return (
    <DefaultPage>
      <main className="flex-1">
        {/* --- Header --- */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                placeholder="Enter group code and press Enter..."
                className="pl-12 w-full h-12 bg-white border-2 border-gray-300 rounded-lg transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6 rounded-lg whitespace-nowrap"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* --- Filter Bar --- */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-gray-600 font-medium">Found {sortedGroups.length} groups</p>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Sort by favorite</span>
            <span className="text-gray-600 font-medium">View</span>
          </div>
        </div>

        {/* --- Group List --- */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16">
            <div className="relative mb-4">
              <Users className="w-48 h-48 text-gray-300" />
              <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-bold text-gray-700 text-center">
              No groups were found
            </h3>
            <p className="text-gray-500 mt-2">
              Create a new group or search by code to get started!
            </p>
          </div>
        ) : (
          <div className="px-6">
            <div className="flex flex-col gap-4">
              {sortedGroups.map((group, index) => (
                <GroupCard
                  key={`${group.id}-${index}`}
                  id={group.id}
                  name={group.name}
                  description={group.description}
                  imageUrl={group.imageUrl}
                  members={group.members}
                  isFavorite={group.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onJoinGroup={handleJoinGroup}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- Modals --- */}
        <CreateGroupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateGroup}
        />
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          type={toastType}
        />
      </main>
    </DefaultPage>
  )
}
