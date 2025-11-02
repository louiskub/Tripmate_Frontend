type RestaurantCardProps = {
    name: string
    rating: number
    rating_count: number
    location: string
    pictures: Array<string>
    favorite: boolean
    tag: string
    open: {
        day: string
        open: string
        close: string
    }[]
    id: string
}

export default RestaurantCardProps