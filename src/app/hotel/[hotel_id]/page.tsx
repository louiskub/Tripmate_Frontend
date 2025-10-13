"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import ServiceNavTab from '@/components/services/tabs/service-nav-tab'
import { useState, useEffect, ReactNode } from 'react';

import {Title, Caption, SubBody, Subtitle, Body, ButtonText, SmallTag} from '@/components/text-styles/textStyles'
import ServicePictures from '@/components/services/other/service-pictures'
import FavoriteButton from '@/components/services/other/favorite-button'
import { Tag } from '@/components/services/other/Tag';
import { Button, TextButton } from '@/components/buttons/buttons';
import { RatingOverview, Rating } from '@/components/services/other/rating';
import MiniMap from '@/components/other/mini-map';
import LargeMap from '@/components/other/large-map';
import RoomDetail from '@/components/services/other/room-detail'

import QuestionIcon from '@/assets/icons/question.svg'
import BulletIcon from '@/assets/icons/bullet.svg'
import StarIcon from '@/assets/icons/star-filled.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import ClockIcon from '@/assets/icons/Clock.svg'

import { mockHotel1 } from '@/mocks/hotels'
import { hotelRatingMeta } from '@/utils/service/rating';

export default function HotelDetail() {
  const [currentTab, setCurrentTab] = useState("overview");

type tab = {
    label: string
    id: string
}

  const tabs: tab[] = [
        {label: 'Overview', id: 'overview'},
        {label: 'Rooms', id: 'room'},
        {label: 'Facilities', id: 'facility'},
        {label: 'Reviews', id: 'review'},
        {label: 'Location', id: 'location'},
        {label: 'Policy', id: 'policy'},
  ]
  
  type facility = {
    label: string
    id: 'internet' | 'food' | 'health' | 'accessibility' | 'transportation' | 'services'
    icon: ReactNode
  }

  const facilitiesMeta: facility[] = [
    {
      label: 'Internet Access',
      id: 'internet',
      icon: <QuestionIcon width='16' />
    },
    {
      label: 'Food and Drinks',
      id: 'food',
      icon: <QuestionIcon width='16' />
    },
    {
      label: 'Health & Wellness',
      id: 'health',
      icon: <QuestionIcon width='16' />
    },
    {
      label: 'Accessibility',
      id: 'accessibility',
      icon: <QuestionIcon width='16' />
    },
    {
      label: 'Transportation',
      id: 'transportation',
      icon: <QuestionIcon width='16' />
    },
    {
      label: 'Hotel Services',
      id: 'services',
      icon: <QuestionIcon width='16' />
    },
  ]

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentTab(entry.target.id);
          }
        });
      },
      {
        root: null,          // viewport
        rootMargin: "-50% 0px -50% 0px", // trigger when section center is near middle
        threshold: 0,        // or small number like 0.1
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const hotel = mockHotel1

  const rooms = hotel.rooms;

  const starting_price = Math.min(
    ...rooms.flatMap((room) => room.room_options.map((opt) => opt.price))
  );

  const first_comment: string | undefined = hotel.review[0]?.comment;


  console.log(starting_price)

  return (
    <DefaultPage current_tab='hotel'>
      <SearchServiceInput/>
      <ServiceNavTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>
      <div className="p-2 flex justify-between items-center">
        <Body> 
          {`Hotel > ${hotel.location} > `} 
          <TextButton className='text-dark-blue'>{hotel.name}</TextButton>
        </Body>
        <ButtonText className='text-dark-blue font-medium'>See all hotels in {hotel.location}</ButtonText>
      </div>
      <section id='overview' className='rounded-[10px] flex flex-col gap-2'>
        <ServicePictures pictures={hotel.pictures}>
          <FavoriteButton favorite={false} id={'1'} type='hotel'/>
        </ServicePictures>
        <div className=' rounded-[10px] bg-custom-white shadow-[var(--light-shadow)]'>
          <header className='grid px-4 py-2 grid-cols-2 grid-rows-2 border-b border-light-gray'>
            <Title className=''>{hotel.name}</Title>
              <div className='text-dark-blue  items-center flex gap-1'>
                <Tag className='border border-light-blue bg-pale-blue' text={hotel.type} />
                <span className='flex'>
                    {Array.from({ length: hotel.star }).map((_, i) => (
                        <StarIcon key={i} width="14" />
                    ))}
                </span>
              </div>
              <div className='flex items-center justify-end gap-2 col-start-2 row-start-1 row-span-2'>
                <span className='flex items-baseline gap-1'>
                    <Body className='text-dark-gray'>From</Body>
                    <Title className='text-dark-blue'>฿</Title>
                    <Title className='text-dark-blue'>{starting_price}</Title>
                </span>
                <Button
                  text='Select Rooms'
                  className='bg-dark-blue rounded-[10px] px-2.5! text-white hover:bg-darker-blue border-b-3 active:scale-[98%]'
                />
              </div>
          </header>

          <div className='grid grid-cols-[1fr_1fr_auto] grid-rows-[1fr_auto] p-2.5 gap-2.5'>
            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px]'>
              <ButtonText className='text-dark-blue'>Facilities</ButtonText>
              <ul className='grid grid-cols-2 gap-2 mt-2'>
              {facilitiesMeta.map((meta) => {
                const items = hotel.facilities[meta.id].slice(0,2);
                if (!items) return null;

                return items.map((item) => (
                  <li key={item} className='flex gap-1.5'>
                    <BulletIcon width='12'/>
                    <Caption>{item}</Caption>
                  </li>
                ))})}
              </ul>
            </div>

            <RatingOverview 
              className='col-start-2' 
              rating={hotel.rating} 
              rating_count={hotel.rating_count} 
              subtopic_ratings={hotel.subtopic_ratings} 
              comment={first_comment} 
              rating_meta={hotelRatingMeta}
            />

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px]'>
                <MiniMap location_link=''/>
                <ul>
                  {
                    hotel.nearby_locations.slice(0, 4).map((location,idx) => (
                      <li key={idx} className='flex gap-1.5'>
                        <LocationIcon width='12'/>
                        <Caption>{location}</Caption>
                      </li>
                    ))
                  }
                </ul>
                
            </div>

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] row-start-2 col-span-3'>
              <ButtonText className='text-dark-blue'>Description</ButtonText>
              <Caption>{hotel.description}</Caption>
            </div>

          </div>
        </div>
      </section>

      <section id='room' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4'>Rooms</Title>
        {
          hotel.rooms.map((room) => (
            <RoomDetail 
              key={room.name}
              room={room}/>
          ))
        }
      </section>

      <section id='facility' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4'>Facilities</Title>
        <div className='flex flex-wrap px-4 py-2 gap-y-6'>
          {
            facilitiesMeta.map((meta) => {
              const items = hotel.facilities[meta.id];
              if (!items || items.length === 0) return null;
              return (
                <div key={meta.id}  className="flex flex-col items-start basis-1/3 gap-2">
                  <ButtonText className='flex gap-1'>{meta.icon} {meta.label}</ButtonText>
                    <ul className="list-none flex flex-col gap-0.5 ml-1">
                      {items.map((item) => (
                        <li key={item} className='flex gap-1.5'>
                          <BulletIcon width='12'/>
                          <Caption>
                            {item}
                          </Caption>
                        </li>
                      ))}
                    </ul>
                </div>
              )
            })
          }
        </div>
      </section>

      <section id='review' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className=' py-1.5 px-4'>Reviews</Title>
        <Rating 
          rating={hotel.rating}
          rating_count={hotel.rating_count}
          subtopic_ratings={hotel.subtopic_ratings}
          reviews={hotel.review}
          rating_meta={hotelRatingMeta} />
      </section>

      <section id='location' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4 mb-2'>Location</Title>
        <div className='flex gap-5'>
          <LargeMap 
          location_link=''
          className='basis-3/5'
          />
          <div className='basis-2/5'>
            <ul className='grid grid-cols-2 w-full py-2 gap-2.5'>
              {
                hotel.nearby_locations.map((location,idx) => (
                  <li key={idx} className='flex gap-1.5'>
                    <LocationIcon width='12'/>
                    <Caption>{location}</Caption>
                  </li>
                ))
              }
            </ul>
            <TextButton className='text-dark-blue'>
              <SubBody>View on map</SubBody>
            </TextButton>
          </div>
        </div>
      </section>

      <section id='policy' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4 mb-2'>Policy</Title>
        <div className='flex flex-col px-4 py-2 gap-3'>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <ClockIcon width='16' className='text-custom-gray self-center'/>
            <SubBody className='font-semibold col-start-2'>Check-in/Check-out</SubBody>
            <span className='col-start-2 flex  gap-1.5'>
              <SubBody className='text-custom-gray'>Check-in:</SubBody>
              <SubBody className='font-semibold'>{hotel.policy.check_in}</SubBody>
              <SubBody className='text-custom-gray'>Check-out:</SubBody>
              <SubBody className='font-semibold'>{hotel.policy.check_out}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1.5'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <SubBody className='font-semibold col-start-2'>Breakfast</SubBody>
            <span className='col-start-2 flex gap-1'>
              <SubBody className='text-custom-gray'>Opening hours:</SubBody>
              <SubBody className='font-semibold'>{hotel.policy.breakfast}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Pets</SubBody>
              <SubBody className='text-custom-gray'>{hotel.policy.pet_allow ? 'allowed' : 'not allowed'}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Contact</SubBody>
              <SubBody className='text-custom-gray'>{hotel.policy.contact}</SubBody>
            </span>
          </div>
        </div>
      </section>
    </DefaultPage>
  );
}
