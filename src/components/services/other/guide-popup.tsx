"use client";

import { Button } from "@/components/buttons/buttons";
import { PasswordInput } from "@/components/inputs/inputs";
import PasswordValidate from "@/components/other/password-validate";
import { ButtonText, SubBody } from "@/components/text-styles/textStyles";
import { endpoints } from "@/config/endpoints.config";
import { getUserIdFromToken } from "@/utils/service/cookie";
import axios from "axios";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { paths } from "@/config/paths.config";
import { get } from "http";
import { PageOptionDropdown, PageOptionSide } from "@/components/navbar/navbar-button";


type PopupProps = {
    Close: () => void;
    type: string,
    service_id: string
}

const getGroups = async () => {
        
    const token = Cookies.get("token");
    const user_id = getUserIdFromToken(token)

    if (!token || !user_id){
        window.location.href = paths.auth.login
        return
    }

    try {
        console.log(endpoints.user_groups(user_id))
        const res = await axios.get(endpoints.user_groups(user_id));
        console.log(res.data)
        const groups = res.data.map((g:any) => ({
            id: g.groupId,
            name: g.group.groupName,
        }))
        console.log(groups)
        return groups
        // toast.success("Password changed successfully!");

    } catch (error: any) {
    console.error("Error", error.response?.data || error.message);

    // toast.error(
    //     error.response?.data?.message || "Failed to change password. Please check your inputs."
    // );
}
}

export default function GuidePopup({ Close, type, service_id }: PopupProps) {
    const [groups, setGroups] = useState<any[]>([]);

    useEffect(() => {
        async function fetchGroups() {
        const res = await getGroups();
        setGroups(res);
        }
        fetchGroups();
    }, []);

    let pathFn: ((...args: any[]) => string) | string = "";

    if (type === "hotel") {
        pathFn = paths.hotel.book;
    } else if (type === "restaurant") {
        pathFn = paths.restaurant.book;
    } else if (type === "rental_car") {
        pathFn = paths.rental_car.book;
    } else if (type === "guide") {
        pathFn = paths.guide.book;
    }

    return (
        <div className='fixed top-0 left-0 bg-transparent-black w-full h-full flex justify-center items-center z-10'>
        <div className="relative w-[300px] py-5 bg-white rounded-[20px] shadow-[var(--boxshadow-lifted)] flex flex-col gap-5">
            
            <div className="self-stretch flex flex-col justify-center items-center">
            <ButtonText>Select group</ButtonText>
            <Button onClick={Close} className='absolute top-5 right-5 text-custom-gray'>
                <XIcon width='16' />
            </Button>
            </div>

            <div className="flex flex-col gap-2.5">
            {groups.map((group:any, idx:number) => (
                <PageOptionSide
                key={idx}
                href={typeof pathFn === "function"
                    ? pathFn(service_id, group.id)
                    : pathFn}
                text={group.name}
                className="hover:bg-dark-white px-2!"
                />
            ))}
            </div>

        </div>
        </div>
    );
}
