"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

const NavItem = ({ href, text, active }) => (
  <Link 
    href={href}
    className={`
      flex items-center gap-2.5 w-full h-9 px-4 rounded-md
      text-sm font-medium transition-colors text-left
      ${active 
        ? 'bg-blue-100 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    {text}
  </Link>
);

export default function ManageResNav({ onAddNew }) {
  const pathname = usePathname();
  const basepath = "/restaurant-manage/restaurants";

  return (
    <aside className="w-48 flex-shrink-0 bg-white flex flex-col gap-2 p-2 border-r border-neutral-200 h-full">
      <NavItem 
        href={`${basepath}/total`}
        text="Total Restaurants" 
        active={pathname === `${basepath}/total`} 
      />
      <NavItem 
        href={`${basepath}/available`}
        text="Available" 
        active={pathname === `${basepath}/available`} 
      />
       <NavItem 
        href={`${basepath}/unavailable`}
        text="Unavailable" 
        active={pathname === `${basepath}/unavailable`} 
      />
      <NavItem 
        href={`${basepath}/fullbooking`}
        text="Full Booking" 
        active={pathname === `${basepath}/fullbooking`} 
      />

      <div className="mt-auto flex flex-col gap-2">
        <button 
          onClick={onAddNew} 
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50"
        >
          <PlusCircle size={16} />
          <span>Add new Restaurant</span>
        </button>
      </div>
    </aside>
  );
}