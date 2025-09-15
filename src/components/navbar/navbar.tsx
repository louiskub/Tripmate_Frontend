'use client'

import { usePathname } from 'next/navigation'
import { paths } from '@/config/paths.config'

import AuthNavbar from './variants/auth-navbar'
import AdminNavbar from './variants/admin-navbar'
import GuestNavbar from './variants/guest-navbar'
import UserNavbar from './variants/user-navbar'
import BookNavbar from './variants/book-navbar'

const Navbar = () => {
  const isAuthenticated: boolean = true;
  const pathname = usePathname()

  switch (pathname) {
  case paths.auth.login:
    return <AuthNavbar />
  case paths.auth.register:
    return <AuthNavbar />
  case paths.admin:
    return <AdminNavbar />
  case paths.book.hotel:
    return <BookNavbar book_state={1}/>
  case paths.book.restaurant:
    return <BookNavbar book_state={1} restaurant/>
  default:
    return isAuthenticated ? 
    <UserNavbar /> : <GuestNavbar />
  }
}

export default Navbar