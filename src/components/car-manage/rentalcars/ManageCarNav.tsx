"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, CheckCircle, Wrench, PlusCircle, MinusCircle, ShieldCheck } from 'lucide-react';

const NavItem = ({ href, text, active }) => (
  <Link 
    href={href}
    className={`
      flex items-center gap-2.5 w-full h-9 px-4 rounded-md
      text-sm font-medium transition-colors
      ${active 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    {text}
  </Link>
);

export default function ManageCarNav({ onAddNew }) {
  const pathname = usePathname();

  return (
    <aside className="w-48 flex-shrink-0 bg-white flex flex-col gap-2 p-2 border-r border-neutral-200 h-full">
      {/* --- ✅ [แก้ไข] เงื่อนไข active ให้ตรงกับ href --- */}
      <NavItem 
        href="/car-manage/rental-cars/total" 
        text="Total Cars" 
        active={pathname === '/car-manage/rental-cars/total'} 
      />
      <NavItem 
        href="/car-manage/rental-cars/available" 
        text="Available Cars" 
        active={pathname === '/car-manage/rental-cars/available'} 
      />
       <NavItem 
        href="/car-manage/rental-cars/rented" 
        text="Rented Rentals" 
        active={pathname === '/car-manage/rental-cars/rented'} 
      />
      <NavItem 
        href="/car-manage/rental-cars/repair" 
        text="Under Repair" 
        active={pathname === '/car-manage/rental-cars/repair'} 
      />

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
  );
}