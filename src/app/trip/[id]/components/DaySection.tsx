"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import type { TripDay } from "../trip.types"
import EventRow from "./EventRow"      // ✅ default import
import ServiceRow from "./ServiceRow"  // ✅ default import

export default function DaySection({ day, dateLabel }: { day: TripDay; dateLabel: string }) {
  return (
    <motion.section
      className="w-full rounded-[10px] shadow-sm outline outline-1 outline-blue-200 p-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between bg-blue-50 rounded-md p-2">
        <span className="font-semibold text-black">{day.dayLabel}</span>
        <span className="text-gray-600 text-sm flex items-center gap-1">
          {dateLabel} <Calendar className="w-4 h-4" />
        </span>
      </div>

      {day.events.length === 0 ? (
        <div className="text-gray-600 text-sm py-2">No events for this day</div>
      ) : (
        day.events.map((e, j) => <EventRow key={j} event={e} />)
      )}

      {day.services.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-300">
          <div className="text-sm font-semibold text-black mb-2 px-2">Services</div>
          <div className="space-y-2">
            {day.services.map((s) => <ServiceRow key={s.id} service={s} />)}
          </div>
        </div>
      )}
    </motion.section>
  )
}
