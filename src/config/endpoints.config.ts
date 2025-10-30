export const endpoints = {
  baseURL: "http://161.246.5.236",
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
    all: "/guide/all",
    detail: (id: string) => `/guide/${id}`,
    book: (id: string) => `/guide/book/${id}`,
  },
  
  user_profile: (id: string) => `/users/${id}`,

}