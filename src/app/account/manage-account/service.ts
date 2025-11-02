import axios from 'axios'
import { endpoints } from '@/config/endpoints.config'
import { cookies } from "next/headers";
import { getUserIdFromToken } from '@/utils/service/cookie'

export const changePassword = async (oldPassword: string, newPassword: string) => {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user_id = getUserIdFromToken(token)

    if (!user_id) return;

    try {
        const response = await axios.patch(endpoints.manage_account.change_password(user_id), {
            oldPassword,
            newPassword,
        });
        return response

    } catch (error: any) {
        console.error("Change Password failed:", error.response?.data || error.message);
        return null
    }
    }