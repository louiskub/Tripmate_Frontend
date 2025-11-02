type RentalCarCardProps = {
    name: string
    owner: {
        id: string
        profile_pic?: string
        name: string
    }
    rating: number
    rating_count: number
    location: string
    price: number
    brand: string
    model: string
    pictures: Array<string>
    favorite: boolean
    id: string
}

export default RentalCarCardProps