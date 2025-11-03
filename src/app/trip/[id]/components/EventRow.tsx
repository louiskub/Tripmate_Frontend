"use client"

import { memo } from "react"
import type { EventItem } from "../trip.types"
import { ICONS } from "../icons"

function EventRow({ event }: { event: EventItem }) {
  const ChipIcon = event.place?.iconKey ? ICONS[event.place.iconKey] : undefined
  return (
    <div className="w-full pl-2 pr-2 py-1 bg-white border-b border-neutral-200 flex items-start gap-2">
      <div className="w-16 text-black text-base font-medium">{event.time}</div>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="text-black text-base font-medium">{event.title}</div>
        {event.desc && <div className="text-gray-600 text-sm">{event.desc}</div>}
      </div>
      {event.place && (
        <span className="px-1.5 py-0.5 rounded-lg outline outline-1 outline-blue-200 flex items-center gap-1 text-sm">
          {ChipIcon ? <ChipIcon className="w-3.5 h-3.5" /> : null}
          {event.place.label}
        </span>
      )}
    </div>
  )
}

export default memo(EventRow)
