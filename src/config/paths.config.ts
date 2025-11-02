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
    book: '/hotel/book',
  },
  restaurant: {
    all: '/restaurant',
    detail: (id: string) => `/restaurant/${id}`,
    book: '/restaurant/book',
  },
  rental_car: {
    all: '/rental-car',
    detail: (id: string) => `/rental-car/${id}`,
    book: '/rental-car/book',
  },
  guide: {
    all: '/guide',
    detail: (id: string) => `/guide/${id}`,
    book: '/guide/book',
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