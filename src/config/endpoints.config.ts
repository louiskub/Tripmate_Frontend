export const BASE_URL = "http://161.246.5.236:8800"

export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    owner: `${BASE_URL}/user-services/owner`,
  },
  manage_account: {
    change_password: (id: string) => `${BASE_URL}/users/${id}/password`,
  },
  profile: (id: string) => `${BASE_URL}/users/${id}`,
  upload_profile: (id: string) => `${BASE_URL}/users/upload/${id}`,
  hotel: {
    all: (key?: string) => `${BASE_URL}/search/hotels?${key}`,
    detail: (id: string) => `${BASE_URL}/hotel/${id}`,
    book: (id: string) => `${BASE_URL}/hotel/book/${id}`,
  },
  restaurant: {
    all: (key?: string) => `${BASE_URL}/search/rentaurants?${key}`,
    detail: (id: string) => `${BASE_URL}/restaurant/${id}`,
    book: (id: string) => `${BASE_URL}/restaurant/book/${id}`,
  },
  rental_car: {
    all: (key?: string) => `${BASE_URL}/search/rentals?${key}`,
    detail: (id: string) => `${BASE_URL}/car/${id}`,
    book: (id: string) => `${BASE_URL}/car/book/${id}`,
  },
  trip: {
    detail: (id: string) => `/trip/${id}`,
  },

  group: {
    // ✅ เพิ่มพอร์ตให้ครบ
    all: "http://161.246.5.236:8800/group",
    get: (id: string) => `http://161.246.5.236:8800/group/${id}`,
    expense: (id: string) => `http://161.246.5.236:8800/group/${id}/expense-groups`,
    summary: (id: string) => `http://161.246.5.236:8800/group/${id}/expense-summary`,
    payment: (id: string) => `http://161.246.5.236:8800/group/${id}/payments`,
  },
  attraction: {
    all: (key?: string) => `${BASE_URL}/search/attractions?${key}`,
    detail: (id: string) => `${BASE_URL}/place/${id}`,
    book: (id: string) => `${BASE_URL}/attraction/book/${id}`,
  },
  guide: {
    all: (key?: string) => `${BASE_URL}/search/guide?${key}`,
    detail: (id: string) => `${BASE_URL}/guide/${id}`,
    book: (id: string) => `${BASE_URL}/guide/book/${id}`,
  },
  car_center: (id: string) => `${BASE_URL}/car-rental-center/${id}`,

  serviceManage: {
    car: {
      getAllCar: (serviceId: string) =>  `${BASE_URL}/car-rental-center/${serviceId}/`,
      addCar: `${BASE_URL}/car-rental-center/add-car`,
      editCar: (id: string) => `${BASE_URL}/car/${id}`,
      deleteCar: (id: string) => `${BASE_URL}/car/${id}`,
      uploadImg: (id: string) => `${BASE_URL}/car/upload/${id}`
    }
  }

}