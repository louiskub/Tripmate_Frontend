export const BASE_URL = "http://161.246.5.236:8800"

export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`
  },
  manage_account: {
    change_password: (id: string) => `${BASE_URL}/users/${id}/password`,
  },
  profile: (id: string) => `${BASE_URL}/users/${id}`,
  upload_profile: (id: string) => `${BASE_URL}/users/upload/${id}`,
  hotel: {
    all: `${BASE_URL}/hotel`,
    detail: (id: string) => `${BASE_URL}/hotel/${id}`,
    book: (id: string) => `${BASE_URL}/hotel/book/${id}`,
  },
  restaurant: {
    all: `${BASE_URL}/restaurant`,
    detail: (id: string) => `${BASE_URL}/restaurant/${id}`,
    book: (id: string) => `${BASE_URL}/restaurant/book/${id}`,
  },
  rental_car: {
    all: `${BASE_URL}/car`,
    detail: (id: string) => `${BASE_URL}/car/${id}`,
    book: (id: string) => `${BASE_URL}/car/book/${id}`,
  },
  attraction: {
    all: `${BASE_URL}/place`,
    detail: (id: string) => `${BASE_URL}/place/${id}`,
    book: (id: string) => `${BASE_URL}/attraction/book/${id}`,
  },
  guide: {
    all: `${BASE_URL}/guide`,
    detail: (id: string) => `${BASE_URL}/guide/${id}`,
    book: (id: string) => `${BASE_URL}/guide/book/${id}`,
  },
  car_center: (id: string) => `${BASE_URL}/car-rental-center/${id}`

}