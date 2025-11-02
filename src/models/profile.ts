import GuideCardProps from "./service/card/guide-card";
import RentalCarCardProps from "./service/card/rental-car-card";
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
    profileImg?: string;
    username: string;
    fname: string;
    lname: string;
    gender?: "female" | "male" | "Other" | null;
    tripCount: number;
    reviewCount: number;
    bookingCount: number;
    role?: string;
    service?: RentalCarCardProps[] | GuideCardProps[] | null
}