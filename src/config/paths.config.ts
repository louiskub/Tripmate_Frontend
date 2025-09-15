export const paths = {
  home: '/',
  admin: 'admin/',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    provider: '/auth/register-provider'
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
    all: '/trip',
  },
  group: {
    all: '/group',
  },
  hotel: {
    all: '/hotel',
    detail: 'hotel/detail',
    book: '/hotel/book',
  },
  restaurant: {
    all: '/restaurant',
    detail: 'restaurant/detail',
    book: '/restaurant/book',
  },
  rental_car: {
    all: '/rental-car',
    detail: 'rental-car/detail',
    book: '/rental-car/book',
  },
  guide: {
    all: '/guide',
    detail: 'guide/detail',
    book: '/guide/book',
  },
  attraction: {
    all: '/attraction',
    detail: 'attraction/detail',
  },
  map: '/map',
}