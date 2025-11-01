import Review from '@/models/service/reviews';

type GuideDetail = {
    name: string,

    guider: {
        username: string
        profile_pic?: string
        first_name: string
        last_name: string
    },

    // duration: string,
    
    type?: string,

    price: number,

    description?: string,

    pictures: string[],

    rating: number,
    subtopic_ratings: GuideSubtopicRating,
    rating_count: number,
    review?: Review[],

    location: string,
    nearby_locations: string[]

    policy: {
        start?: string
        end?: string
        max_guest?: number
        contact?: string
    }
    
    favorite: boolean
}

export type GuideSubtopicRating = {
    knowledge: number,
    communication: number,
    punctuality: number,
    safety: number,
    route_planning: number,
    local_insights: number,
}

export default GuideDetail