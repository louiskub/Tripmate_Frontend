// app/trip/[id]/page.tsx
import TripViewer from "./TripViewer"
import type { TripData } from "./trip.types"
import DefaultLayout from "@/components/layout/default-layout";


// --- ตัวอย่างดึงจริง ---
// async function fetchTrip(id: string): Promise<TripData> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trip/${id}`, { cache: "no-store" })
//   if (!res.ok) throw new Error("Failed to fetch trip")
//   const data = (await res.json()) as TripData
//   return data
// }

// --- Mock (JSON-safe) ---
async function getTripData(id: string): Promise<TripData> {
  return {
    id,
    title: "Trip to Pattaya",
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
            place: { label: "Grand Palace Hotel", lat: 13.75, lng: 100.491, iconKey: "mapPin" },
          },
          { time: "12.00", title: "ทานอาหารกลางวัน" },
          {
            time: "14.00",
            title: "ชมปราสาทสัจธรรม",
            desc: "ดูสถาปัตยกรรมไม้",
            place: { label: "Sanctuary of Truth", lat: 12.973, lng: 100.889, iconKey: "mapPin" },
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
            serviceLabel: "Hotel",
            iconKey: "hotel",
          },
        ],
      },
      {
        dayLabel: "Day 2",
        dateOffset: 1,
        events: [
          { time: "10.00", title: "ทัวร์เกาะล้าน (กับไกด์)", desc: "ทัวร์ครึ่งวัน" },
          { time: "16.30", title: "กลับที่พัก" },
        ],
        services: [
          {
            id: "g1-1",
            type: "guide",
            name: "John Smith",
            details: "ทัวร์เกาะล้าน (ครึ่งวัน) - ฿5,000/ทริป (สูงสุด 4 คน)",
            price: "",
            packageId: "g1t1",
            serviceLabel: "Guide",
            iconKey: "guide",
          },
        ],
      },
    ],
  }
}

export default async function TripViewPage({ params }: { params: { id: string } }) {
  const trip = await getTripData(params.id)
  return (
    <DefaultLayout>
      <TripViewer trip={trip} />
    </DefaultLayout>
  )
}
