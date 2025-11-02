import { cookies } from "next/headers";
import { getUserIdFromToken } from "./cookie";
import { endpoints } from "@/config/endpoints.config";
import { ProfileData } from "@/models/profile";
import axios from "axios";

export async function getProfile(user_id: string): Promise<ProfileData | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || !user_id) return null;

    const res = await fetch(endpoints.profile(user_id), {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
    });

    if (!res.ok) return null;
    return res.json();
}

export async function getCarRentalCenter(id: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;
    try{
        const res = await axios.get(endpoints.car_center(id));
        return res
    }catch (error: any) {
    if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
    } else {
        console.error("Unexpected Error:", error);
    }
    throw error;
} 
}