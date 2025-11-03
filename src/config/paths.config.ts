export const paths = {
  home: '/',
  admin: 'admin/',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    provider: '/auth/register-provider',
    forgot_password: '/auth/forgot-password'
  },
  account: {
    profile: '/account/profile',
    edit_profile: '/account/profile/edit',
    manage_account: '/account/manage-account',
    favorite: '/account/favorite',
    notification: '/account/notification',
    booking_history: '/account/booking-history',
    review_history: '/account/review-history',
    group: '/account/my-group',
    trip: '/account/my-trip',
  },
  other_profile: (id: string) => `/users/${id}`,
  trip: {
    all: '/trip',
  },
  group: {
    all: '/group',
  },
  hotel: {
    all: '/hotel',
    detail: (id: string) => `/hotel/${id}`,
    book: (service_id: string, group_id:string, room_id: string, option_id: string) => `/bookhotel/confirmbooking?service_id=${service_id}&group_id=${group_id}&room_id=${room_id}&option_id=${option_id}`,
  },
  restaurant: {
    all: '/restaurant',
    detail: (id: string) => `/restaurant/${id}`,
    book: (service_id: string, group_id:string) => `/bookrestaurant/confirmbooking?service_id=${service_id}&group_id=${group_id}`,
  },
  rental_car: {
    all: '/rental-car',
    detail: (id: string) => `/rental-car/${id}`,
    book: (service_id: string, group_id:string) => `/bookrentalcar/confirmbooking?service_id=${service_id}&group_id=${group_id}`,
  },
  guide: {
    all: '/guide',
    detail: (id: string) => `/guide/${id}`,
    book: (service_id: string, group_id:string) => `/bookguide/confirmbooking?service_id=${service_id}&group_id=${group_id}`,
  },
  attraction: {
    all: '/attraction',
    detail: (id: string) => `/attraction/${id}`,
  },
  map: '/map',
  vendor: {
    all: '/vendor',
    account: {
      all: '/vendor/account',
      create: '/vendor/account/create',
      manage: '/vendor/account/manage',
    }
  }
}