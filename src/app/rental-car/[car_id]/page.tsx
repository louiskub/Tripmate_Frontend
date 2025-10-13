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
import ProfileIcon from '@/assets/icons/profile.svg'

import { rental_car_detail } from '@/mocks/rental-cars';
import ImageSlide from '@/components/services/other/image-slide';

import { restaurantRatingMeta } from '@/utils/service/rating';
import PriceCard from '@/components/services/other/price_card';

export default function RentalCarDetail() {
  const [currentTab, setCurrentTab] = useState("overview");

type tab = {
    label: string
    id: string
}

  const tabs: tab[] = [
        {label: 'Overview', id: 'overview'},
        {label: 'Services', id: 'service'},
        {label: 'Reviews', id: 'review'},
        {label: 'Location', id: 'location'},
        {label: 'Policy', id: 'policy'},
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

  const rental_car = rental_car_detail

  const first_comment = rental_car.review?.find(r => r.comment)?.comment;

  const handleBookRentalCar = () => {
  
  }

  return (
    <DefaultPage current_tab='rental_car'>
      <SearchServiceInput/>
      <ServiceNavTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>

      <div className="p-2 flex justify-between items-center">
        <Body> 
          {`Rental Cars > ${rental_car.location} > `} 
          <TextButton className='text-dark-blue'>{rental_car.name}</TextButton>
        </Body>
        <ButtonText className='text-dark-blue font-medium'>See all rental cars in {rental_car.location}</ButtonText>
      </div>

      <section id='overview' className='rounded-[10px] flex flex-col gap-2'>
        <ServicePictures pictures={rental_car.pictures}>
          <FavoriteButton favorite={false} id={'1'} type='rental_car'/>
        </ServicePictures>
        <div className=' rounded-[10px] bg-custom-white shadow-[var(--light-shadow)]'>
          
          <header className='grid px-4 py-3 gap-1 grid-cols-2 grid-rows-[auto_auto_auto] border-b border-light-gray'>
            <div className='flex gap-1 items-center text-dark-gray'>
              <div className='w-4 aspect-square'>
                {rental_car.renter.profile_pic ?
                    <img src={rental_car.renter.profile_pic} className='object-cover w-full h-full rounded-full'/> :
                    <ProfileIcon className='text-custom-gray'/>
                }
              </div>
              <Caption>{rental_car.renter.first_name} {rental_car.renter.last_name}</Caption>
            </div>
            <Title className=''>{rental_car.name}</Title>
            <div>
              <Tag text={rental_car.type} />
            </div>
              <div className='flex items-center justify-end gap-2 col-start-2 row-start-1 row-span-2'>
                <span className='flex items-baseline'>
                    <Title className='text-dark-blue font-medium'>฿</Title>
                    <Title className='text-dark-blue'>{rental_car.price}</Title>
                    <Body className='text-dark-gray'>/day</Body>
                </span>
                <Button
                  text='Book'
                  className='bg-dark-blue rounded-[10px] px-6! text-white hover:bg-darker-blue border-b-3 active:scale-[98%]'
                  onClick={handleBookRentalCar}
                />
              </div>
          </header>

          <div className='grid grid-cols-[1fr_auto] grid-rows-[1fr_auto] p-2.5 gap-2.5'>
            <RatingOverview 
              className=' row-start-1 col-start-1' 
              rating={rental_car.rating} 
              rating_count={rental_car.rating_count} 
              comment={first_comment} 
            />

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] row-start-1 col-start-2'>
                <MiniMap location_link=''/>
                <ul>
                  {
                    rental_car.nearby_locations.slice(0, 4).map((location,idx) => (
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
              <Caption>{rental_car.description || 'no description for this rental car'}</Caption>
            </div>

          </div>
        </div>
      </section>

      <section id='service' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4'>Additional Services</Title>
        <div className='flex justify-center px-4 py-5'>
          <div className='px-10'>
            <PriceCard name={'Deposit'} price={1000} />
          </div>
          <div className='flex flex-col gap-4 border-x border-light-gray px-10'>
            <PriceCard name={'Delivery'} description='in local area' price={500} />
            <PriceCard name={'Delivery'} description='out of local area' price={1000} />
          </div>
          <div className='px-10'>
            <PriceCard name={'Insurance'} price={500} />
          </div>
        </div>
      </section>

      <section id='review' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className=' py-1.5 px-4'>Reviews</Title>
        <Rating 
          rating={rental_car.rating}
          rating_count={rental_car.rating_count}
          reviews={rental_car.review} 
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
                rental_car.nearby_locations.map((location,idx) => (
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
            <SubBody className='font-semibold col-start-2'>Pick-up/Drop-off</SubBody>
            <span className='col-start-2 flex  gap-1.5'>
              <SubBody className='text-custom-gray'>Pick-up:</SubBody>
              <SubBody className='font-semibold'>{rental_car.policy.pick_up}</SubBody>
              <SubBody className='text-custom-gray'>Drop-off:</SubBody>
              <SubBody className='font-semibold'>{rental_car.policy.drop_off}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1.5'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Fuel</SubBody>
              <SubBody className='text-custom-gray'>{rental_car.policy.fuel ? 'The car owner will prepare fuel for you.' : 'Customer needs to refuel on their own. '}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Pets</SubBody>
              <SubBody className='text-custom-gray'>{rental_car.policy.pet_allow ? 'allowed' : 'not allowed'}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Please note</SubBody>
              <SubBody className='text-custom-gray'>if the car is returned damaged or not in a clean condition, extra charges may apply.</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <QuestionIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Contact</SubBody>
              <SubBody className='text-custom-gray'>{rental_car.policy.contact}</SubBody>
            </span>
          </div>
        </div>
      </section>
    </DefaultPage>
  );
}
