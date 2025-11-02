import { Search } from "lucide-react"

export const BASE_URL = "http://161.246.5.236:8800"

export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`
  },
  user: {
    profile: (id: string) => `${BASE_URL}/users/${id}`,
    edit_profile: (id: string) => `${BASE_URL}/users/${id}/edit`,
  },
  hotel: {
    all: "/hotel/all",
    detail: (id: string) => `/hotel/${id}`,
    delete: (id: string) => `/hotel/${id}`,
    // book: (id: string) => `/hotel/book/${id}`,
  },
  restaurant: {
    all: "/restaurant/all",
    detail: (id: string) => `/restaurant/${id}`,
    // book: (id: string) => `/restaurant/book/${id}`,
  },
  rental_car: {
    all: "/rental_car/all",
    detail: (id: string) => `/car/${id}`,
    // book: (id: string) => `/rental-car/book/${id}`,
  },
  attraction: {
    all: "/attraction/all",
    detail: (id: string) => `/attraction/${id}`,
    book: (id: string) => `/attraction/book/${id}`,
  },
  
  guide: {
    all: "${endpoints.baseURL}/guide/all",
    detail: (id: string) => `${BASE_URL}/guide/${id}`,
    // book: `${BASE_URL}/booking`,
  },

  discount: {
    all: `${BASE_URL}/discount`,
    detail: (id: string) => `${BASE_URL}/discount/${id}`,
  },
  
  user_services: {
    all: `${BASE_URL}/user-services`,
    owner: `${BASE_URL}/user-services/owner`, 
    delete: (id: string) => `${BASE_URL}/user-services/${id}`,
    createhotel: `${BASE_URL}/user-services/hotel/`,
  }, 

  location: {
    all: `${BASE_URL}/locations`,
    Search: (id: string) => `${BASE_URL}/locations/${id}`,
  },
    
  user_profile: (id: string) => `${BASE_URL}/users/${id}`,
  book: `${BASE_URL}/booking`,  
}