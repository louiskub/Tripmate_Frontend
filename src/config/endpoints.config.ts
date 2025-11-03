export const BASE_URL = "http://161.246.5.236:8800"

export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    owner: `${BASE_URL}/user-services/owner`,
  },
  user: {
    history: {
      booking: (vendorType: string) => `${BASE_URL}/transaction?type=${vendorType}`
    }
  },
  manage_account: {
    change_password: (id: string) => `${BASE_URL}/users/${id}/password`,
  },
  profile: (id: string) => `${BASE_URL}/users/${id}`,
  upload_profile: (id: string) => `${BASE_URL}/users/upload/${id}`,
  favorite: `${BASE_URL}/bookmark`,
  unfavorite: (user_id: string, service_id: string) => `${BASE_URL}/bookmark/${user_id}/${service_id}`,
  favorite_page: (id: string, type: string) => `${BASE_URL}/users/bookmark/${id}/${type}`,

  hotel: {
    all: (key?: string) => `${BASE_URL}/hotel?${key}`,
    detail: (id: string) => `${BASE_URL}/hotel/${id}`,
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
  attraction: {
    all: (key?: string) => `${BASE_URL}/place?${key}`,
    detail: (id: string) => `${BASE_URL}/place/${id}`,
    book: (id: string) => `${BASE_URL}/attraction/book/${id}`,
  },
  guide: {
    all: (key?: string) => `${BASE_URL}/guide?${key}`,
    detail: (id: string) => `${BASE_URL}/guide/${id}`,
    book: (id: string) => `${BASE_URL}/guide/book/${id}`,
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
    }
  },
  review: {
    create: `${BASE_URL}/review`,
    uploadImg: (id: string) => `${BASE_URL}/review/upload/${id}`
  },
  user_groups: (id: string) => `${BASE_URL}/group/groupByuser/${id}`

}