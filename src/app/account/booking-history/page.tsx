// booking-history.tsx (Updated with Sort & View)
"use client";
import { RiHotelBedFill } from "react-icons/ri";
import { IoRestaurant } from "react-icons/io5";
import { FaCarSide } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BsSendFill } from "react-icons/bs";
import axios from "axios";
import dayjs from "dayjs";
import {endpoints} from "@/config/endpoints.config"
import DefaultPage from "@/components/layout/default-layout";
import ProfileNavbar from "@/components/navbar/side-nav-variants/profile-side-navbar";

import CreateReviewPopup from "@/components/account/create-review-popup"
import {authJsonHeader} from "@/utils/service/get-header"

// 1. import useState และ useEffect
import React, { useState, useEffect } from "react";


type ReviewPopupData = {
  name: string;
  coverImg: string;
  location: string;
  star: number;
  type: string;
  // + เพิ่ม serviceId และ bookingId เพื่อส่งรีวิวกลับไป
  serviceId: string; 
  bookingId: string;
};


function findRoom(rooms: Array<any>, roomId: string){
    for(let i=0; i<rooms.length; i++){
        if(rooms[i].id === roomId){
            return rooms[i]
        }
    }
    return null
}


async function getHotel(){
    const res = await axios.get(endpoints.user.history.booking("hotel"), authJsonHeader()); // แก้เป็น endpoint จริง
    const rawData = res.data;
    const mapped = rawData.map(async (item: any) => {
        const b = item.booking;
        const nights = dayjs(b.endBookingDate).diff(dayjs(b.startBookingDate), "day");
        const checkIn = dayjs(b.startBookingDate).format("ddd, DD MMM YYYY");
        const checkOut = dayjs(b.endBookingDate).format("ddd, DD MMM YYYY");

        let hotelData = await axios.get(endpoints.hotel.detail(b.serviceId))
        hotelData = hotelData.data
        const rooomData = findRoom(hotelData.rooms, b.subServiceId)
        console.log("roomData", item)
        return {
        id: item.id,
        serviceId: b.serviceId,
        bookingId: item.bookingId,
        type: b.service.type === "hotel"
            ? "Hotel"
            : b.service.type === "carRentalCenter"
            ? "Rental Car"
            : "Guide",
        // title: `${b.serviceId.toUpperCase()} (${b.subServiceId})`,
        title: `${hotelData.name} - ${rooomData.name}`,
        img: rooomData.pictures[0],
        // location: b.groupId,
        checkIn,
        checkOut,
        nights,
        status: b.status,
        amount: item.amount,
        location: hotelData.service.location.name
        };
})
    return mapped
}

async function getRental(){
    const res = await axios.get(endpoints.user.history.booking("car_rental_center"), authJsonHeader()); // แก้เป็น endpoint จริง
    const rawData = res.data;
    const mapped = rawData.map(async (item: any) => {
        const b = item.booking;
        const nights = dayjs(b.endBookingDate).diff(dayjs(b.startBookingDate), "day");
        const checkIn = dayjs(b.startBookingDate).format("ddd, DD MMM YYYY");
        const checkOut = dayjs(b.endBookingDate).format("ddd, DD MMM YYYY");

        let hotelData = await axios.get(endpoints.hotel.detail(b.serviceId))
        hotelData = hotelData.data
        const rooomData = findRoom(hotelData.rooms, b.subServiceId)
        console.log("roomData", hotelData)
        return {
        id: item.id,
        type: b.service.type === "hotel"
            ? "Hotel"
            : b.service.type === "restaurant"
            ? "Restaurant"
            : b.service.type === "carRentalCenter"
            ? "Rental Car"
            : "Guide",
        // title: `${b.serviceId.toUpperCase()} (${b.subServiceId})`,
        title: `${hotelData.name} - ${rooomData.name}`,
        img: rooomData.pictures[0],
        location: b.groupId,
        checkIn,
        checkOut,
        nights,
        status: b.status,
        amount: item.amount,
        };
})
    return mapped
}

