import { Search } from "lucide-react"

export const BASE_URL = "http://161.246.5.236:8800"

export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    owner: `${BASE_URL}/user-services/owner`,
  },
  user: {
    profile: (id: string) => `${BASE_URL}/users/${id}`,
    edit_profile: (id: string) => `${BASE_URL}/users/${id}/edit`,
    upload_profile: (id: string) => `${BASE_URL}/users/upload/${id}`,
  },
  manage_account: {
    change_password: (id: string) => `${BASE_URL}/users/${id}/password`,
  },
  hotel: {
    all: (key?: string) => `${BASE_URL}/search/hotels?${key}`,
    detail: (id: string) => `${BASE_URL}/hotel/${id}`,
    delete: (id: string) => `/hotel/${id}`,
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
  profile: (id: string) => `${BASE_URL}/users/${id}`,
  upload_profile: (id: string) => `${BASE_URL}/users/upload/${id}`,
  
  attraction: {
    all: (key?: string) => `${BASE_URL}/search/attractions?${key}`,
    detail: (id: string) => `${BASE_URL}/place/${id}`,
    book: (id: string) => `${BASE_URL}/attraction/book/${id}`,
  },
  guide: {
    all: (key?: string) => `${BASE_URL}/search/guide?${key}`,
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

  car_center: (id: string) => `${BASE_URL}/car-rental-center/${id}`,

  serviceManage: {
    car: {
      getAllCar: (serviceId: string) =>  `${BASE_URL}/car-rental-center/${serviceId}/`,
      addCar: `${BASE_URL}/car-rental-center/add-car`,
      editCar: (id: string) => `${BASE_URL}/car/${id}`,
      deleteCar: (id: string) => `${BASE_URL}/car/${id}`,
      uploadImg: (id: string) => `${BASE_URL}/car/upload/${id}`
    }
  },

  user_groups: (id: string) => `${BASE_URL}/group/groupByuser/${id}`,

  location: {
    all: `${BASE_URL}/locations`,
    Search: (id: string) => `${BASE_URL}/locations/${id}`,
  },
    
  user_profile: (id: string) => `${BASE_URL}/users/${id}`,
  book: `${BASE_URL}/booking`,  
}