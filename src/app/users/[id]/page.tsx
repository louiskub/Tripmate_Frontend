"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import RentalCarCard from '@/components/services/service-card/rental-car-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, Title, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'

import { rental_cars } from '@/mocks/rental-cars'; 

import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, MaleGender, OtherGender } from '@/components/inputs/gender-input'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'

import ProfileIcon from '@/assets/icons/profile.svg'

import CustomerIcon from '@/assets/icons/person.svg'
import ProfilePic from '@/assets/icons/profile-filled.svg';

import DefaultLayout from '@/components/layout/default-layout';

import { OtherProfileData } from '@/models/profile';
import { OtherProfileEx } from '@/mocks/profile';

import { SubTitle } from 'chart.js';


export default function OtherProfile() {
  const profile = OtherProfileEx as OtherProfileData;
  const genderMap = {
    'female': <FemaleGender active />,
    'male': <MaleGender active />,
    'other': <OtherGender active />,
  };
  return (
    <DefaultLayout current_tab='profile'>
    <div className="flex-1 px-5 py-2.5 flex flex-col gap-5">
      <PageTitle className='px-4'>Profile</PageTitle>
      <div className="px-7 py-5 rounded-2xl bg-white shadow-[var(--light-shadow)] flex items-center gap-16 justify-between">
        <div className='flex gap-6 basis-1/3'>  
          <div className="w-28 h-28">
            {profile.profile_pic ? 
              <img className="w-28 h-28 rounded-full border border-dark-gray" 
                src={profile.profile_pic} 
              />
              :
              <ProfilePic />
            }
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <Title className='px-0.5 flex items-center'>
              {profile.first_name} {profile.last_name}
            </Title>
            <div className="flex gap-0.5">
              <Body className='text-gray inline-flex'>@</Body>
              <Body className='text-dark-gray inline-flex'>{profile.username}</Body>
            </div>
            <div className="inline-flex items-center gap-0.5">
              <CustomerIcon width='16'/>
              <Body className='text-dark-gray inline-flex'>{profile.role}</Body>
            </div>
          </div>
        </div>
        <div className="flex basis-2/3 justify-center items-center gap-2.5 overflow-hidden">
            <div className="inline-flex flex-col justify-center items-center">
                <Subtitle className=''>{profile.trip_count}</Subtitle>
                <SubBody className='text-gray'>trips planned</SubBody>
            </div>
            <div className="w-20 inline-flex flex-col justify-center items-center">
                <Subtitle className=''>{profile.review_count}</Subtitle>
                <SubBody className='text-gray'>reviews</SubBody>
            </div>
            <div className="w-20 inline-flex flex-col justify-center items-center">
                <Subtitle className=''>{profile.booking_count}</Subtitle>
                <SubBody className='text-gray'>bookings</SubBody>
            </div>
        </div>
      </div>
      <div className="px-7 py-5 rounded-2xl bg-white shadow-[var(--light-shadow)] flex flex-col justify-center gap-4">
        <Subtitle>Planned Trips</Subtitle>
        <div className='flex flex-wrap'>
          {profile.trips?.map((trip, idx) => (
            // <TripCard key={idx} {...trip} />
            ''
          ))}
        </div>
      </div>
    </div>
    </DefaultLayout>
);
}
