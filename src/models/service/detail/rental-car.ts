import Review from '@/models/service/reviews';

type RentalcarDetail = {
    name: string,

    renter: {
        username: string
        profile_pic?: string
        first_name: string
        last_name: string
    },
    
    type?: string,

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
        pet_allow?: boolean
        contact?: string
    }
    
    favorite: boolean
}

export default RentalcarDetail