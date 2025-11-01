type RentalCarCardProps = {
    name: string
    owner: {
        user_id: string
        profile_pic?: string
        first_name: string
        last_name: string
    }
    rating: number
    rating_count: number
    location: string
    price: number
    type: string
    pictures: Array<string>
    favorite: boolean
    rental_car_id: string
}

export default RentalCarCardProps