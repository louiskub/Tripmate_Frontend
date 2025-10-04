"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Users } from "lucide-react"
import CreateGroupModal from "@/components/group-create-popup"
import Toast from "@/components/ui/toast"
import DefaultPage from "@/components/layout/default-layout"
import GroupCard from "@/components/group-card"

interface Group {
  id: string
  code: string
  name: string
  description: string
  imageUrl?: string
  hostName: string
}

export default function BookingHistory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [showToast, setShowToast] = useState(false)

  // โหลดข้อมูลจาก localStorage เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    const savedGroups = localStorage.getItem("tripmate-groups")
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    }
  }, [])

  // บันทึกข้อมูลลง localStorage ทุกครั้งที่ groups มีการเปลี่ยนแปลง
  useEffect(() => {
    // เช็คเพื่อให้แน่ใจว่าเราจะไม่เขียนข้อมูลเปล่าๆ ลงไปในตอนแรก
    if (groups.length > 0 || localStorage.getItem("tripmate-groups")) {
      localStorage.setItem("tripmate-groups", JSON.stringify(groups))
    }
  }, [groups])

  // CHANGE 1: ปรับปรุงฟังก์ชันสร้างรหัสให้เช็คความซ้ำซ้อน
  const createUniqueGroupId = () => {
    let newId: string
    let isUnique = false
    // วนลูปจนกว่าจะได้ ID ที่ไม่ซ้ำ
    while (!isUnique) {
      const candidateId = Math.floor(100000 + Math.random() * 900000).toString()
      // เช็คว่า ID ที่สุ่มมาใหม่ มีอยู่ในกลุ่มเดิมแล้วหรือยัง
      if (!groups.some((group) => group.id === candidateId)) {
        newId = candidateId // ถ้ารหัสไม่ซ้ำ ให้ใช้รหัสนี้
        isUnique = true
      }
    }
    return newId
  }

  const handleCreateGroup = (data: { name: string; description: string; image?: File }) => {
    const newGroupId = createUniqueGroupId() // สร้าง ID ที่ไม่ซ้ำ

    const newGroup: Group = {
      id: newGroupId, // CHANGE 2: ใช้ ID ที่เป็นตัวเลข 6 หลัก
      code: newGroupId, // ใช้ตัวเดียวกันสำหรับ code ที่แสดงผล
      name: data.name,
      description: data.description,
      imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
      hostName: "Current User",
    }

    setGroups((prev) => [...prev, newGroup])
    setShowToast(true)
  }

  return (
    <DefaultPage>
      <main className="flex-1">
        {/* ... โค้ดส่วน JSX ที่เหลือเหมือนเดิม ... */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input placeholder="" className="pl-12 w-full h-12 bg-white border-2 border-gray-300 rounded-lg" />
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
          <p className="text-gray-600 font-medium">Found {groups.length} groups</p>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Sort by option1</span>
            <span className="text-gray-600 font-medium">View</span>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            {/* ... No groups view ... */}
          </div>
        ) : (
          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                // GroupCard จะจัดการเรื่อง Link เอง
                <GroupCard
                  key={group.id}
                  id={group.id}
                  code={group.code}
                  name={group.name}
                  hostName={group.hostName}
                  description={group.description}
                  imageUrl={group.imageUrl}
                />
              ))}
            </div>
          </div>
        )}

        <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateGroup} />
        <Toast message="สร้างกลุ่มสำเร็จแล้ว!" isVisible={showToast} onClose={() => setShowToast(false)} type="success" />
      </main>
    </DefaultPage>
  )
}