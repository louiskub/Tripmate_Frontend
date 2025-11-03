import Cookies from "js-cookie";
// import { getUserIdFromToken } from '@/utils/service/cookie'

export function authJsonHeader() {
    const token = Cookies.get("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
}