async function getGuide(){
    const res = await axios.get(endpoints.user.history.booking("guide"), authJsonHeader()); // แก้เป็น endpoint จริง
    const rawData = res.data;
    const mapped = rawData.map(async (item: any) => {
        const b = item.booking;
        const nights = dayjs(b.endBookingDate).diff(dayjs(b.startBookingDate), "day");
        const checkIn = dayjs(b.startBookingDate).format("ddd, DD MMM YYYY");
        const checkOut = dayjs(b.endBookingDate).format("ddd, DD MMM YYYY");

        let hotelData = await axios.get(endpoints.hotel.detail(b.serviceId))
        hotelData = hotelData.data
        const rooomData = findRoom(hotelData.rooms, b.subServiceId)
        console.log("roomData", hotelData)
        return {
        id: item.id,
        type: b.service.type === "hotel"
            ? "Hotel"
            : b.service.type === "restaurant"
            ? "Restaurant"
            : b.service.type === "carRentalCenter"
            ? "Rental Car"
            : "Guide",
        // title: `${b.serviceId.toUpperCase()} (${b.subServiceId})`,
        title: `${hotelData.name} - ${rooomData.name}`,
        img: rooomData.pictures[0],
        location: b.groupId,
        checkIn,
        checkOut,
        nights,
        status: b.status,
        amount: item.amount,
        };
})
    return mapped
}



const filters = ["Hotel", "Rental Car", "Guide"];

export default function BookingHistory() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [displayBookings, setDisplayBookings] = useState<any[]>([]);

  const [activeFilter, setActiveFilter] = useState("Hotel");
  const [sortOption, setSortOption] = useState("date"); // 'date' (ใหม่สุด) เป็นค่าเริ่มต้น
  const [viewOption, setViewOption] = useState("List");
  
  const [isEditing, setIsEditing] = useState(false);

  const [initialData, setInitialData] = useState<ReviewPopupData>();

