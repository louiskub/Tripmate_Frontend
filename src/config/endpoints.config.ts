export const endpoints = {
  baseURL: "http://blabla",
  hotel: {
    all: "/hotel/all",
    detail: (hotel_id: string) => `/hotel/${hotel_id}`,
    book: (hotel_id: string) => `/hotel/book/${hotel_id}`,
  }
}