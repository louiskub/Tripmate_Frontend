// app/trip/[id]/utils.ts
export const formatDate = (date: Date | null): string => {
  if (!date) return "N/A"
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export function addDays(date: Date | null, days: number): Date | null {
  if (!date) return null
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
