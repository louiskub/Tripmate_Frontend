"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Users } from "lucide-react"
import axios from "axios"
import CreateGroupModal from "@/components/group/group-create-popup"
import Toast from "@/components/ui/toast"
import DefaultPage from "@/components/layout/default-layout"
import GroupCard from "@/components/group/group-card"
import { endpoints } from "@/config/endpoints.config"
import { useRouter } from "next/navigation"

// --- Interfaces ---
interface Member {
  id: string
  name: string
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

// --- Decode JWT and get user info ---
function getUserFromToken() {
  try {
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
    if (!token) throw new Error("Token not found")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.sub
    const username = payload.username || ""
    return { userId, username }
  } catch (err) {
    console.error("[getUserFromToken] Failed to decode:", err)
    return { userId: null, username: "" }
  }
}

// --- Placeholder generator ---
function genPlaceholder(name: string) {
  const initials = name ? name.charAt(0).toUpperCase() : "U"
  const colors = ["3B82F6", "8B5CF6", "F59E0B", "10B981", "EF4444", "EC4899"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  return `https://placehold.co/128x128/${randomColor}/FFFFFF?text=${initials}`
}

export default function BookingHistory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchedGroupId, setSearchedGroupId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // --- Fetch groups from backend ---
  useEffect(() => {
    const fetchGroups = async () => {
      console.log("[FetchGroups] Fetching groups...")
      try {
        const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
        const res = await axios.get(endpoints.group.all, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = Array.isArray(res.data) ? res.data : [res.data]

        const mappedGroups = data.map((g: any, index: number) => ({
          id: g.id,
          code: g.id,
          name: g.groupName,
          description: g.description || "No description",
          imageUrl: g.groupImg,
          hostName: g.ownerId || "Unknown",
          members: (g.members || []).map((m: any, i: number) => ({
            id: m.userId,
            name: m.user?.fname || m.user?.username || `User ${i + 1}`,
            avatar: m.user?.profileImg || genPlaceholder(m.user?.fname || "U"),
          })),
          isFavorite: false,
        }))
        setGroups(mappedGroups)
        console.log("[FetchGroups] Done:", mappedGroups)
      } catch (err) {
        console.error("[FetchGroups] Error:", err)
      }
    }
    fetchGroups()
  }, [])

  // --- Create group ---
  const handleCreateGroup = async (data: { name: string; description: string; image?: File }) => {
    try {
      const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      if (!token) throw new Error("Token missing")

      const { userId, username } = getUserFromToken()
      if (!userId) throw new Error("Cannot extract userId from token")

      console.log("[CreateGroup] Creating group for:", userId)

      const formData = new FormData()
      formData.append("ownerId", userId)
      formData.append("groupName", data.name)
      formData.append("description", data.description || "")
      formData.append("status", "active")
      if (data.image) formData.append("groupImg", data.image)

      const res = await axios.post(endpoints.group.all, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const created = res.data

      const fname = username.split("@")[0]
      const newGroup: Group = {
        id: created.id,
        code: created.id,
        name: created.groupName,
        description: created.description || "No description",
        imageUrl: created.groupImg,
        hostName: fname,
        members: [
          {
            id: userId,
            name: fname,
            avatar: genPlaceholder(fname),
          },
        ],
        isFavorite: false,
      }

      setGroups(prev => [...prev, newGroup])
      setToastMessage("Group created successfully!")
      setToastType("success")
      setShowToast(true)
    } catch (err: any) {
      console.error("[CreateGroup] Error:", err)
      setToastMessage("Failed to create group.")
      setToastType("error")
      setShowToast(true)
    }
  }

  // --- Join group ---
  const handleJoinGroup = async (groupId: string, groupName: string) => {
    try {
      const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      if (!token) throw new Error("Token not found")

      const { userId } = getUserFromToken()
      if (!userId) throw new Error("Invalid user token")

      const payload = { userId }
      console.log(`[JoinGroup] Sending POST to /group/${groupId}/join`, payload)

      const res = await axios.post(`http://161.246.5.236:8800/group/${groupId}/join`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("[JoinGroup] Response:", res.data)

      setToastMessage(`Joined "${groupName}" successfully!`)
      setToastType("success")
      setShowToast(true)
    } catch (err) {
      console.error("[JoinGroup] Error joining group:", err)
      setToastMessage("Failed to join group.")
      setToastType("error")
      setShowToast(true)
    }
  }

  const router = useRouter()

  // ฟังก์ชันเปิดหน้า group โดยตรวจสอบ token ก่อน
  const handleViewGroup = async (groupId: string) => {
    try {
      const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      if (!token) throw new Error("Token not found")

      const payload = JSON.parse(atob(token.split(".")[1]))
      const userId = payload.sub
      const res = await axios.get(`http://161.246.5.236:8800/group/${groupId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const members = res.data.members || []
      const isMember = members.some((m: any) => m.userId === userId)
      if (!isMember) {
        alert("You are not a member of this group.")
        return
      }

      router.push(`/group/${groupId}`)
    } catch (err) {
      console.error("[handleViewGroup] Error:", err)
      alert("Failed to open group details.")
    }
  }

  // --- Favorite toggle ---
  const handleToggleFavorite = (groupId: string) => {
    setGroups(prev =>
      prev.map(group => (group.id === groupId ? { ...group, isFavorite: !group.isFavorite } : group))
    )
  }

  // --- Search ---
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchedGroupId(null)
      return
    }
    const found = groups.find(g => g.code === searchTerm.trim())
    setSearchedGroupId(found ? found.id : null)
    if (!found) {
      setToastMessage(`Group with code "${searchTerm}" not found.`)
      setToastType("error")
      setShowToast(true)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") setSearchedGroupId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const sortedGroups = useMemo(() => {
    const sorted = [...groups].sort((a, b) => {
      if (searchedGroupId) {
        if (a.id === searchedGroupId) return -1
        if (b.id === searchedGroupId) return 1
      }
      return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
    })
    return sorted
  }, [groups, searchedGroupId])

  return (
    <DefaultPage>
      <main className="flex-1">
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

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-gray-600 font-medium">Found {sortedGroups.length} groups</p>
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16">
            <Users className="w-48 h-48 text-gray-300" />
            <h3 className="mt-8 text-2xl font-bold text-gray-700">No groups were found</h3>
            <p className="text-gray-500 mt-2">Create a new group or search by code to get started!</p>
          </div>
        ) : (
          <div className="px-6">
            <div className="flex flex-col gap-4">
              {sortedGroups.map((g, i) => (
                <GroupCard
                  key={g.id}
                  id={g.id}
                  name={g.name}
                  description={g.description}
                  imageUrl={g.imageUrl}
                  members={g.members}
                  isFavorite={g.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onJoinGroup={(groupId, groupName) => handleJoinGroup(groupId, groupName)}
                  onViewGroup={handleViewGroup}  // ✅ เพิ่มบรรทัดนี้เข้าไป
                />
              ))}
            </div>
          </div>
        )}

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
