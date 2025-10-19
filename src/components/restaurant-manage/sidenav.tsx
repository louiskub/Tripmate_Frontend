"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Utensils, History } from 'lucide-react';

const NavItem = ({ href, icon: Icon, text, active }) => (
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
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span>{text}</span>
  </Link>
);

export default function SideNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/restaurant-manage/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { href: "/restaurant-manage/restaurants/total", icon: Utensils, text: "Restaurants" },
    { href: "/restaurant-manage/history", icon: History, text: "Booking History" },
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
            active={pathname.startsWith(link.href)}
          />
        ))}
      </nav>
    </aside>
  );
}