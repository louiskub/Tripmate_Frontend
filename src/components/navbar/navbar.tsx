'use client'

import { usePathname } from 'next/navigation'
import { paths } from '@/config/paths.config'
import { useEffect, useState } from "react";


import AuthNavbar from './default-nav-variants/auth-navbar'
import AdminNavbar from './default-nav-variants/admin-navbar'
import GuestNavbar from './default-nav-variants/guest-navbar'
import BookNavbar from './default-nav-variants/book-navbar'
import { checkAuth } from '@/utils/service/authen'
import UserNavbar from './default-nav-variants/user-navbar';

const Navbar = () => {
  const pathname = usePathname()
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(checkAuth());
  }, []);

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
  case paths.guide.book:
    return <BookNavbar book_state={1}/>
  case paths.rental_car.book:
    return <BookNavbar book_state={1}/>
  case paths.restaurant.book:
    return <BookNavbar book_state={1} restaurant/>
  default:
    return auth ? 
    <UserNavbar/> : <GuestNavbar />
  }
}

export default Navbar