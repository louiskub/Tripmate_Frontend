"use client"

import SideNavbar from "@/components/car-manage/sidenav/sidenav"
import Navbar from "@/components/navbar/navbar"
import { useState, useEffect } from "react" // <-- 1. เพิ่ม useEffect
import CarListItem from "@/components/car-manage/rentalcars/CarListItem"
import AddNewCarModal from "@/components/car-manage/AddNewCarModal"
import CarDetailModal from "@/components/car-manage/CarDetailModal"
import ManageCarNav from "@/components/car-manage/rentalcars/ManageCarNav"

import { endpoints } from "@/config/endpoints.config"
import { getCookieFromName } from "@/utils/service/cookie"
import { uploadBlobUrls } from "@/utils/service/upload"
import axios from "axios"
// import { img } from 'framer-motion/client'; // <-- 2. ลบ import ที่ไม่ได้ใช้งาน

// 3. ลบ const initialCars [...] ทั้งหมด (ย้ายไปอยู่ใน useEffect แทน)

/**
 * ฟังก์ชันสำหรับแปลงข้อมูลรถที่ได้จาก API (โครงสร้างแบบหนึ่ง)
 * ไปเป็นข้อมูลรถที่คอมโพเนนต์คาดหวัง (โครงสร้างอีกแบบหนึ่ง)
 */
const transformApiCar = (apiCar: any, location: string): any => {
  // แปลง availability จาก { monday: true, ... }
  // เป็น { monday: { available: true, hours: "08:00-20:00" }, ... }
  const availability: any = {}
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]
  days.forEach((day) => {
    const isAvailable = apiCar.availability ? apiCar.availability[day] === true : true
    availability[day] = {
      available: isAvailable
    }
  })

  // แปลง insurance
  const insurance = {
    provider: apiCar.insurance?.provider,
    coverage: apiCar.insurance?.coverage,
    expiry: apiCar.insurance?.validUntil, // แมพ validUntil ไปเป็น expiry
  }

  return {
    ...apiCar,
    image: apiCar.pictures[0] || "https://placehold.co/430x412/CCCCCC/FFFFFF?text=No+Image",
    pricePerDay: parseFloat(apiCar.pricePerDay), // แปลง string เป็น number
    pricePerHour: parseFloat(apiCar.pricePerHour), // แปลง string เป็น number
    deposit: parseFloat(apiCar.deposit), // แปลง string เป็น number
    availability: availability, // ใช้ availability ที่แปลงแล้ว
    insurance: insurance, // ใช้ insurance ที่แปลงแล้ว
    location: location, // ใช้ location ที่ดึงมาจาก Crc
    rating: 5.0, // ใส่ค่าเริ่มต้น (API ไม่มี)
    status: "available" as const, // ใส่ค่าสถานะเริ่มต้น (API ไม่มี)
  }
}

// 4. แก้ไข Type ของ function (int -> number, Array -> any[])
const uploadImg = async (img: any[], id: number) => {
  console.log("img", typeof img[0], img)

  const formdata = await uploadBlobUrls(img)
  const res = await axios.post(endpoints.serviceManage.car.uploadImg(id), formdata, {
    headers: {
      Authorization: `Bearer ${getCookieFromName("token")}`,
      "Content-Type": "multipart/form-data",
    },
  })
  console.log("Upload Img success:", res.data)
  console.log("Slice", res.data.pictures.slice(-img.length))
  return res.data.pictures.slice(-img.length)
}

