"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, History } from 'lucide-react';

// --- Component ย่อยสำหรับแต่ละรายการในเมนู ---
// ทำให้โค้ดสะอาดและจัดการง่ายขึ้น
// --- แก้ไข Component NavItem ---
const NavItem = ({ href, icon: Icon, text, active }) => (
  // 2. ย้าย className มาไว้ที่ Link
  <Link 
    href={href}
    className={`
      flex items-center gap-2.5 self-stretch h-10 px-5 
      transition-colors duration-200
      ${active 
        ? 'bg-sky-100 text-sky-800 font-semibold border-r-4 border-sky-500' 
        : 'text-gray-700 hover:bg-gray-100'
      }
    `}
  >
    {/* 1. ลบ Tag <a> ออก */}
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span>{text}</span>
  </Link>
);

// --- Component หลักของ SideNav ---
export default function SideNav() {
  const pathname = usePathname(); // Hook สำหรับเช็ค path ปัจจุบัน

  const navLinks = [
    { href: "/car-manage/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { href: "/car-manage/rental-cars/total", icon: Car, text: "Rental Cars" },
    { href: "/car-manage/booking-history", icon: History, text: "Booking History" },
  ];

  return (
    <aside className="w-56 h-screen bg-white border-r border-neutral-200 flex flex-col pt-4">
      <nav className="flex flex-col">
        {navLinks.map((link) => (
          <NavItem 
            key={link.href}
            href={link.href}
            icon={link.icon}
            text={link.text}
            active={pathname === link.href} // เช็คว่า link นี้ active หรือไม่
          />
        ))}
      </nav>
    </aside>
  );
}