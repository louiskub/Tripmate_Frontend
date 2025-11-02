type GuideCardProps = {
    name: string
    guider: {
        user_id: string
        profile_pic?: string
        name: string
    }
    // duration: string;
    rating: number
    rating_count: number
    location: string
    price: number
    type: string[]
    pictures: Array<string>
    favorite: boolean
    id: string
}

export default GuideCardProps