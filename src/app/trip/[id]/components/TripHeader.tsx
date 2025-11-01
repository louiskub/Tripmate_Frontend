"use client"
import { ArrowLeft, Users, Copy, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { TripData } from "../trip.types"

export default function TripHeader({ trip }: { trip: TripData }) {
  const router = useRouter()
  const [copying, setCopying] = useState(false)

  const log = (...args: any[]) => console.log("[TripHeader]", ...args)

  const safePreview = (obj: unknown) => {
    try {
      return JSON.parse(JSON.stringify(obj, (_k, v) => (typeof v === "function" ? "[Function]" : v)))
    } catch {
      return obj
    }
  }

  const handleCopyFromTrip = async () => {
    if (copying) return
    setCopying(true)
    log("Copy clicked for tripId =", trip.id)

    try {
      const url = `/api/trip/${trip.id}`
      log("Fetching latest trip from:", url)

      const res = await fetch(url, { cache: "no-store" })
      log("Fetch status:", res.status, res.statusText)

      const latestTrip: TripData = res.ok ? await res.json() : trip
      if (res.ok) log("API result (preview):", safePreview(latestTrip))
      else log("API not ok, fallback to props.trip (preview):", safePreview(trip))

      const { id: _omitId, ...prefill } = latestTrip as any
      const payload = { sourceTripId: trip.id, ...prefill }

      log("Prepared payload to sessionStorage (preview):", safePreview(payload))
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trip_prefill", JSON.stringify(payload))
      } else {
        log("window undefined: skip sessionStorage")
      }

      const target = "/trip/create?prefill=1"
      log("Navigating to:", target)
      router.push(target)
    } catch (error) {
      log("Copy failed, using props.trip fallback. Error:", error)
      const { id: _omitId, ...prefill } = trip as any
      const fallback = { sourceTripId: trip.id, ...prefill }
      log("Fallback payload (preview):", safePreview(fallback))
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trip_prefill", JSON.stringify(fallback))
      }
      const target = "/trip/create?prefill=1"
      log("Navigating to:", target)
      router.push(target)
    } finally {
      setCopying(false)
      log("Copy flow finished.")
    }
  }

  const handleGoTrips = () => {
    log("Back clicked -> go to /trip")
    router.push("/trip") // หรือใช้ router.replace("/trip") ถ้าไม่อยากให้กดย้อนกลับมาหน้านี้ได้
  }

  return (
    <header className="w-full pt-1 pb-3 border-b border-neutral-200 inline-flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-black text-2xl font-extrabold font-[Manrope] truncate px-2 -ml-2">
          {trip.title}
        </h1>
        <span className="text-gray-600 text-lg font-semibold font-[Manrope] shrink-0">#{trip.id}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleCopyFromTrip}
          disabled={copying}
          className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-custom-black inline-flex items-center gap-1 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {copying ? (
            <Loader2 className="w-4 h-4 animate-spin text-custom-black" />
          ) : (
            <Copy className="w-4 h-4 text-custom-black" />
          )}
          <span className="text-custom-black text-sm font-semibold font-[Manrope] whitespace-nowrap">
            {copying ? "Copying…" : "Copy trips"}
          </span>
        </button>

        <div className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-blue-200 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1">
            <Users className="w-4 h-4 text-black" />
            <span className="text-black text-sm font-semibold font-[Manrope]">
              {trip.isPublic ? "Public" : "Private"}
            </span>
          </span>
        </div>

        <button
          onClick={handleGoTrips}
          className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-blue-800 inline-flex items-center gap-1 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 text-blue-800" />
          <span className="text-blue-800 text-sm font-semibold font-[Manrope]">Back</span>
        </button>
      </div>
    </header>
  )
}
