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

import { restaurant_detail } from '@/mocks/restaurants';
import ImageSlide from '@/components/services/other/image-slide';

import { restaurantRatingMeta } from '@/utils/service/rating';

export default function AllHotel() {
  const [currentTab, setCurrentTab] = useState("overview");

type tab = {
    label: string
    id: string
}

  const tabs: tab[] = [
        {label: 'Overview', id: 'overview'},
        {label: 'Menu', id: 'menu'},
        {label: 'Reviews', id: 'review'},
        {label: 'Location', id: 'location'},
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

  const restaurant = restaurant_detail

  const first_comment: string | undefined = restaurant.review[0]?.comment;

  const handleBookRestaurant = () => {
  
  }

  return (
    <DefaultPage current_tab='restaurant'>
      <SearchServiceInput/>
      <ServiceNavTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>
      <div className="p-2 flex justify-between items-center">
        <Body> 
          {`Restaurant > ${restaurant.location} > `} 
          <TextButton className='text-dark-blue'>{restaurant.name}</TextButton>
        </Body>
        <ButtonText className='text-dark-blue font-medium'>See all restaurants in {restaurant.location}</ButtonText>
      </div>
      <section id='overview' className='rounded-[10px] flex flex-col gap-2'>
        <ServicePictures pictures={restaurant.pictures}>
          <FavoriteButton favorite={false} hotel_id={'1'}/>
        </ServicePictures>
        <div className=' rounded-[10px] bg-custom-white shadow-[var(--light-shadow)]'>
          <header className='grid px-4 py-2 grid-cols-2 grid-rows-2 border-b border-light-gray'>
            <Title className=''>{restaurant.name}</Title>
            <div>
              <Tag text={restaurant.tag} />
            </div>
              <div className='flex items-center justify-end gap-2 col-start-2 row-start-1 row-span-2'>
                <Button
                  text='Book'
                  className='bg-dark-blue rounded-[10px] px-6! text-white hover:bg-darker-blue border-b-3 active:scale-[98%]'
                  onClick={handleBookRestaurant}
                />
              </div>
          </header>

          <div className='grid grid-cols-[1fr_auto] grid-rows-[1fr_auto] p-2.5 gap-2.5'>
            <RatingOverview 
              className=' row-start-1 col-start-1' 
              rating={restaurant.rating} 
              rating_count={restaurant.rating_count} 
              subtopic_ratings={restaurant.subtopic_ratings} 
              comment={first_comment} 
              rating_meta={restaurantRatingMeta}
            />

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] row-start-1 col-start-2'>
                <MiniMap location_link=''/>
                <ul>
                  {
                    restaurant.nearby_locations.slice(0, 4).map((location,idx) => (
                      <li key={idx} className='flex gap-1.5'>
                        <LocationIcon width='12'/>
                        <Caption>{location}</Caption>
                      </li>
                    ))
                  }
                </ul>
                
            </div>

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] row-start-2 col-span-2'>
              <ButtonText className='text-dark-blue'>Description</ButtonText>
              <Caption>{restaurant.description}</Caption>
            </div>

          </div>
        </div>
      </section>

      <section id='menu' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4'>Menu</Title>
        <div className='flex justify-center px-4 py-2 gap-y-6'>
          <ImageSlide className='w-3/4 aspect-5/3' pictures={restaurant.menu} />
        </div>
      </section>

      <section id='review' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className=' py-1.5 px-4'>Reviews</Title>
        <Rating 
          rating={restaurant.rating}
          rating_count={restaurant.rating_count}
          subtopic_ratings={restaurant.subtopic_ratings}
          reviews={restaurant.review} 
          rating_meta={restaurantRatingMeta}/>
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
                restaurant.nearby_locations.map((location,idx) => (
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
    </DefaultPage>
  );
}
