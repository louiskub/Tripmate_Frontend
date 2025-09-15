'use client'

import { usePathname } from 'next/navigation'
import { paths } from '@/config/paths.config'

import AdminSideNavbar from './side-nav-variants/admin-side-navbar'
import ServiceSideNavbar from './side-nav-variants/service-side-navbar'

const SideNavbar = () => {
  const isAuthenticated: boolean = true;
  const pathname = usePathname()

  if (pathname.startsWith(paths.admin)) return <AdminSideNavbar />
  else return <ServiceSideNavbar />
}

export default SideNavbar