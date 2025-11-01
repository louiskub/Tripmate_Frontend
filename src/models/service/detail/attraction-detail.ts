import Review from '@/models/service/reviews';

type AttractionDetail = {
    name: string,
    type: string,
    fee?: priceItem[],
    description: string,
    pictures: string[],
    rating: number,
    rating_count: number,
    review: Review[],
    location: string,
    nearby_locations: string[]
    favorite: boolean
}

export type priceItem = {
    group?: string
    title: string
    description?: string
    price: number
}

export default AttractionDetail