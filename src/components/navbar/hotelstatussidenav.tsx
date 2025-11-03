"use client"

import { PlusCircle } from "lucide-react"
import Link from "next/link"

type NavItemProps = {
  text: string
  active: boolean
  onClick: () => void
}

const NavItem = ({ text, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2.5 w-full h-9 px-4 rounded-md
      text-sm font-medium transition-colors
      ${active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}
    `}
  >
    {text}
  </button>
)

type ManageHotelNavProps = {
  onAddNew: () => void
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function ManageHotelNav({ onAddNew, activeFilter, onFilterChange }: ManageHotelNavProps) {
  return (
    <aside className="w-48 flex-shrink-0 bg-white flex flex-col gap-2 p-2 border-r border-neutral-200 h-full">
      <NavItem text="Total Hotels" active={activeFilter === "total"} onClick={() => onFilterChange("total")} />
      <NavItem
        text="Available Hotels"
        active={activeFilter === "available"}
        onClick={() => onFilterChange("available")}
      />
      <NavItem text="Unavailable Hotels" active={activeFilter === "unavailable"} onClick={() => onFilterChange("unavailable")} />
      <NavItem text="Full Booking" active={activeFilter === "full"} onClick={() => onFilterChange("full")} />

      <div className="mt--200 flex flex-col gap-2">
        <Link href={`/hotelmanagement/createhotel`}
          onClick={onAddNew}
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50"
        >
          <PlusCircle size={16} />
          <span>Add new Hotel</span>
        </Link>
      </div>
    </aside>
  )
}