// fetch api
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const hotelJa = await getHotel();

        setBookings(await Promise.all(hotelJa));
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);


  // 4. ใช้ useEffect เพื่อคำนวณ list ใหม่ เมื่อ filter หรือ sort เปลี่ยน
  useEffect(() => {
    // 4a. กรองข้อมูล (Filter)
    const filtered = bookings.filter((b) => b.type === activeFilter);

    // 4b. เรียงลำดับ (Sort)
    const sorted = [...filtered]; // Copy array ก่อน sort
    
    if (sortOption === "date") {
      // เรียงจากใหม่ไปเก่า (เช็คอินล่าสุดก่อน)
      sorted.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
    } else if (sortOption === "nights") {
      // เรียงจากจำนวนคืนมากไปน้อย
      sorted.sort((a, b) => b.nights - a.nights);
    }
    
    // 4c. อัปเดต state ที่จะแสดงผล
    setDisplayBookings(sorted);

  }, [bookings, activeFilter, sortOption]); // dependencies: ทำงานใหม่เมื่อค่าเหล่านี้เปลี่ยน

  return (
    <DefaultPage>
      <div className="bg-custom-white -m-1 p-2 pt-5 rounded-lg">
        <div className="flex gap-5">
          <ProfileNavbar />
          <div className="flex-1 flex flex-col gap-4 ">
                <div className="flex-1 p-7">
      <div className="flex bg-white rounded-lg p-2 shadow-sm gap-4">
        <section className="flex-1 p-5 flex flex-col gap-4">
          <h1 className="text-2xl font-extrabold">Booking History</h1>

          <div className="bg-white rounded-md shadow px-3 py-2 inline-flex gap-3 items-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-md font-medium hover:bg-blue-50 ${
                  activeFilter === filter
                    ? "bg-sky-100 text-sky-800"
                    : "text-gray-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {/* 5. ใช้ .length จาก state ใหม่ */}
            <div className="text-base font-medium">
              {displayBookings.length} bookings
            </div>
            {/* 6. เปลี่ยน placeholder เป็น <select> dropdowns จริง */}
            <div className="flex gap-4">
              <select
                value={sortOption}
                className="text-custom-black d-select pr-5 pl-2 w-[15rem]" // ใช้ class จาก review-history
                onChange={(e) => setSortOption(e.target.value)}
              >
                {/* <option value="" disabled>Sort by option</option> */}
                <option value="date">Sort by date (Newest)</option>
                <option value="nights">Sort by nights (Most)</option>
              </select>
            </div>
          </div>

          {/* 7. เพิ่ม logic การสลับ view (List/Grid) */}
          <div
            className={`gap-4 overflow-auto max-h-[60vh] pr-2 ${
              viewOption === "Grid"
                ? "grid grid-cols-1 lg:grid-cols-2" // Grid view (ปรับ col ตามต้องการ)
                : "flex flex-col" // List view
            }`}
          >
            {/* 8. map จาก state ใหม่ */}
            {displayBookings.map((b) => (
              <article
                key={b.id}
                className="bg-white rounded-lg p-4 outline outline-1 outline-offset-[-1px] outline-sky-100 flex flex-col gap-3"
              >
                {/* ... (เนื้อหาของการ์ด booking เหมือนเดิม) ... */}
                <div className="flex justify-end">
                  <span className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full">
                    {b.status}
                  </span>
                </div>

                <div className="flex gap-4">
                  <img className="w-44 h-44 bg-gradient-to-b from-black/0 to-black/30 rounded-lg" src={b.img}/>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {b.title}
                      </h3>
                      {/* ... (รายละเอียดอื่นๆ) ... */}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {/* <div className="w-2.5 h-3 bg-black" /> */}
                          {/* <span className="text-xs text-gray-600">
                            location
                          </span> */}
                        </div>

                        <div className="ml-4 px-3 py-2 bg-sky-50 rounded-lg inline-flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              Check-in
                            </span>
                            <span className="text-sm text-gray-900">
                              {b.checkIn}
                            </span>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {b.nights} night{b.nights > 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              Check-out
                            </span>
                            <span className="text-sm text-gray-900">
                              {b.checkOut}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button 
                        onClick={() => {setInitialData({
                            name: b.title,
                            coverImg: b.img,
                            bookingId: b.bookingId,
                            serviceId: b.serviceId,
                            location: b.location,
                            star: 5,
                            type: b.type,
                        });setIsEditing(true); console.log("click", {
                            name: b.title,
                            coverImg: b.img,
                            bookingId: b.bookingId,
                            serviceId: b.serviceId,
                            location: b.location,
                            star: 5,
                            type: b.type,
                        })}}
                        className="flex-1 h-10 rounded-2xl border border-sky-600 text-sky-700 font-bold">
                        Review
                      </button>
                      <button className="flex-1 h-10 rounded-2xl bg-sky-200 text-sky-800 font-bold">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <CreateReviewPopup
                isOpen={isEditing}
                initialData={initialData}
                onClose={() => setIsEditing(false)} 
            /> 
    </div>
          </div>
        </div>
    </div>
    </DefaultPage>
  );
}

const logos = [
  { name: "Hotels", icon: <RiHotelBedFill /> },
  { name: "Restaurants", icon: <IoRestaurant /> },
  { name: "Rental Cars", icon: <FaCarSide /> },
  { name: "Guides", icon: <BsSendFill /> },
  { name: "Tourist Attractions", icon: <FaMapMarkerAlt /> },
  { name: "Map", icon: <FaMapMarkedAlt /> },
];

// const defaultBookings = [
//   {
//     id: 1,
//     type: "Hotel",
//     title: "Centara Grand Mirage Beach Resort Pattaya",
//     location: "Pattaya",
//     checkIn: "Sat, 25 Aug 2025",
//     checkOut: "Sun, 26 Aug 2025",
//     nights: 1,
//     status: "Status",
//   },
//   {
//     id: 2,
//     type: "Hotel",
//     title: "Hilton Pattaya",
//     location: "Pattaya",
//     checkIn: "Wed, 20 Aug 2025", // วันที่เก่ากว่า
//     checkOut: "Thu, 21 Aug 2025",
//     nights: 3, // คืนเยอะกว่า
//     status: "Status",
//   },
//   {
//     id: 3,
//     type: "Restaurant",
//     title: "Seafood Delight",
//     location: "Pattaya",
//     checkIn: "Sat, 27 Aug 2025", // ใช้วันที่จองเป็น checkIn
//     checkOut: "N/A",
//     nights: 0,
//     status: "Completed",
//   },
// ];


const initialData = {
    name: "Kimpton Paris Hotel",
    coverImg: "https://static51.com-hotel.com/uploads/hotel/84844/photo/vibe-hotel-gold-coast_17307266811.jpg",
    location: "Paris, France",
    star: 3,
    type: "attraction",
}