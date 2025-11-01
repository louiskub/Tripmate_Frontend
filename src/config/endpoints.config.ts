export const BASE_URL = "http://161.246.5.236:8800"

export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`
  },
  hotel: {
    all: "/hotel/all",
    detail: (id: string) => `/hotel/${id}`,
    book: (id: string) => `/hotel/book/${id}`,
  },
  restaurant: {
    all: "/restaurant/all",
    detail: (id: string) => `/restaurant/${id}`,
    book: (id: string) => `/restaurant/book/${id}`,
  },
  rental_car: {
    all: "/rental_car/all",
    detail: (id: string) => `/rental-car/${id}`,
    book: (id: string) => `/rental-car/book/${id}`,
  },
  attraction: {
    all: "/attraction/all",
    detail: (id: string) => `/attraction/${id}`,
    book: (id: string) => `/attraction/book/${id}`,
  },
  
  guide: {
    all: "${endpoints.baseURL}/guide/all",
    detail: (id: string) => `${BASE_URL}/guide/${id}`,
    book: (id: string) => `${BASE_URL}/guide/book/${id}`,
  },
  
  user_profile: (id: string) => `${BASE_URL}/users/${id}`,

}