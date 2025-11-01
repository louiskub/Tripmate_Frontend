"use client"

import SideNavbar from '@/components/car-manage/sidenav/sidenav'; 
import Navbar from '@/components/navbar/navbar';
import { useState } from "react"
import CarListItem from "@/components/car-manage/rentalcars/CarListItem"
import AddNewCarModal from "@/components/car-manage/AddNewCarModal"
import CarDetailModal from "@/components/car-manage/CarDetailModal"
import ManageCarNav from "@/components/car-manage/rentalcars/ManageCarNav"

import { endpoints } from "@/config/endpoints.config"
import { getCookieFromName } from "@/utils/service/cookie"
import { uploadBlobUrls } from "@/utils/service/upload"
import axios from "axios"
import { img } from 'framer-motion/client';

const initialCars = [
  {
    name: "Toyota Yaris Ativ",
    id: "ดด5678",
    crcId: "svc-003",
    model: "Yaris Ativ 1.2 Sport",
    description: "A reliable and fuel-efficient sedan, perfect for city driving.",
    seats: 4,
    image: "https://placehold.co/430x412/3B82F6/FFFFFF?text=Car+1",
    pricePerDay: 1200,
    pricePerHour: 180.25,
    brand: "Toyota",
    currency: "THB",
    deposit: 3000,
    doors: 4,
    features: ["Air Conditioner", "Bluetooth", "ABS", "Airbags"],
    fuelType: "Petrol",
    luggage: 2,
    mileageLimitKm: 300,
    pictures: ["https://placehold.co/430x412/3B82F6/FFFFFF?text=Car+1"],
    transmission: "Automatic",
    year: 2023,
    availability: {
      monday: { available: true, hours: "08:00-20:00" },
      tuesday: { available: true, hours: "08:00-20:00" },
      wednesday: { available: true, hours: "08:00-20:00" },
      thursday: { available: true, hours: "08:00-20:00" },
      friday: { available: true, hours: "08:00-20:00" },
      saturday: { available: false },
      sunday: { available: false },
    },
    insurance: {
      provider: "AIA",
      coverage: "Full coverage",
      expiry: "2026-12-31",
    },
    location: "Bangkok",
    rating: 4.8,
    status: "available" as const,
  },
  {
    name: "Honda Civic",
    id: "กก1234",
    crcId: "svc-001",
    model: "Civic 1.5 Turbo RS",
    description: "Sporty look with a comfortable interior. Great handling.",
    seats: 5,
    image: "https://placehold.co/430x412/10B981/FFFFFF?text=Car+2",
    pricePerDay: 1800,
    pricePerHour: 250,
    brand: "Honda",
    currency: "THB",
    deposit: 5000,
    doors: 4,
    features: ["Sunroof", "Leather Seats", "Navigation", "Cruise Control", "Lane Assist"],
    fuelType: "Petrol",
    luggage: 3,
    mileageLimitKm: 250,
    pictures: ["https://placehold.co/430x412/10B981/FFFFFF?text=Car+2"],
    transmission: "Automatic",
    year: 2024,
    availability: {
      monday: { available: true, hours: "08:00-20:00" },
      tuesday: { available: true, hours: "08:00-20:00" },
      wednesday: { available: true, hours: "08:00-20:00" },
      thursday: { available: true, hours: "08:00-20:00" },
      friday: { available: true, hours: "08:00-20:00" },
      saturday: { available: true, hours: "09:00-18:00" },
      sunday: { available: true, hours: "09:00-18:00" },
    },
    insurance: {
      provider: "Bangkok Insurance",
      coverage: "Comprehensive",
      expiry: "2025-12-31",
    },
    location: "Chiang Mai",
    rating: 4.9,
    status: "rented" as const,
  },
  {
    name: "Ford Ranger",
    id: "ขข9876",
    crcId: "svc-005",
    model: "Ranger Wildtrak 2.0",
    description: "Large pickup truck, strong and durable, suitable for all routes.",
    seats: 5,
    image: "https://placehold.co/430x412/F59E0B/FFFFFF?text=Car+3",
    pricePerDay: 2500,
    pricePerHour: 350,
    brand: "Ford",
    currency: "THB",
    deposit: 8000,
    doors: 4,
    features: ["4WD", "Tow Bar", "Bed Liner", "Off-road Package", "Hill Descent"],
    fuelType: "Diesel",
    luggage: 5,
    mileageLimitKm: 400,
    pictures: ["https://placehold.co/430x412/F59E0B/FFFFFF?text=Car+3"],
    transmission: "Automatic",
    year: 2023,
    availability: {
      monday: { available: false },
      tuesday: { available: false },
      wednesday: { available: false },
      thursday: { available: true, hours: "08:00-20:00" },
      friday: { available: true, hours: "08:00-20:00" },
      saturday: { available: true, hours: "08:00-20:00" },
      sunday: { available: true, hours: "08:00-20:00" },
    },
    insurance: {
      provider: "Muang Thai Insurance",
      coverage: "Full coverage + Off-road",
      expiry: "2025-06-30",
    },
    location: "Phuket",
    rating: 4.7,
    status: "under repair" as const,
  },
]

