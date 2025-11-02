"use client"

import { useRouter } from "next/navigation"
import { CalendarDays, Users } from "lucide-react"

import { Subtitle, Caption, ButtonText, SubBody } from "@/components/text-styles/textStyles"
import ImageSlide from "@/components/services/other/image-slide"
import FavoriteButton from "@/components/services/other/favorite-button"
import { Tag } from "@/components/services/other/Tag"
import { endpoints } from "@/config/endpoints.config"
import { paths } from "@/config/paths.config"
import { ratingText } from "@/utils/service/rating"

export interface TripCardProps {
  trip_id: string
  title: string
  startDate: string  // ISO
  endDate: string    // ISO
  peopleCount: number
  totalBudget: number
  pictures: string[]
  favorite?: boolean
  /** ✅ คะแนนเต็ม 10 (ถ้าหลังบ้านเป็น 0–5 ให้ *2 ก่อนส่งมา) */
  rating?: number
}

function toDateRange(startISO: string, endISO: string) {
  const s = new Date(startISO)
  const e = new Date(endISO)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  return `${fmt(s)} - ${fmt(e)}`
}

const TripCard = (trip: TripCardProps) => {
  const router = useRouter()
  const href = endpoints?.trip?.detail ? endpoints.trip.detail(trip.trip_id) : `/trip/${trip.trip_id}`

  return (
    <div
      className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180px_1fr] gap-2.5 hover:bg-dark-white hover:cursor-pointer"
      onClick={() => router.push(href)}
    >
      <ImageSlide pictures={trip.pictures}>
        <FavoriteButton favorite={trip.favorite} id={trip.trip_id} type="trip" />
      </ImageSlide>

      <div className="w-full flex overflow-hidden">
        <div className="flex flex-col flex-1 gap-2">
          <Subtitle className="max-w-full line-clamp-2 leading-6">{trip.title}</Subtitle>

          <div className="text-dark-blue flex gap-1">
          </div>

          {/* ✅ คะแนนเต็ม 10 แบบเดียวกับ rental-car-card */}
          {(typeof trip.rating === "number") && (
            <div className="inline-flex items-center gap-[3px] mt-2">
              <Tag text={trip.rating.toFixed(1)} />
              <Caption className="text-dark-blue">{ratingText(trip.rating)}</Caption>
            </div>
          )}

          <div className="inline-flex items-center gap-2 mt-2 text-black">
            <CalendarDays width={14} />
            <Caption>{toDateRange(trip.startDate, trip.endDate)}</Caption>
          </div>

          <div className="inline-flex items-center gap-2 text-black">
            <Users width={14} />
            <Caption>
              {trip.peopleCount} {trip.peopleCount > 1 ? "people" : "person"}
            </Caption>
          </div>
        </div>

        <div className="self-stretch h-full inline-flex flex-col justify-end items-end gap-2">
          <span className="flex items-baseline gap-1">
            <Caption className="text-dark-gray">Budget</Caption>
            <SubBody className="text-dark-blue">฿</SubBody>
            <ButtonText className="text-dark-blue">
              {trip.totalBudget.toLocaleString("en-US")}
            </ButtonText>
          </span>

          <a
            href={href}
            onClick={(e) => {
              e.preventDefault()
              router.push(href)
            }}
            className="bg-dark-blue rounded-lg text-custom-white h-8 px-3 inline-flex items-center justify-center text-sm font-semibold"
          >
            view trip
          </a>
        </div>
      </div>
    </div>
  )
}

export default TripCard
