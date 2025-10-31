'use client'

import { usePathname } from 'next/navigation'
import { paths } from '@/config/paths.config'

import AuthNavbar from './default-nav-variants/auth-navbar'
import AdminNavbar from './default-nav-variants/admin-navbar'
import GuestNavbar from './default-nav-variants/guest-navbar'
import UserNavbar from './default-nav-variants/user-navbar'
import BookNavbar from './default-nav-variants/book-navbar'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Temporary check if "token" cookie exists
    const tokenExists = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='))
    setIsAuthenticated(tokenExists)
  }, [])

  const pathname = usePathname()

  switch (pathname) {
  case paths.auth.login:
    return <AuthNavbar />
  case paths.auth.register:
    return <AuthNavbar />
  case paths.auth.forgot_password:
    return <AuthNavbar />
  case paths.admin:
    return <AdminNavbar />
  case paths.hotel.book:
    return <BookNavbar book_state={1}/>
  case paths.restaurant.book:
    return <BookNavbar book_state={1} restaurant/>
  default:
    return isAuthenticated ? 
    <UserNavbar /> : <GuestNavbar />
  }
}

export default Navbar