const uploadImg = async (img: Array, id: int) => {
    console.log("img", typeof(img[0]), img)
        
    const formdata = await uploadBlobUrls(img)
    const res = await axios.post(endpoints.serviceManage.car.uploadImg(id), formdata, {
      headers: {
        'Authorization': `Bearer ${getCookieFromName("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    console.log("Upload Img success:", res.data)
    console.log("Slice", res.data.pictures.slice(-img.length))
    return res.data.pictures.slice(-img.length)
}


export default function RentalCarsPage() {
  const [cars, setCars] = useState(initialCars)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState("total")

  // call api in In Component
  const handleCreateCar = async (data: any) => {
    console.log("click create")
    const img = data.pictures
    data.pictures = []
    const res = await axios.post(endpoints.serviceManage.car.addCar, data, {
      headers: {
        'Authorization': `Bearer ${getCookieFromName("token")}`,
        'Content-Type': 'application/json'
      }
    })
    console.log("create success", res)

    data.pictures = await uploadImg(img, data.id)
    console.log("Data from AddNewCarModal:", data)
    const newCar = {
      ...data,
      location: "Bangkok",
      rating: 5.0,
      pictures: data.pictures || [],
      availability: data.availability || {
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

    const res = await axios.patch(endpoints.serviceManage.car.editCar(updatedCar.id), updatedCar, {
      headers: {
        'Authorization': `Bearer ${getCookieFromName("token")}`,
        'Content-Type': 'application/json'
      }
    })
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
    setCars((prevCars) => prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car)))
  }

  const handleRemoveCar = async (car: any) => {
    const res = await axios.delete(endpoints.serviceManage.car.deleteCar(car.id))
    setCars((prevCars) => prevCars.filter((c) => c.id !== car.id))
  }

  const filteredCars = cars.filter((car) => {
    if (activeFilter === "total") return true
    if (activeFilter === "available") return car.status === "available"
    if (activeFilter === "rented") return car.status === "rented"
    if (activeFilter === "repair") return car.status === "under repair"
    return true
  })

  const availableCount = cars.filter((car) => car.status === "available").length
  const rentedCount = cars.filter((car) => car.status === "rented").length
  const repairingCount = cars.filter((car) => car.status === "under repair").length

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
                    <p className="text-gray-600 mb-3">{filteredCars.length} Cars</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            <span className="text-gray-600">Available:</span>
                            <span className="font-semibold text-gray-800">{availableCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
                            <span className="text-gray-600">Rented:</span>
                            <span className="font-semibold text-gray-800">{rentedCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                            <span className="text-gray-600">Repairing:</span>
                            <span className="font-semibold text-gray-800">{repairingCount}</span>
                        </div>
                        </div>
                        <div className="flex items-center gap-4">
                        <button className="text-sm text-gray-600 hover:text-gray-800">Sort by</button>
                        <button className="text-sm text-gray-600 hover:text-gray-800">View</button>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-4">
                    {filteredCars.map((car) => (
                        <CarListItem key={car.id} car={car} onClick={() => handleViewDetails(car)} />
                    ))}
                    </div>

                    {filteredCars.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">No cars found for this filter</p>
                    </div>
                    )}
                </main>
            </div>
        </div>

      {/* Modals */}
      <AddNewCarModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleCreateCar} />

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
