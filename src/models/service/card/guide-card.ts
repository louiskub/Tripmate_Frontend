type GuideCardProps = {
    name: string
    guider: {
        username: string
        profile_pic?: string
        first_name: string
        last_name: string
    }
    // duration: string;
    rating: number
    rating_count: number
    location: string
    price: number
    type: string
    pictures: Array<string>
    favorite: boolean
    id: string
}

export default GuideCardProps