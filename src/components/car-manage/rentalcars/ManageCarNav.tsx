"use client"

import { PlusCircle } from "lucide-react"

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

type ManageCarNavProps = {
  onAddNew: () => void
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function ManageCarNav({ onAddNew, activeFilter, onFilterChange }: ManageCarNavProps) {
  return (
    <aside className="w-48 flex-shrink-0 bg-white flex flex-col gap-2 p-2 border-r border-neutral-200 h-full">
      <NavItem text="Total Cars" active={activeFilter === "total"} onClick={() => onFilterChange("total")} />
      <NavItem
        text="Available Cars"
        active={activeFilter === "available"}
        onClick={() => onFilterChange("available")}
      />
      <NavItem text="Rented Rentals" active={activeFilter === "rented"} onClick={() => onFilterChange("rented")} />
      <NavItem text="Under Repair" active={activeFilter === "repair"} onClick={() => onFilterChange("repair")} />

      {/* Action buttons at the bottom */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50"
        >
          <PlusCircle size={16} />
          <span>Add new Car</span>
        </button>
      </div>
    </aside>
  )
}
