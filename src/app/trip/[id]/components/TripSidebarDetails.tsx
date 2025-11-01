"use client"
import { Calendar, Clock, DollarSign, MapPin, Users, Bed } from "lucide-react"
import type { TripData } from "../trip.types"
import { formatDate } from "../utils"

export default function TripSidebarDetails({
  trip,
  onOpenMap,
}: { trip: TripData; onOpenMap: () => void }) {
  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)

  return (
    <aside className="w-full px-2 py-2.5 border-r lg:border-r border-neutral-200 flex flex-col items-center gap-2.5">
      <div className="w-full text-center px-2 py-2">
        <h3 className="text-lg font-bold text-black">Trip Details</h3>
      </div>

      <div className="w-full px-2.5 pt-2.5 bg-white rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-2">
        <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
          <div className="text-black text-sm font-medium font-[Manrope]">From :</div>
          <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium font-[Manrope]">{formatDate(startDate)}</span>
            <Calendar className="w-4 h-4 text-black" />
          </div>
          <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium font-[Manrope]">{trip.startTime}</span>
            <Clock className="w-4 h-4 text-black" />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="h-4 w-px bg-neutral-300" />
        </div>

        <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
          <div className="text-black text-sm font-medium font-[Manrope]">To :</div>
          <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium font-[Manrope]">{formatDate(endDate)}</span>
            <Calendar className="w-4 h-4 text-black" />
          </div>
          <div className="h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium font-[Manrope]">{trip.endTime}</span>
            <Clock className="w-4 h-4 text-black" />
          </div>
        </div>

        <div className="w-full py-2.5 border-t border-neutral-200 grid grid-cols-2 gap-1">
          <div className="flex items-center gap-1 px-1">
            <Users className="w-4 h-4 text-black" />
            <span className="text-gray-600 text-sm font-medium font-[Manrope]">
              {trip.peopleCount} {trip.peopleCount > 1 ? "People" : "Person"}
            </span>
          </div>
          <div className="flex items-center gap-1 px-1">
            <Bed className="w-4 h-4 text-black" />
            <span className="text-gray-600 text-sm font-medium font-[Manrope]">
              {trip.roomCount} {trip.roomCount > 1 ? "Rooms" : "Room"}
            </span>
          </div>
        </div>

        <div className="w-full px-1 py-2.5 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-black" />
            <span className="text-black text-sm font-medium font-[Manrope]">Total Budget</span>
          </div>
          <span className="text-blue-500 text-lg font-medium font-[Manrope]">
            ฿{trip.totalBudget.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="w-full h-44 rounded-xl flex flex-col gap-1.5">
        <div className="relative h-32 w-full rounded-xl shadow-sm overflow-hidden">
          <img className="w-full h-full object-cover" src="/images/bangkok.png" alt="map preview" />
          <button
            onClick={onOpenMap}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 h-6 min-w-24 px-4 py-1 bg-white rounded-xl shadow inline-flex items-center gap-1"
          >
            <span className="text-custom-black text-sm font-semibold font-[Manrope] w-fit whitespace-nowrap">View on map</span>
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
