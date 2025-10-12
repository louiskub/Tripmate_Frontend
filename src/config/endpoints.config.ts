export const endpoints = {
  baseURL: "http://blabla",
  hotel: {
    all: "/hotel/all",
    detail: (hotel_id: string) => `/hotel/${hotel_id}`,
    book: (hotel_id: string) => `/hotel/book/${hotel_id}`,
  },
  restaurant: {
    all: "/restaurant/all",
    detail: (restaurant_id: string) => `/restaurant/${restaurant_id}`,
    book: (restaurant_id: string) => `/restaurant/book/${restaurant_id}`,
  },
}