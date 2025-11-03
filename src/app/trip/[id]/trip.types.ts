// app/trip/[id]/trip.types.ts
export type IconKey = "hotel" | "guide" | "mapPin"

export type EventItem = {
  time: string
  title: string
  desc?: string
  place?: { label: string; lat?: number; lng?: number; iconKey?: IconKey }
}

export type ServiceItem = {
  id: string
  type: "hotel" | "guide" | "car"
  name: string
  details?: string
  price?: string
  quantity?: number
  serviceLabel?: string
  roomId?: string
  packageId?: string
  iconKey?: IconKey
}

export type TripDay = {
  dayLabel: string
  dateOffset: number
  events: EventItem[]
  services: ServiceItem[]
}

export type Person = { name: string; role: string; you?: boolean }

export interface TripData {
  id: string
  title: string
  isPublic: boolean
  startDate: string | Date
  endDate: string | Date
  peopleCount: number
  roomCount: number
  totalBudget: number
  startTime?: string
  endTime?: string
  people: Person[]
  days: TripDay[]
}
