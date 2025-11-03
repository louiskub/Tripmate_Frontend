"use client"

import { useState, useRef, useEffect } from "react";
import { Menu, X, Upload } from "lucide-react"
import Navbar from '@/components/navbar/navbar';
import VendorSideNav from '@/components/navbar/hotelvendorsidenav';
// import Link from "next/link";

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
              {/* Secondary Sidebar */}
              <aside className="w-full lg:w-60 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
                <nav className="flex flex-col gap-3 p-4">
                  <button className="h-9 px-5 flex items-center gap-2.5 text-slate-900 text-base font-medium hover:bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-slate-900" />
                    <span>Total hotel</span>
                  </button>
                  <button className="h-9 px-5 flex items-center gap-2.5 text-slate-900 text-base font-medium hover:bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-slate-900" />
                    <span>Available hotel</span>
                  </button>
                  <button className="h-9 px-5 bg-white flex items-center gap-2.5 text-slate-900 text-base font-medium hover:bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-slate-900" />
                    <span>Unavailable hotel</span>
                  </button>
                  <button className="h-9 px-5 flex items-center gap-2.5 text-slate-900 text-base font-medium hover:bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-slate-900" />
                    <span>Full booking hotel</span>
                  </button>
                  <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-2">
                    <button className="h-9 px-5 bg-blue-50 flex items-center gap-2.5 text-slate-900 text-base font-medium rounded">
                      <div className="w-5 h-5 bg-slate-900" />
                      <span>Add new Hotel</span>
                    </button>
                    <button className="h-9 px-5 flex items-center gap-2.5 text-slate-900 text-base font-medium hover:bg-gray-50 rounded">
                      <div className="w-5 h-5 bg-slate-900" />
                      <span>Remove Hotel</span>
                    </button>
                  </div>
                </nav>
              </aside>

              {/* Content Area */}
              <div className="flex-1 p-4 sm:p-5 bg-gray-50">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">Create Room</h1>

                <div className="flex flex-col xl:flex-row gap-5">
                  {/* Left Column - Image Upload */}
                  <div className="w-full xl:w-96">
                    <div className="bg-white border-2 border-sky-300 rounded-xl p-6 w-full max-w-xl">
                        <p className="text-gray-500 text-lg font-semibold mb-3">Room image</p>
                        {/* Preview */}
                        <div className="w-full h-56 border border-dashed border-sky-300 rounded-lg flex items-center justify-center overflow-hidden mb-4 bg-sky-50">
                        {preview ? (
                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sky-400">No image selected</span>
                        )}
                        </div>

                        {/* hidden input */}
                        <input
                        ref={inputRef}
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        />

                        {/* ปุ่ม Choose / Clear */}
                        <div className="flex gap-3 justify-center">
                        <button
                            type="button"
                            onClick={handleChooseFile}
                            className="px-4 py-2 rounded-md border-2 border-sky-400 text-sky-600 bg-white hover:bg-sky-50"
                        >
                            Choose File
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={!file}
                            className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Clear
                        </button>
                        </div>

                        {file && (
                        <p className="mt-2 text-sm text-gray-500">Selected: {file.name}</p>
                        )}
                    </div>

                    {/* ปุ่ม Create Hotel */}
                    <button
                        type="button"
                        onClick={handleCreateHotel}
                        className="w-full mt-4 max-w-xl py-3 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600"
                    >
                        Create Room
                    </button>
                  </div>

                  {/* Right Column - Hotel Details Form */}
                  <div className="flex-1">
                    <div className="bg-white rounded-[10px] border-2 border-sky-300 p-4 sm:p-6">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">Room Details</h2>

                      <div className="flex flex-col gap-5">
                        {/* Hotel Name */}
                        <div>
                          <label className="block text-slate-900 text-base font-medium mb-2">Room Name</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-blue-200 focus:border-sky-300 focus:outline-none"
                          />
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-slate-900 text-base font-medium mb-2">Tags</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200 focus:border-sky-300 focus:outline-none"
                          />
                        </div>

                        {/* Province */}
                        <div>
                          <label className="block text-slate-900 text-base font-medium mb-2">Province</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200 focus:border-sky-300 focus:outline-none"
                          />
                        </div>

                        {/* Google Map Link */}
                        <div>
                          <label className="block text-slate-900 text-base font-medium mb-2">Google map link</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200 focus:border-sky-300 focus:outline-none"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-slate-900 text-base font-medium mb-2">Description</label>
                          <textarea
                            rows={6}
                            className="w-full px-3 py-2 bg-white rounded-[10px] border-2 border-blue-200 focus:border-sky-300 focus:outline-none resize-none"
                          />
                        </div>

                        {/* Contact */}
                        <div>
                          <label className="block text-slate-900 text-base font-medium mb-2">Contact</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 bg-white rounded-[10px] border-2 border-sky-200 focus:border-sky-300 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
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
