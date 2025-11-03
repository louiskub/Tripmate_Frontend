// /mocks/trips.ts
import type { TripCardProps } from "@/components/services/service-card/trip-card"

// ใช้ข้อมูลอ้างอิง Trip ที่เราเคย mock (Pattaya)
export const trips: TripCardProps[] = [
  {
    trip_id: "t_pattaya_view",
    id: "t_pattaya_view", 
    title: "Trip to Pattaya",
    startDate: "2025-10-26T00:00:00.000Z",
    endDate:   "2025-10-28T00:00:00.000Z",
    peopleCount: 2,
    totalBudget: 8500,
    pictures: [
      "/images/team.jpg",
      "/images/team.jpg",
      "/images/team.jpg",
    ],
    favorite: false,
    rating: 8.6,
  } as any,
  {
    trip_id: "t_bkk_weekend",
    id: "t_bkk_weekend",
    title: "Bangkok Weekend Getaway",
    startDate: "2025-11-15T00:00:00.000Z",
    endDate:   "2025-11-16T00:00:00.000Z",
    peopleCount: 3,
    totalBudget: 4200,
    pictures: [
      "/images/team.jpg",
      "/images/team.jpg",
      "/images/team.jpg",
    ],
    favorite: true,
    rating: 9.2,
  } as any,
]
