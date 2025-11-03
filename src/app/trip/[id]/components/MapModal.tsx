"use client"
import { X } from "lucide-react"
import TripRouteDisplay from "../../create/trip-route" // ต้องมี component นี้อยู่แล้ว
// events: { lat, lng, title, time, date }[]
export default function MapModal({
  events,
  onClose,
}: {
  events: { lat: number; lng: number; title: string; time: string; date: string }[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-white">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-[61] inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white shadow"
      >
        <X className="w-4 h-4" />
        Close
      </button>
      <TripRouteDisplay onClose={onClose} events={events} />
    </div>
  )
}
