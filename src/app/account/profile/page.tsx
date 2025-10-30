"use client"

import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, MaleGender, OtherGender } from '@/components/inputs/gender-input'
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


export default function Profile(profile: ProfileData) {
    const genderMap = {
    'female': <FemaleGender active />,
    'male': <MaleGender active />,
    'other': <OtherGender active />,
    };
    return (
    <ProfilePageLayout current_tab='profile'>
    <div className="flex-1 px-5 py-2.5 flex flex-col gap-2.5">
    <div className='flex justify-between'>
        <PageTitle className='px-4'>Profile</PageTitle>
        <Button 
            as='a'
            href={paths.account.edit_profile}
            icon_after text='Edit'
            className='!px-3 shadow-[var(--boxshadow-lifted)] bg-custom-white'
            >
            <EditIcon width='16' />
        </Button>
    </div>
    
    <div className="px-7 py-5 rounded-[10px] border border-light-gray flex items-center gap-16">
        
        <div className="flex flex-col items-center gap-1">
            <div className="w-28 h-28">
            {profile.profile_pic ? 
                <img className="w-28 h-28 rounded-full border border-dark-gray" 
                    src={profile.profile_pic} 
                />
                :
                <ProfilePic />
            }
        </div>
            <div className="flex-col gap-1.5">
                <Subtitle className='text-custom-gray inline-flex'>@</Subtitle>
                <Subtitle className='text-custom-black inline-flex'>{profile.username || 'username'}</Subtitle>
            </div>
        </div>

        <div className='w-2/3 flex gap-2.5'>
            <div className="flex flex-col w-full">
                <ButtonText className='text-custom-black'>First name</ButtonText>
                <Subtitle className='px-2 h-9 flex items-center'>{profile.first_name || 'first name'}</Subtitle>
            </div>
            <div className="flex flex-col w-full">
                <ButtonText className='text-custom-black'>Last name</ButtonText>
                <Subtitle className='px-2 h-9 flex items-center'>{profile.last_name || 'last name'}</Subtitle>
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
            <Body className='px-2 h-9 flex items-center'>{profile.birth_date || '-'}</Body>
        </div>
        <div className="flex flex-col w-full">
            <ButtonText className='text-custom-black'>Birth Date</ButtonText>
            <Body className='px-2 h-9 flex items-center'>{profile.telephone || '-'}</Body>
        </div>
        <div className="inline-flex flex-col self-start">
            <ButtonText className='text-custom-black'>Gender</ButtonText>
            { profile.gender ?
                genderMap[profile.gender]
                :
                '-'
            }
        </div>
    </div>
</div>
    </ProfilePageLayout>
);
}
