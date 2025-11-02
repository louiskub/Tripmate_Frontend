"use client"

import {PageTitle, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput } from '@/components/inputs/inputs'
import { GenderInput } from '@/components/inputs/gender-input'
import { Button } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import ProfilePageLayout from '@/components/layout/profile-page-layout';
import EditIcon from '@/assets/icons/edit.svg'
import ProfilePic from '@/assets/icons/profile-filled.svg';
import { getUserIdFromToken } from '@/utils/service/cookie'
import Cookies from "js-cookie";
import { endpoints } from '@/config/endpoints.config'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useRouter } from "next/navigation"

export default function EditProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState({
        fname: '',
        lname: '',
        phone:  '',
        birthDate: '',
        gender: '',
        profileImg: '',
        username: '',
        email: '',
        role: 'user',
        status: 'active'
    });

    useEffect(() => {
        const token = Cookies.get("token");
        const user_id = getUserIdFromToken(token)
        if (!token || !user_id) return;

        const fetchProfile = async () => {
        try {
            const res = await axios.get(endpoints.profile(user_id), {
            headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
        };

        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        const token = Cookies.get("token");
        const user_id = getUserIdFromToken(token);

        if (!token || !user_id) {
            toast.error("Unauthorized");
            return;
        }
        try {
            const { profileImg, ...textData } = profile;
            await axios.patch(endpoints.profile(user_id), textData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("save profile successfully!");

            router.push(paths.account.profile)

        } catch (error: any) {
        console.error("save profile failed:", error.response?.data || error.message);

        toast.error(
            error.response?.data?.message || "Failed to save profile. Please check your inputs."
        );
    }
    }

    const handleUploadProfile = async (file: File) => {
        const token = Cookies.get("token");
        const user_id = getUserIdFromToken(token);

        if (!user_id) return

        try{
            // Upload profile image if there is a new file
            if (file && (file as any) instanceof File) {
                const formData = new FormData();
                formData.append("profileImg", file);
                await axios.post(endpoints.upload_profile(user_id), formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            // Refetch profile to get updated image
            const res = await axios.get(endpoints.profile(user_id), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data); // update state with new profile

            toast.success("upload profile successfully!");


        } catch (error: any) {

            toast.error(
                error.response?.data?.message || "Failed to upload profile"
            );
        }
    }

    return (
    <ProfilePageLayout current_tab='profile'>
    <div className="flex-1 px-5 py-2.5 flex flex-col gap-2.5">
    <div className='flex justify-between gap-1.5'>
        <PageTitle className='px-4 mr-auto'>Edit Profile</PageTitle>
        <Button 
            as='a'
            href={paths.account.profile}
            icon_after text='Cancel'
            className='!px-3 border bg-custom-white'
            >
        </Button>
        <Button 
            as='button'
            icon_after text='Save'
            className='bg-light-blue text-dark-blue'
            onClick={handleSaveProfile}
            >
        </Button>
    </div>
    
    <div className="px-7 py-5 rounded-[10px] border border-light-gray flex items-center gap-16">
        
        <div className="flex flex-col items-center gap-1">
            <div className="w-28 h-28 relative">
            {profile.profileImg ? 
                <img className="w-28 h-28 rounded-full border border-dark-gray" 
                    src={profile.profileImg} 
                />
                :
                <ProfilePic />
            }                
                <label className='flex items-center justify-center cursor-pointer absolute border hover:bg-custom-black hover:text-custom-white !h-7 bottom-0 right-0 bg-dark-white aspect-square rounded-full'>
                    <EditIcon width='16'/>
                <input
                    type='file'
                    className='hidden'
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            handleUploadProfile(file)
                        }
                    }}>
                </input>
                </label>
            </div>
            <div className="flex-col gap-1.5">
                <Subtitle className='text-custom-gray inline-flex'>@</Subtitle>
                <Subtitle className='text-custom-black inline-flex'>{profile.username || 'username'}</Subtitle>
            </div>
        </div>

        <div className='w-2/3 flex gap-2.5'>
            <div className="flex flex-col w-full">
                <ButtonText className='text-custom-black'>First name</ButtonText>
                <FieldInput 
                    className='border border-light-gray shadow-none'
                    value={profile.fname || ''}
                    onChange={(e) => setProfile((f) => ({ ...f, fname: e.target.value }))}></FieldInput>
            </div>
            <div className="flex flex-col w-full">
                <ButtonText className='text-custom-black'>Last name</ButtonText>
                <FieldInput 
                    className='border border-light-gray shadow-none'
                    value={profile.lname || ''}
                    onChange={(e) => setProfile((f) => ({ ...f, lname: e.target.value }))}></FieldInput>
            </div>
        </div>

    </div>

    <div className="px-7 py-5 rounded-[10px] border border-light-gray flex flex-col justify-center gap-4">
        <div className="flex flex-col w-full">
            <ButtonText className='text-custom-black'>Email</ButtonText>
            <Body className='px-2 h-9 flex items-center'>{profile.email || 'example@gmail.com'}</Body>
        </div>
        <div className="flex flex-col w-full">
            <ButtonText className='text-custom-black'>Telephone Number</ButtonText>
            <FieldInput
                className='border border-light-gray shadow-none'
                value={profile.phone || ''}
                onChange={(e) => setProfile((f) => ({ ...f, phone: e.target.value }))}>
            </FieldInput>
        </div>
        <div className="flex flex-col w-full">
            <ButtonText className='text-custom-black'>Birth Date</ButtonText>
            <FieldInput 
                type='date'
                className='border border-light-gray shadow-none'
                value={profile.birthDate ? profile.birthDate.split("T")[0] : ""}
                onChange={(e) => setProfile((f) => ({ ...f, birthDate: e.target.value }))}>
            </FieldInput>
        </div>
        <div className="inline-flex flex-col self-start">
            <ButtonText className='text-custom-black'>Gender</ButtonText>
            <GenderInput
                selected={profile.gender}
                onChange={(gender) => setProfile(prev => ({ ...prev, gender }))}
            />
        </div>
    </div>
    </div>
    </ProfilePageLayout>
);
}
