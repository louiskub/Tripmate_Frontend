"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { endpoints } from "@/config/endpoints.config";
import { getProfile } from "@/utils/service/profile(server)";
import { getUserIdFromToken } from "@/utils/service/cookie";

type navbarData = {
    username: string,
    fname: string,
    lname: string,
    profileImg: string
}

type UserContextType = {
user: navbarData | null;
setUser: (user: navbarData) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<navbarData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
        const token = Cookies.get("token");
        const id = getUserIdFromToken(token)
        if (!token || !id) return;

        try {
            const res = await axios.get(endpoints.profile(id), {
            headers: { Authorization: `Bearer ${token}` },
            });
            const profile = {
                username: res.data.username,
                fname: res.data.fname,
                lname: res.data.lname,
                profileImg: res.data.profileImg ?? "", // fallback if missing
                };
            console.log(profile)
            setUser(profile);
        } catch (err) {
            console.error("Failed to fetch user", err);
        }
        };

        fetchUser();
    }, []);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
    }

    // Custom hook for easier usage
    export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
