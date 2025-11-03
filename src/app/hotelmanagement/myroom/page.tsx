"use client"

import { useState, useRef, useEffect } from "react";
import { Menu, X, Upload } from "lucide-react"
import Navbar from '@/components/navbar/navbar';
import VendorSideNav from '@/components/navbar/hotelvendorsidenav';
// import Link from "next/link";

// (อัปเดต) Mock data ที่มีรายละเอียดมากขึ้น
const mockRooms = [
  {
    id: "rm101",
    name: "Deluxe Ocean Facing (King)",
    hotelName: "Centara Grand Mirage",
    price: "4,500 THB",
    status: "Available",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/740816621.jpg?k=2a0fec3bd4cc1fcbe6e004ef8c29a4a8b8daf62e1614bea0b9cd1bb39d6fec4d&o=",
    details: { bed: "1 King Bed", size: "42 sqm", guests: 2, view: "Ocean" }
  },
  {
    id: "rm102",
    name: "Deluxe Ocean Facing (Twin)",
    hotelName: "Centara Grand Mirage",
    price: "4,500 THB",
    status: "Occupied",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/259687727.jpg?k=88d4c31abb0a0896cfb07ca47a7938b310f3b468516671a3a8e0ab75f30abb56&o=",
    details: { bed: "2 Double Beds", size: "42 sqm", guests: 2, view: "Ocean" }
  },
  {
    id: "rm201",
    name: "Premium Deluxe Ocean Facing",
    hotelName: "Centara Grand Mirage",
    price: "5,800 THB",
    status: "Available",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/583326238.jpg?k=5931e64a1d591ce520714015da7afc9c42b204d283f1b2de099021afcfc1b6b3&o=",
    details: { bed: "1 King Bed", size: "45 sqm", guests: 2, view: "Ocean" }
  },
  {
    id: "rm202",
    name: "Premium Deluxe (Family)",
    hotelName: "Centara Grand Mirage",
    price: "6,200 THB",
    status: "Available",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max500/219015637.jpg?k=0e7d41d9f0d9ed692b57e09b20422f2f062aecd28c1ee77c96c1534f541f3aae&o=",
    details: { bed: "1 King Bed & Bunk Beds", size: "45 sqm", guests: 4, view: "Ocean" }
  },
  {
    id: "rm301",
    name: "Club Mirage Ocean Facing Suite",
    hotelName: "Centara Grand Mirage",
    price: "8,200 THB",
    status: "Unavailable",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/387618925.jpg?k=38f0dc242e9ec313a8cbc09b1053dc2599d4145e6ba82f7b0abfa4b6f89b6704&o=",
    details: { bed: "1 King Bed", size: "80 sqm", guests: 2, view: "Panoramic Ocean" }
  },
  {
    id: "rm302",
    name: "Club Mirage Grand Suite",
    hotelName: "Centara Grand Mirage",
    price: "9,500 THB",
    status: "Available",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/725513448.jpg?k=7729d40577053c465c3e43065b3c12d03df305aed4cdafe1449f40debed9e306&o=",
    details: { bed: "1 King Bed + Living Room", size: "92 sqm", guests: 3, view: "Panoramic Ocean" }
  },
];


export default function CreateHotelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ แสดง preview เมื่อเลือกไฟล์
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCreateHotel = async () => {
    if (!file) {
      alert("กรุณาเลือกภาพโรงแรมก่อน");
      return;
    }

    // 🧩 ตรงนี้จะเป็นตอนเชื่อม backend จริง
    // เช่น ส่ง formData พร้อมข้อมูลอื่นๆ
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", "My Hotel Name");
    formData.append("location", "Bangkok");

    // ตอนนี้แค่ console log ไว้ดูก่อน
    console.log("📦 file to upload:", file);
    console.log("✅ ready to send with formData:", formData);

    alert("ข้อมูลถูกเก็บไว้พร้อมส่ง (ยังไม่เชื่อม backend)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <Navbar />

      <div className="flex">
        <VendorSideNav />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-7">
          <div className="bg-gray-50 rounded-[10px] overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Secondary Sidebar (ลบสี่เหลี่ยมสีดำออกแล้ว) */}
              {/* (ส่วน Sidebar ถูกลบออกตามโค้ดที่คุณส่งมา) */}

              {/* Content Area */}
              <div className="flex-1 p-4 sm:p-5 bg-gray-50">

                {/* --- (เพิ่ม) Mock Room List --- */}
                <div className="mb-8">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">
                    My Hotel Rooms
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {mockRooms.map((room) => (
                      <div key={room.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <img src={room.imageUrl} alt={room.name} className="h-40 w-full object-cover" />
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-base font-bold text-slate-900 truncate">{room.name}</h3>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              room.status === "Available" ? "bg-green-100 text-green-800" :
                              room.status === "Occupied" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {room.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{room.hotelName}</p>
                          <p className="text-base font-semibold text-sky-700">{room.price}</p>
                          {/* (ถ้าอยากแสดงรายละเอียดเพิ่ม ก็เติม JSX ตรงนี้ได้เลย) */}
                          {/* <p className="text-xs text-gray-500">{room.details.bed} | {room.details.size}</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}