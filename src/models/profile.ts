import Review from "./service/reviews";

export type ProfileData = {
    profileImg?: string;
    username: string;
    fname: string;
    lname: string;
    email: string;
    phone?: string;
    birthDate?: string;
    gender?: "female" | "male" | "Other" | null;
}

export type OtherProfileData = {
    profile_pic?: string;
    username: string;
    fname: string;
    lname: string;
    gender?: "female" | "male" | "Other" | null;
    trip_count: number;
    review_count: number;
    booking_count: number;
    role?: string;
    trips?: string[];
}