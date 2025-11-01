"use client"

export default function PersonRow({ name, role, you = false }: { name: string; role: string; you?: boolean }) {
  return (
    <div className="w-full inline-flex items-center gap-2">
      <img className="w-7 h-7 rounded-full object-cover" src="/images/avatar.png" alt={name} />
      <div className="flex-1 flex flex-col">
        <div className="w-full inline-flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-black text-sm font-medium font-[Manrope] truncate">{name}</span>
          </div>
          <span className="text-gray-600 text-xs font-normal font-[Manrope] shrink-0">
            {you ? "(You)" : ""}
          </span>
        </div>
        <span className="text-gray-600 text-xs font-normal font-[Manrope]">{role}</span>
      </div>
    </div>
  )
}
