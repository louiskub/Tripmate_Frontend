import Reviews from '@/models/service/reviews';

type HotelDetail = {
    name: string,
    type: 'hotel' | 'resort',
    star: number,

    description: string,

    pictures: string[],

    facilities: Facility,

    rating: number,
    subtopic_ratings: HotelSubtopicRating,
    rating_count: number,
    review: Reviews[],

    location: string,
    nearby_locations: string[]
    
    favorite: boolean

    room: Room[],

    policy: HotelPolicy,
    id: string,
    lat: number,
    long: number,

    id: string
}

type Facility = {
    health: string[]
    internet: string[]
    food: string[]
    accessibility: string[]
    service: string[]
    transportation: string[]
}

export type HotelSubtopicRating = {
    cleanliness: number
    comfort: number
    meal: number
    location: number
    service: number
    facilities: number
}

export type Room = {
    name: string
    pictures: string[]
    room_options: RoomOption[]
    size: number
    facility: string[]
}

type RoomOption = {
    name: string
    bed: string
    max_guest: number
    price: number
}

type HotelPolicy = {
    check_in: string
    check_out: string
    breakfast: string
    pet_allow: boolean
    contact: string
}

export default HotelDetail