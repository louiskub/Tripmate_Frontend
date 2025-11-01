"use client"
import type { Person } from "../trip.types"
import PersonRow from "./PersonRow"
import { Users } from "lucide-react"

export default function PeoplePanel({ people }: { people: Person[] }) {
  return (
    <aside className="w-full p-2.5 border-l lg:border-l border-neutral-200 flex flex-col gap-3">
      <div className="w-full pb-1.5 border-b border-neutral-200 inline-flex items-center gap-2.5">
        <h3 className="flex-1 text-black text-base font-bold font-[Manrope]">
          People in trip ({people.length})
        </h3>
        <Users className="w-5 h-5 text-black" />
      </div>
      {people.map((p, i) => (
        <PersonRow key={`${p.name}-${i}`} name={p.name} role={p.role} you={p.you} />
      ))}
    </aside>
  )
}
