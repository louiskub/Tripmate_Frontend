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
  trip: {
    detail: (id: string) => `/trip/${id}`,
  },

  group:{
    all: `http://161.246.5.236:8800/group`,
    expense: (id: string) => `http://161.246.5.236:8800/group/${id}/expense-groups`,
    summary: (id: string) => `http://161.246.5.236:8800/group/${id}/expense-summary`,
    payment: (id: string) => `http://161.246.5.236:8800/group/${id}/payments`,
  },
}