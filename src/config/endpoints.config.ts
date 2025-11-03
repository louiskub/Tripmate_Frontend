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
  history: {
      booking: (vendorType: string) => `${BASE_URL}/transaction?type=${vendorType}`
    },
  manage_account: {
    change_password: (id: string) => `${BASE_URL}/users/${id}/password`,
  },
  favorite: `${BASE_URL}/bookmark`,
  unfavorite: (id: string) => `${BASE_URL}/bookmark/${id}`,
  favorite_page: (id: string, type: string) => `${BASE_URL}/users/bookmark/${id}/${type}`,
  hotel: {
    all: (key?: string) => `${BASE_URL}/hotel?${key}`,
    detail: (id: string) => `${BASE_URL}/hotel/${id}`,
    delete: (id: string) => `/hotel/${id}`,
    book: (id: string) => `${BASE_URL}/hotel/book/${id}`,
    room: (roomId: string, hotelId: string) => `${BASE_URL}/room/${roomId}/${hotelId}`,
  },
  restaurant: {
    all: (key?: string) => `${BASE_URL}/restaurant?${key}`,
    detail: (id: string) => `${BASE_URL}/restaurant/${id}`,
    book: (id: string) => `${BASE_URL}/restaurant/book/${id}`,
  },
  rental_car: {
    all: (key?: string) => `${BASE_URL}/car?${key}`,
    detail: (id: string) => `${BASE_URL}/car/${id}`,
    book: (id: string) => `${BASE_URL}/car/book/${id}`,
  },  
  profile: (id: string) => `${BASE_URL}/users/${id}`,
  upload_profile: (id: string) => `${BASE_URL}/users/upload/${id}`,
  
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
    all: (key?: string) => `${BASE_URL}/place?${key}`,
    detail: (id: string) => `${BASE_URL}/place/${id}`,
    book: (id: string) => `${BASE_URL}/attraction/book/${id}`,
  },
  guide: {
    all: (key?: string) => `${BASE_URL}/guide?${key}`,
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

  nearby_location: (lat:number, long:number) => `${BASE_URL}/locations/nearby?lat=${lat}&lng=${long}&radiusKm=50&limit=10`,

  car_center: (id: string) => `${BASE_URL}/car-rental-center/${id}`,

  serviceManage: {
    car: {
      getAllCar: (serviceId: string) =>  `${BASE_URL}/car-rental-center/${serviceId}/`,
      addCar: `${BASE_URL}/car-rental-center/add-car`,
      editCar: (id: string) => `${BASE_URL}/car/${id}`,
      deleteCar: (id: string) => `${BASE_URL}/car/${id}`,
      uploadImg: (id: string) => `${BASE_URL}/car/upload/${id}`
    },
    guide: {
      uploadImg: (id: string) => `${BASE_URL}/guide/upload/${id}`,
    }
  },
  review: {
    getAll: `${BASE_URL}/review`,
    create: `${BASE_URL}/review`,
    edit: (id: string) => `${BASE_URL}/review/${id}`,
    delete: (id: string) => `${BASE_URL}/review/${id}`,
    uploadImg: (id: string) => `${BASE_URL}/review/upload/${id}`
  },
  booking: {
    getAllFromService: (id: string) => `${BASE_URL}/booking/getByService/${id}`
  },
  user_groups: (id: string) => `${BASE_URL}/group/groupByuser/${id}`

  location: {
    all: `${BASE_URL}/locations`,
    Search: (id: string) => `${BASE_URL}/locations/${id}`,
  },
    
  user_profile: (id: string) => `${BASE_URL}/users/${id}`,
  book: `${BASE_URL}/booking`,  
  searchbook: (id: string) =>`${BASE_URL}/booking/${id}`,
  searchroom: (roomId: string, hotelId: string) => `${BASE_URL}/room/${roomId}/${hotelId}`,
  payment: (id: string) => `${BASE_URL}/booking/confirm/${id}`,  
  
  
}