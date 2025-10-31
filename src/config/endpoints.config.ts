export const endpoints = {
  baseURL: "http://localhost:3001",
  // baseURL: "http://161.246.5.236:8800",
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
    detail: (id: string) => `${endpoints.baseURL}/guide/${id}`,
    book: (id: string) => `${endpoints.baseURL}/guide/book/${id}`,
  },
  
  user_profile: (id: string) => `${endpoints.baseURL}/users/${id}`,

}