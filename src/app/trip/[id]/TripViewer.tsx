// app/trip/[id]/TripViewer.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import "maplibre-gl/dist/maplibre-gl.css"

import type { TripData } from "./trip.types"
import { formatDate, addDays } from "./utils"

import TripHeader from "./components/TripHeader"
import TripSidebarDetails from "./components/TripSidebarDetails"
import DaySection from "./components/DaySection"
import PeoplePanel from "./components/PeoplePanel"
import MapModal from "./components/MapModal"

export default function TripViewer({ trip }: { trip: TripData }) {
  const [openMap, setOpenMap] = useState(false)
  const startDate = useMemo(() => new Date(trip.startDate), [trip.startDate])

  useEffect(() => {
    document.body.style.overflow = openMap ? "hidden" : "auto"
  }, [openMap])

  const mapEvents = useMemo(() => {
    return trip.days.flatMap((day) => {
      const d = addDays(startDate, day.dateOffset)
      const dateStr = formatDate(d)
      return day.events
        .map((e) =>
          e.place?.lat && e.place?.lng
            ? { lat: e.place.lat, lng: e.place.lng, title: e.title, time: e.time, date: dateStr }
            : null,
        )
        .filter(Boolean) as Array<{ lat: number; lng: number; title: string; time: string; date: string }>
    })
  }, [trip.days, startDate])

  return (
    <section className="relative w-full p-4 bg-white rounded-[10px] flex flex-col gap-3">
      <TripHeader trip={trip} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-[14rem_1fr_14rem] gap-2.5">
        <TripSidebarDetails trip={trip} onOpenMap={() => setOpenMap(true)} />
        <main className="flex flex-col gap-3">
          {trip.days.map((day, idx) => (
            <DaySection
              key={idx}
              day={day}
              dateLabel={formatDate(addDays(startDate, day.dateOffset))}
            />
          ))}
        </main>
        <PeoplePanel people={trip.people} />
      </div>

      <AnimatePresence>
        {openMap && <MapModal events={mapEvents} onClose={() => setOpenMap(false)} />}
      </AnimatePresence>
    </section>
  )
}