export default function RentalCarsPage() {
  // 5. เปลี่ยน useState(initialCars) เป็น array ว่าง
  const [cars, setCars] = useState<any[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState("total")

  // 6. เพิ่ม useEffect เพื่อดึงข้อมูลเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const fetchCars = async () => {
      try {
        // ID ของศูนย์บริการ (จากตัวอย่าง output ของคุณ)
        const crcId = localStorage.getItem("serviceId")
        
        // สมมติว่า endpoints.config.js มี endpoint นี้
        // @ts-ignore (ในกรณีที่ endpoints.config.js ยังไม่มี getCarsByCrc)
        const apiUrl = endpoints.serviceManage.car.getAllCar(crcId) // เช่น /car-rental-center/svc-003/

        const res = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${getCookieFromName("token")}`,
          },
        })

        // ดึงข้อมูลจาก API response ที่คุณให้มา
        const apiData = res.data
        const apiCars = apiData.cars // array รถจาก API
        const centerLocation = apiData.name.includes("Bangkok") ? "Bangkok" : apiData.name // ดึง Location จากชื่อศูนย์

        // แปลงข้อมูล API (apiCars) ให้เป็นโครงสร้างที่คอมโพเนนต์ต้องการ
        const transformedCars = apiCars.map((car: any) => 
          transformApiCar(car, centerLocation)
        )

        // ตั้งค่า state ด้วยข้อมูลที่แปลงแล้ว
        setCars(transformedCars)

      } catch (error) {
        console.error("Failed to fetch cars:", error)
        // หากดึงข้อมูลไม่สำเร็จ สามารถตั้งค่า state เป็น array ว่าง
        setCars([])
      }
    }

    fetchCars()
  }, []) // [] หมายถึงให้รัน Effect นี้แค่ครั้งเดียวตอนโหลด

  // call api in In Component
  const handleCreateCar = async (data: any) => {
    console.log("click create")
    const img = data.pictures
    data.pictures = []
    const res = await axios.post(endpoints.serviceManage.car.addCar, data, {
      headers: {
        Authorization: `Bearer ${getCookieFromName("token")}`,
        "Content-Type": "application/json",
      },
    })
    console.log("create success", res)

    data.pictures = await uploadImg(img, data.id)
    console.log("Data from AddNewCarModal:", data)
    const newCar = {
      ...data,
      location: "Bangkok",
      rating: 5.0,
      pictures: data.pictures || [],
      availability:
        data.availability || {
          monday: { available: true, hours: "08:00-20:00" },
          tuesday: { available: true, hours: "08:00-20:00" },
          wednesday: { available: true, hours: "08:00-20:00" },
          thursday: { available: true, hours: "08:00-20:00" },
          friday: { available: true, hours: "08:00-20:00" },
          saturday: { available: true, hours: "09:00-18:00" },
          sunday: { available: true, hours: "09:00-18:00" },
        },
      status: "available",
    }

    setCars((prevCars) => [newCar, ...prevCars])
    setIsAddModalOpen(false)
  }

  const handleViewDetails = (car: any) => {
    console.log("open", car)
    setSelectedCar(car)
    setIsDetailModalOpen(true)
  }

  const handleSaveCar = async (updatedCar: any) => {
    // updatedCar.
    const img = updatedCar.pictures
    updatedCar.pictures = await uploadImg(img, updatedCar.id)

    const res = await axios.patch(
      endpoints.serviceManage.car.editCar(updatedCar.id),
      updatedCar,
      {
        headers: {
          Authorization: `Bearer ${getCookieFromName("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
    console.log("Update success:", res.data)

    // upload Img section

    // const img = updatedCar.pictures
    // console.log("img", typeof(img[0]), img)

    // const formdata = await uploadBlobUrls(img)
    // res = await axios.post(endpoints.serviceManage.car.uploadImg(updatedCar.id), formdata, {
    //   headers: {
    //     'Authorization': `Bearer ${getCookieFromName("token")}`,
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    // console.log("Upload Img success:", res.data)

    // const
    // console.log(updatedCar)
    // console.log("update success", res)
    setCars((prevCars) =>
      prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car))
    )
  }

  const handleRemoveCar = async (car: any) => {
    const res = await axios.delete(
      endpoints.serviceManage.car.deleteCar(car.id)
    )
    setCars((prevCars) => prevCars.filter((c) => c.id !== car.id))
  }

  const filteredCars = cars.filter((car) => {
    if (activeFilter === "total") return true
    if (activeFilter === "available") return car.status === "available"
    if (activeFilter === "rented") return car.status === "rented"
    if (activeFilter === "repair") return car.status === "under repair"
    return true
  })

  const availableCount = cars.filter(
    (car) => car.status === "available"
  ).length
  const rentedCount = cars.filter((car) => car.status === "rented").length
  const repairingCount = cars.filter(
    (car) => car.status === "under repair"
  ).length

  const getTitle = () => {
    if (activeFilter === "available") return "Available Cars"
    if (activeFilter === "rented") return "Rented Rentals"
    if (activeFilter === "repair") return "Under Repair"
    return "Total Cars"
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavbar />
        <div className="flex flex-1">
          <ManageCarNav
            onAddNew={() => setIsAddModalOpen(true)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getTitle()}
              </h1>
              <p className="text-gray-600 mb-3">{filteredCars.length} Cars</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-gray-800">
                      {availableCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-gray-600">Rented:</span>
                    <span className="font-semibold text-gray-800">
                      {rentedCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                    <span className="text-gray-600">Repairing:</span>
                    <span className="font-semibold text-gray-800">
                      {repairingCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    Sort by
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCars.map((car) => (
                <CarListItem
                  key={car.id}
                  car={car}
                  onClick={() => handleViewDetails(car)}
                />
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  No cars found for this filter
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AddNewCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCar}
      />

      <CarDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        car={selectedCar}
        onSave={handleSaveCar}
        onRemove={handleRemoveCar}
      />
    </div>
  )
}