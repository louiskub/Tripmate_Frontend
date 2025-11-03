"use client"
import { MapPin, UserCircle, Hotel as HotelIcon } from "lucide-react"
import type { IconKey } from "./trip.types"

export const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  hotel: HotelIcon,
  guide: UserCircle,
  mapPin: MapPin,
}
