"use client"

import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, GenderInput, MaleGender, OtherGender } from '@/components/inputs/gender-input'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import ProfilePageLayout from '@/components/layout/profile-page-layout';
import EditIcon from '@/assets/icons/edit.svg'
import ProfilePic from '@/assets/icons/profile-filled.svg';

type ProfileData = {
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
    telephone?: string;
    birth_date?: string;
    gender?: "female" | "male" | "other" | null;
    profile_pic?: string;
}

export default function EditProfile(profile: ProfileData) {
    const [profileData, setProfileData] = useState({
        first_name: profile.first_name || '',
        last_name: profile.first_name || '',
        telephone: profile.telephone || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || '',
        profile_pic: profile.profile_pic || '',
    });

    const handleSaveProfile = () => {
        console.log("Saved!", profileData);
        window.location.href = paths.account.profile;
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
            {profile.profile_pic ? 
                <img className="w-28 h-28 rounded-full border border-dark-gray" 
                    src={profile.profile_pic} 
                />
                :
                <ProfilePic />
            }                
                <label className='flex items-center justify-center cursor-pointer absolute border hover:bg-custom-black hover:text-custom-white !h-7 bottom-0 right-0 bg-dark-white aspect-square rounded-full'>
                    <EditIcon width='16'/>
                <FieldInput
                    type='file'
                    className='hidden'
                    value={profileData.profile_pic}
                    onChange={(e) => setProfileData((f) => ({ ...f, profile_pic: e.target.value }))}
                >
                </FieldInput>
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
                  value={profileData.first_name}
                  onChange={(e) => setProfileData((f) => ({ ...f, first_name: e.target.value }))}></FieldInput>
            </div>
            <div className="flex flex-col w-full">
                <ButtonText className='text-custom-black'>Last name</ButtonText>
                <FieldInput 
                  className='border border-light-gray shadow-none'
                  value={profileData.last_name}
                  onChange={(e) => setProfileData((f) => ({ ...f, last_name: e.target.value }))}></FieldInput>
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
              value={profileData.telephone}
              onChange={(e) => setProfileData((f) => ({ ...f, telephone: e.target.value }))}>
            </FieldInput>
        </div>
        <div className="flex flex-col w-full">
            <ButtonText className='text-custom-black'>Birth Date</ButtonText>
            <FieldInput 
              className='border border-light-gray shadow-none'
              value={profileData.birth_date}
              onChange={(e) => setProfileData((f) => ({ ...f, birth_date: e.target.value }))}>
            </FieldInput>
        </div>
        <div className="inline-flex flex-col self-start">
            <ButtonText className='text-custom-black'>Gender</ButtonText>
            <GenderInput
              selected={profileData.gender}
              onChange={(gender) => setProfileData(prev => ({ ...prev, gender }))}
            />
        </div>
      </div>
    </div>
    </ProfilePageLayout>
);
}
