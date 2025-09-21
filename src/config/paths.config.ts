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
  trip: {
    all: '/trip/all',
  },
  group: {
    all: '/group/all',
  },
  hotel: {
    all: '/hotel/all',
    detail: '/hotel/1',
    book: '/hotel/book',
  },
  restaurant: {
    all: '/restaurant/all',
    detail: 'restaurant/',
    book: '/restaurant/book',
  },
  rental_car: {
    all: '/rental-car/all',
    detail: 'rental-car/',
    book: '/rental-car/book',
  },
  guide: {
    all: '/guide/all',
    detail: 'guide/',
    book: '/guide/book',
  },
  attraction: {
    all: '/attraction/all',
    detail: 'attraction/',
  },
  map: '/map',
}