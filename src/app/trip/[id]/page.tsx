// ในไฟล์ app/trip/[id]/page.tsx

import TripViewer, { TripData } from "./trip"; // ปรับ Path ให้ถูกต้อง
// import { Hotel, MapPin, UserCircle } from "lucide-react"; // ต้อง Import ไอคอนที่ใช้ใน Data

// --- ฟังก์ชันจำลองการดึงข้อมูล ---
async function getTripData(id: string): Promise<TripData> {
  // ในโลกจริง:
  // const response = await fetch(`https://api.yoursite.com/trip/${id}`);
  // const data = await response.json();
  // return data;

  // --- ข้อมูล Mockup สำหรับการทดสอบ ---
  const mockTrip: TripData = {
    id: id,
    title: "Trip to Pattaya (View Mode)",
    isPublic: true,
    startDate: "2025-10-26T00:00:00.000Z",
    endDate: "2025-10-28T00:00:00.000Z",
    peopleCount: 2,
    roomCount: 1,
    totalBudget: 8500,
    startTime: "09.00",
    endTime: "16.30",
    people: [
      { name: "Your Name", role: "Head", you: true },
      { name: "Friend Name", role: "Member" },
    ],
    days: [
      {
        dayLabel: "Day 1",
        dateOffset: 0,
        events: [
          {
            time: "09.00",
            title: "เดินทางถึงที่พัก",
            chip: {label: "Grand Palace Hotel", lat: 13.75, lng: 100.491 }
          },
          { time: "12.00", title: "ทานอาหารกลางวัน" },
          { 
            time: "14.00", 
            title: "ชมปราสาทสัจธรรม", 
            desc: "ดูสถาปัตยกรรมไม้", 
            chip: {label: "Sanctuary of Truth", lat: 12.973, lng: 100.889 }
          },
        ],
        services: [
          {
            id: "h1-1",
            type: "hotel",
            name: "Grand Palace Hotel",
            details: "Deluxe Room - ฿3,500/night (2 guests)",
            price: "",
            quantity: 1,
            icon: Hotel,
            chipLabel: "Hotel",
          },
        ],
      },
      {
        dayLabel: "Day 2",
        dateOffset: 1,
        events: [
          { 
            time: "10.00", 
            title: "ทัวร์เกาะล้าน (กับไกด์)", 
            desc: "ทัวร์ครึ่งวัน", 
            // chip: { icon: MapPin, label: "Koh Larn", lat: 12.915, lng: 100.78 }
          },
          { time: "16.30", title: "กลับที่พัก" },
        ],
        services: [
          {
            id: "g1-1",
            type: "guide",
            name: "John Smith",
            details: "Tour: ทัวร์เกาะล้าน (ครึ่งวัน) - ฿5,000/ทริป (สูงสุด 4 คน)",
            price: "",
            packageId: "g1t1",
            icon: UserCircle,
            chipLabel: "Guide",
          },
        ],
      },
    ],
  };
  return mockTrip;
}


// --- นี่คือ Page Component ---
export default async function TripViewPage({ params }: { params: { id: string } }) {
  
  // 1. ดึงข้อมูล
  const trip = await getTripData(params.id);

  // 2. ส่งข้อมูลเข้า Viewer
  return (
    <div className="p-4"> {/* Container หลักของหน้า */}
      <TripViewer trip={trip} />
    </div>
  );
}