"use client"

import { useState, useEffect, useMemo } from "react" // 1. Import useMemo
import axios from "axios"
import Navbar from "@/components/navbar/navbar"
import VendorSideNav from "@/components/navbar/hotelvendorsidenav"
import ManageHotelNav from "@/components/navbar/hotelstatussidenav"
import Link from "next/link"
import Cookies from "js-cookie"
import { endpoints } from "@/config/endpoints.config"
import ConfirmModal from "@/app/hotelmanagement/myhotel/ConfirmModal" 

export default function MyHotelPage() {
  const [hotels, setHotels] = useState<any[]>([]) // 2. ⭐️ นี่คือ "ข้อมูลหลัก"
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) 
  const [activeFilter, setActiveFilter] = useState("total") // 3. ⭐️ นี่คือ "ตัวกรอง"
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null) 

  // ดึงข้อมูลโรงแรม (เหมือนเดิม)
  useEffect(() => {
    const fetchHotel = async () => {
      setIsLoading(true)
      setError(null)
      const token = Cookies.get("token")

      if (!token) {
        setError("No authentication token found. Please login.")
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(`${endpoints.user_services.owner}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log("Fetched hotels data:", response.data)
        setHotels(response.data) // ⭐️ เก็บข้อมูลหลัก
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.status === 401) {
            setError("Unauthorized. Please check your login session.")
          } else {
            setError(err.message)
          }
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotel()
  }, [])

  // 4. ⭐️ [เพิ่ม] สร้าง "ข้อมูลที่กรองแล้ว" โดยใช้ useMemo
  const filteredHotels = useMemo(() => {
    console.log(`Applying filter: ${activeFilter}`) 

    if (activeFilter === "available") {
      // ⭐️ กรองตามที่คุณขอ: "active"
      return hotels.filter((hotel) => hotel.status === "active");
    }

    if (activeFilter === "unavailable") {
      // ⭐️ (ผมเดา) Unavailable คืออันที่ *ไม่ใช่* "active"
      return hotels.filter((hotel) => hotel.status !== "active");
    }

    if (activeFilter === "full") {
      // ⭐️ (ผมเดา) Full Booking อาจจะมี status 'full'
      return hotels.filter((hotel) => hotel.status === "full"); 
    }

    // ⭐️ Default: ถ้า filter เป็น "total"
    return hotels; // คืนค่าทั้งหมด

  }, [hotels, activeFilter]); // ⭐️ Dependencies

  // --- ฟังก์ชันสำหรับจัดการ POPUP (เหมือนเดิม) ---

  const handleOpenDeleteModal = (hotelId: string) => {
    setHotelToDelete(hotelId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setHotelToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!hotelToDelete) return

    console.log("กำลังลบโรงแรม ID:", hotelToDelete)

    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("Token not found. Please login again.");
        handleCloseModal();
        return;
      }

      // 1. เรียก API เพื่อลบ
      await axios.delete(endpoints.user_services.delete(hotelToDelete), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 2. ถ้าลบสำเร็จ ให้อัปเดต State (ลบออกจากหน้าจอ)
      // ⭐️ (สำคัญ) ต้องอัปเดต 'hotels' (Master List) ไม่ใช่ filteredHotels
      setHotels((currentHotels) =>
        currentHotels.filter((hotel) => hotel.id !== hotelToDelete)
      )
    } catch (err) {
      console.error("Failed to delete hotel:", err);
      setError("Failed to delete hotel.");
    } finally {
      // 3. ปิด Modal เสมอ
      handleCloseModal(); 
    }
  }

  // --- 5. ⭐️ [แก้ไข] ฟังก์ชันสำหรับ Render (ให้ใช้ filteredHotels) ---
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10">Loading hotel data...</div>
    }

    if (error) {
      return (
        <div className="bg-white rounded-[10px] border border-red-300 p-4 sm:p-5">
          <div className="text-center p-10 text-red-600">Error: {error}</div>
        </div>
      )
    }
    
    // (เช็คว่ามีข้อมูลหลักหรือไม่)
    if (!hotels || hotels.length === 0) {
      return (
        <div className="bg-white rounded-[10px] border border-gray-200 p-4 sm:p-5">
          <div className="text-center p-10 text-gray-500">No hotel data found.</div>
        </div>
      )
    }

    // (เช็คว่าข้อมูลที่กรองแล้วมีหรือไม่)
    if (filteredHotels.length === 0) {
       return (
        <div className="bg-white rounded-[10px] border border-gray-200 p-4 sm:p-5">
          <div className="text-center p-10 text-gray-500">
            No hotels match the "{activeFilter}" filter.
          </div>
        </div>
      )
    }

    // ⭐️ [แก้ไข] ให้ map จาก 'filteredHotels'
    return (
      <div className="space-y-6">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-[10px] border border-gray-200 p-4 sm:p-5">
            <div className="space-y-5">
              {hotel.serviceImg && (
                <div className="w-full max-w-2xl h-64 rounded-[10px] overflow-hidden relative shadow-md">
                  <img
                    src={hotel.serviceImg || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/800x400?text=Image+Not+Found")}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{hotel.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    hotel.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {hotel.status}
                </span>
              </div>

              <p className="text-gray-700 text-lg">{hotel.description}</p>

              {/* ⭐️ [FIX] เอารายละเอียดกลับมา */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Details</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>Hotel ID:</strong> <span className="text-gray-600">{hotel.id}</span>
                  </li>
                  <li>
                    <strong>Hotel Type:</strong> <span className="text-gray-600 capitalize">{hotel.type}</span>
                  </li>
                  <li>
                    <strong>Location ID:</strong> <span className="text-gray-600">{hotel.locationId}</span>
                  </li>
                </ul>
              </div>

              {/* ⭐️ [FIX] เอาปุ่มกลับมา */}
              <div className="flex justify-end gap-3 mt-6">
                {/* <Link href={`/hotelmanagement/edit-hotel/${hotel.id}`} legacyBehavior>
                  <a className="px-6 py-2 bg-sky-700 text-white text-base font-bold rounded-2xl shadow-lg hover:bg-sky-800">
                    Edit Hotel
                  </a>
                </Link> */}
                <button
                  type="button"
                  className="px-6 py-2 bg-red-700 text-white rounded-2xl shadow-lg hover:bg-red-800"
                  onClick={() => handleOpenDeleteModal(hotel.id)}
                >
                  Delete Hotel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // --- JSX หลักของหน้า (เหมือนเดิม) ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col lg:flex-row">
        <VendorSideNav />

        <main className="flex-1 flex flex-col">
          {/* Header Box (เหมือนเดิม) */}
          <div className="bg-white border-b border-gray-200 p-4 sm:p-7 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">My Hotel</h1>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* ManageHotelNav (ทำงานถูกต้อง) */}
            <div className="hidden lg:flex w-48 flex-shrink-0 bg-white border-r border-gray-200">
              <ManageHotelNav 
                onAddNew={() => {}} 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter} 
              />
            </div>

            {/* Content Area (ทำงานถูกต้อง) */}
            <div className="flex-1 p-4 sm:p-7 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Modal (เหมือนเดิม) */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="ลบโรงแรม"
        message="แน่ใจมั้ยว่าจะลบโรงแรมนี้?"
      />
    </div>
  )
}