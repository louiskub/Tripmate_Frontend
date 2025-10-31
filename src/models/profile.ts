import Review from "./service/reviews";

export type ProfileData = {
    profile_pic?: string;
    username: string;
    fname: string;
    lname: string;
    email: string;
    phone?: string;
    birthDate?: string;
    gender?: "Female" | "Male" | "Other" | null;
}

export type OtherProfileData = {
    profile_pic?: string;
    username: string;
    fname: string;
    lname: string;
    gender?: "Female" | "Male" | "Other" | null;
    trip_count: number;
    review_count: number;
    booking_count: number;
    role?: string;
    trips?: string[];
}