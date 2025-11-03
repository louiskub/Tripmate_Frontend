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
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/b3/6f/2b.jpg",
      "https://www.bharatbooking.com/admin/webroot/img/uploads/holiday-package/1692431062_85552-thj.jpg",
      "https://image.kkday.com/v2/image/get/w_960,c_fit,q_55,wm_auto/s1.kkday.com/product_154613/20231026163738_TsOOR/jpg",
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
      "https://www.swedishnomad.com/wp-content/images/2016/05/Bangkok-reseguide.jpg",
      "https://cms-visit.bangkok.go.th/uploads/Frame_352_51a708d408_52c6ee4aa8.jpeg",
      "https://static.independent.co.uk/2025/01/03/14/newFile-12.jpg",
    ],
    favorite: true,
    rating: 9.2,
  } as any,
]
