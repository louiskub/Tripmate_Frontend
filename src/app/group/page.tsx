"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Users } from "lucide-react"
import CreateGroupModal from "@/components/group-create-popup"
import Toast from "@/components/ui/toast"
import DefaultPage from "@/components/layout/default-layout"
import GroupCard from "@/components/group-card"

// --- Interfaces (เหมือนเดิม) ---
interface Member {
  id: string
  avatar?: string
}
type GroupStatus = "Planning" | "In Progress" | "Finished"
interface Group {
  id: string
  code: string
  name: string
  description: string
  imageUrl?: string
  hostName: string
  members: Member[]
  status: GroupStatus
  isFavorite: boolean
}

export default function BookingHistory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])

  // --- State สำหรับ Search ---
  const [searchTerm, setSearchTerm] = useState("")
  const [searchedGroupId, setSearchedGroupId] = useState<string | null>(null)

  // --- State สำหรับ Toast ---
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // --- Data Persistence ---
  useEffect(() => {
    const savedGroups = localStorage.getItem("tripmate-groups")
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups).map((g: Group) => ({
          ...g,
          isFavorite: g.isFavorite || false,
        }))
        setGroups(parsed)
      } catch (error) {
        console.error("Error parsing saved groups:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (groups.length > 0 || localStorage.getItem("tripmate-groups")) {
      localStorage.setItem("tripmate-groups", JSON.stringify(groups))
    }
  }, [groups])

  // --- Group Functions ---
  const createUniqueGroupId = () => {
    let newId: string
    let isUnique = false
    while (!isUnique) {
      const candidateId = Math.floor(100000 + Math.random() * 900000).toString()
      if (!groups.some((group) => group.id === candidateId)) {
        newId = candidateId
        isUnique = true
      }
    }
    return newId
  }

  const handleCreateGroup = (data: { name: string; description: string; image?: File }) => {
    const newGroupId = createUniqueGroupId()
    const defaultMembers: Member[] = [
        { id: "user_1", avatar: "/images/team.jpg" }, { id: "user_2", avatar: "/images/team.jpg" },
        { id: "user_3", avatar: "/images/team.jpg" }, { id: "user_4", avatar: "/images/team.jpg" },
        { id: "user_5", avatar: "/images/team.jpg" }, { id: "user_6", avatar: "/images/team.jpg" },
        { id: "user_7", avatar: "/images/team.jpg" }, { id: "user_8", avatar: "/images/team.jpg" },
        { id: "user_9", avatar: "/images/team.jpg" }, { id: "user_10", avatar: "/images/team.jpg" },
    ]
    const newGroup: Group = {
      id: newGroupId,
      code: newGroupId,
      name: data.name,
      description: data.description,
      imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
      hostName: "Current User",
      members: defaultMembers,
      status: "Planning",
      isFavorite: false,
    }
    setGroups((prev) => [newGroup, ...prev])
    setToastMessage("Group created successfully!")
    setToastType("success")
    setShowToast(true)
  }

  const handleToggleFavorite = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, isFavorite: !group.isFavorite } : group
      )
    )
  }

  const handleJoinGroup = (groupName: string) => {
    setToastMessage(`Joined "${groupName}" successfully!`)
    setToastType("success")
    setShowToast(true)
  }

  // --- Search Functions ---
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchedGroupId(null)
      return
    }

    const foundGroup = groups.find(group => group.code === searchTerm.trim())

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
    const value = e.target.value
    setSearchTerm(value)
    if (value === "") {
      setSearchedGroupId(null)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // --- Sorting Logic ---
  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      // 1. Searched group comes first
      if (searchedGroupId) {
        if (a.id === searchedGroupId) return -1
        if (b.id === searchedGroupId) return 1
      }
      // 2. Favorite groups come next
      return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
    })
  }, [groups, searchedGroupId])

  return (
    <DefaultPage>
      <main className="flex-1">
        {/* --- Header & Search Bar (ดีไซน์เดิม) --- */}
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

        {/* --- Filter Bar (ดีไซน์เดิม) --- */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-gray-600 font-medium">Found {sortedGroups.length} groups</p>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Sort by option1</span>
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
            <p className="text-gray-500 mt-2">Create a new group or search by code to get started!</p>
          </div>
        ) : (
          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              {sortedGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  description={group.description}
                  imageUrl={group.imageUrl}
                  members={group.members}
                  status={group.status}
                  isFavorite={group.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onJoinGroup={handleJoinGroup}
                />
              ))}
            </div>
          </div>
        )}

        <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateGroup} />
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