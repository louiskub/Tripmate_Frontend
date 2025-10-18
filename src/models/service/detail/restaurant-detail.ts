import Reviews from '@/models/service/reviews';

type RestaurantDetail = {
    name: string,

    description: string,

    pictures: string[],

    rating: number,
    subtopic_ratings: RestaurantSubtopicRating,
    rating_count: number,
    review: Reviews[],

    menu: string[],

    location: string,
    nearby_locations: string[]
    
    favorite: boolean

    tag: string
}

export type RestaurantSubtopicRating = {
    cleanliness: number
    delicacy: number
    service: number
    location: number
    vibe: number
}

export default RestaurantDetail