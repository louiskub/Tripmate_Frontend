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
import { useEffect, useState } from 'react';
import { paths } from '@/config/paths.config'

import CustomerIcon from '@/assets/icons/person.svg'
import ProfilePic from '@/assets/icons/profile-filled.svg';
import MaleIcon from '@/assets/icons/male.svg'
import FemaleIcon from '@/assets/icons/female.svg'

import DefaultLayout from '@/components/layout/default-layout';

import { OtherProfileData } from '@/models/profile';
import { OtherProfileEx } from '@/mocks/profile';
import { getUserIdFromToken } from '@/utils/service/cookie'
import { use } from "react";

import GuideCardProps from '@/models/service/card/guide-card';
import RentalCarCardProps from '@/models/service/card/rental-car-card';

import Cookies from "js-cookie";

import { endpoints } from '@/config/endpoints.config'
import axios from 'axios';
import { useParams } from 'next/navigation';
import GuideCard from '@/components/services/service-card/guide-card';

export default function OtherProfile(){
  const params = useParams();
  const { id } = params;
  if (!id) return;
  const [profile, setProfile] = useState<OtherProfileData>(
    {
      profileImg: '',
      username: '',
      fname: '',
      lname: '',
      gender: null,
      tripCount: 0,
      reviewCount: 0,
      bookingCount: 0,
      role: 'user',
      service: [],
    }
  )

  useEffect(() => {

    const token = Cookies.get("token");

    if (!token) return

    const getProfile = async () => {
    try {
        const res = await axios.get(endpoints.profile(id.toString()), {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        });

        const data = res.data
        console.log(res.data)

        setProfile(prev => ({
        ...prev,       // keep existing default values
        ...data,   // overwrite only the fields present in res.data
        }));

        if (data.role === 'guide') {
          setProfile(prev => ({
            ...prev,
            service: data.service?.filter((s:any) => s.type === 'guide') // only keep guide services
              .map((s:any) => ({
                name: s.name,
                guider: {
                  user_id: id,
                  profile_pic: prev.profileImg,
                  first_name: prev.fname,
                  last_name: prev.lname
                },
                rating: s.rating || 0,
                rating_count: s.ratingCount || 0,
                location: '',
                price: 0,
                type: '',
                pictures: [s.serviceImg],
                favorite: s.favorite,
                id: s.id,
                ...s
              } as GuideCardProps))
          }));
        }
        
        else if (data.role === 'car-manager') {
          setProfile(prev => ({
            ...prev,
            service: data.service?.filter((s:any) => s.type === 'car_rental_center') // only keep guide services
              .map((s:any) => ({
                name: s.name,
                owner: {
                  user_id: id,
                  profile_pic: prev.profileImg,
                  first_name: prev.fname,
                  last_name: prev.lname
                },
                rating: s.rating || 0,
                rating_count: s.ratingCount || 0,
                location: '',
                price: s.rating || 0,
                type: '',
                pictures: [s.serviceImg],
                favorite: s.favorite,
                id: s.id,
                ...s
              } as RentalCarCardProps))
          }));
        }

        else if (data.role === 'user') {
          setProfile(prev => ({
            ...prev,
            service: data.service?.filter((s:any) => s.type === 'guide') // only keep guide services
              .map((s:any) => ({
                name: s.name,
                owner: {
                  user_id: id,
                  profile_pic: prev.profileImg,
                  first_name: prev.fname,
                  last_name: prev.lname
                },
                rating: s.rating || 0,
                rating_count: s.ratingCount || 0,
                location: '',
                price: 0,
                type: '',
                pictures: [s.serviceImg],
                favorite: s.favorite,
                id: s.id,
                ...s
              } as RentalCarCardProps))
          }));
        }

    } catch (err) {
        console.error("Failed to fetch profile", err);
    }
    };

    getProfile();
}, []);

//   {
//     // "username": "aaasss@example.com",
//     // "fname": "JohnDoe45",
//     // "lname": "Doe45",
//     "birthDate": "2000-01-01T00:00:00.000Z", //
//     "phone": "0812345678", //
//     "email": "aaasss@example.com", //
//     // "gender": "Other",
//     // "profileImg": "http://161.246.5.236:9000/avatars/9a088492-b3f8-49f8-a1ce-79db1cb872b6.jpeg",
//     // "tripCount": 0,
//     // "bookingCount": 6,
//     "service": [
//         {
//             "id": "svc-009",
//             "ownerId": "37f66c3b-2edd-4a36-b6db-5dabd2a783c1",
//             "locationId": "loc_009",
//             "name": "DriveEase Car Rental Center",
//             "description": "ศูนย์บริการรถเช่าครบวงจร พร้อมบริการส่งรถถึงที่และทีมดูแลตลอด 24 ชั่วโมง",
//             "serviceImg": "https://example.com/images/driveease-main.jpg",
//             "status": "active",
//             "createdAt": "2025-10-31T14:01:17.329Z",
//             "updatedAt": "2025-10-31T14:01:17.329Z",
//             "deletedAt": null,
//             "type": "car_rental_center",
//             "favorite": false
//         }
//     ]
// }

  return (
    <DefaultLayout current_tab='profile'>
    <div className="flex-1 px-5 py-2.5 flex flex-col gap-5">
      <PageTitle className='px-4'>Profile</PageTitle>
      <div className="px-7 py-5 rounded-2xl bg-white shadow-[var(--light-shadow)] flex items-center justify-between w-full">
        <div className="grid grid-cols-[auto_1fr] gap-6 max-w-1/2">
          <div className="min-w-0 w-28 h-28">
            {profile.profileImg ? 
              <img className="w-28 h-28 rounded-full border border-dark-gray" 
                src={profile.profileImg} 
              />
              :
              <ProfilePic />
            }
          </div>
          <div className="min-w-0 flex flex-col justify-center gap-0.5 ">
            <Title className='px-0.5 gap-2 flex items-center truncate overflow-hidden whitespace-nowrap'>
              {profile.fname} {profile.lname}
              {profile.gender === "female" && <FemaleIcon className='w-4 text-pink-400' />}
              {profile.gender === "male" && <MaleIcon className='w-4 text-dark-blue'/>}
            </Title>
            <div className="flex gap-0.5">
              <Body className='text-gray inline-flex'>@</Body>
              <Body className='text-dark-gray inline-flex'>{profile.username}</Body>
            </div>
            <div className="inline-flex items-center gap-0.5">
              <CustomerIcon width='16'/>
              <Body className='text-dark-gray inline-flex'>
                {profile.role === "user" && "Customer"}
                {profile.role === "car-manager" && "Car Rental"}
                {profile.role === "guide" && "Guide"}
              </Body>
            </div>
          </div>
        </div>
        <div className="flex w-1/2 justify-center items-center gap-2.5 overflow-hidden">
            <div className="inline-flex flex-col justify-center items-center">
                <Subtitle className=''>{profile.tripCount}</Subtitle>
                <SubBody className='text-gray'>trips planned</SubBody>
            </div>
            <div className="w-20 inline-flex flex-col justify-center items-center">
                <Subtitle className=''>{profile.reviewCount}</Subtitle>
                <SubBody className='text-gray'>reviews</SubBody>
            </div>
            <div className="w-20 inline-flex flex-col justify-center items-center">
                <Subtitle className=''>{profile.bookingCount}</Subtitle>
                <SubBody className='text-gray'>bookings</SubBody>
            </div>
        </div>
      </div>
      <div className="px-7 py-5 rounded-2xl bg-white shadow-[var(--light-shadow)] flex flex-col justify-center gap-4">
        <Subtitle>
          { profile.role === 'user' && 'Planned Trips'}
          { profile.role === 'car-manager' && 'Rental Cars'}
          { profile.role === 'guide' && 'Traveling Guides'}
          </Subtitle>
        <div className='flex flex-wrap'>
          {profile.service?.map((service, idx) => {
            // if (profile.role === 'user') return <TripCard key={idx} {...service} />;
            if (profile.role === 'car-manager') return <RentalCarCard key={idx} {...service as RentalCarCardProps} />;
            if (profile.role === 'guide') return <GuideCard key={idx} {...service as GuideCardProps} />;
            return null; // fallback
          })}

        </div>
      </div>
    </div>
    </DefaultLayout>
);
}
