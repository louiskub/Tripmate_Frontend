import Review from '@/models/service/reviews';

type RentalcarDetail = {
    name: string,

    owner: {
        id: string
        profile_pic?: string
        name: string
    },
    
    brand?: string,
    model?: string,

    price: number,

    description?: string,

    pictures: string[],

    rating: number,
    rating_count: number,
    review?: Review[],

    location: string,
    nearby_locations: string[]

    services: {
        deposit: number
        delivery: {
            in_local: number
            out_local: number
        }
        insurance: number
    }

    policy: {
        pick_up?: string
        drop_off?: string
        fuel?: boolean
        seats?: number
        contact?: string
    }

    id: string
    
    favorite: boolean
}

export default RentalcarDetail