import Review from "./service/reviews";

export type OtherProfileData = {
    profile_pic?: string;
    username: string;
    first_name: string;
    last_name: string;
    trip_count: number;
    review_count: number;
    booking_count: number;
    role?: string;
    trips?: string[];
    reviews?: Review[];
}