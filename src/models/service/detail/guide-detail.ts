import Review from '@/models/service/reviews';

type GuideDetail = {
    name: string,

    guider: {
        user_id: string
        profile_pic?: string
        name: string
    },

    // duration: string,
    
    type?: string[],

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
        mon_fri?: string
        weekend?: string
        overtime?: number
        contact?: string
    }
    
    id:string
    favorite: boolean
    lat: number,
    long: number,
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