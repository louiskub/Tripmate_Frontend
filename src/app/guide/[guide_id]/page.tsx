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
import { formatDurationHHMM } from '@/utils/service/string-formatter';
import { formatPrice } from '@/utils/service/string-formatter';

import { guideRatingMeta } from '@/utils/service/rating';

import MiniMap from '@/components/other/mini-map';
import LargeMap from '@/components/other/large-map';

import ContactIcon from '@/assets/icons/telephone.svg'
import CheckIcon from '@/assets/icons/bullet.svg'
import GuestIcon from '@/assets/icons/max-guest.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import ClockIcon from '@/assets/icons/Clock.svg'
import ProfileIcon from '@/assets/icons/profile.svg'

import { guide_detail } from '@/mocks/guide';
import ImageSlide from '@/components/services/other/image-slide';

export default function GuideDetail() {
  const [currentTab, setCurrentTab] = useState("overview");

type tab = {
    label: string
    id: string
}

  const tabs: tab[] = [
        {label: 'Overview', id: 'overview'},
        {label: 'Reviews', id: 'review'},
        {label: 'Location', id: 'location'},
        {label: 'Info', id: 'info'},
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

  const service = guide_detail

  const first_comment = service.review?.find(a => a.comment)?.comment;
  const duration = formatDurationHHMM(service.duration);

  const handleBookGuide = () => {

  }

  return (
    <DefaultPage current_tab='guide'>
      <SearchServiceInput/>
      <ServiceNavTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>
      <div className="p-2 flex justify-between items-center">
        <Body> 
          {`Guides > ${service.location} > `} 
          <TextButton className='text-dark-blue'>{service.name}</TextButton>
        </Body>
        <ButtonText className='text-dark-blue font-medium'>See all guides in {service.location}</ButtonText>
      </div>
      <section id='overview' className='rounded-[10px] flex flex-col gap-2'>
        <ServicePictures pictures={service.pictures}>
          <FavoriteButton favorite={false} id={'1'} type='guide' large/>
        </ServicePictures>
        <div className=' rounded-[10px] bg-custom-white shadow-[var(--light-shadow)]'>
          <header className='grid px-4 py-3 grid-cols-2 gap-1 grid-rows-[auto_auto_auto] border-b border-light-gray'>
            <div className='flex gap-1 items-center text-dark-gray'>
              <div className='w-4 aspect-square'>
                {service.guider.profile_pic ?
                    <img src={service.guider.profile_pic} className='object-cover w-full h-full rounded-full'/> :
                    <ProfileIcon className='text-custom-gray'/>
                }
              </div>
              <Caption>{service.guider.first_name} {service.guider.last_name}</Caption>
            </div>
            <Title className=''>{service.name}</Title>
            <div className='items-center'>
              <Tag text={service.type} />
              <div className="inline-flex items-center gap-1 pl-1 text-dark-gray">
                <ClockIcon width='10'/>
                <Caption>{duration}</Caption>
              </div>
            </div>
            <div className='flex items-center justify-end gap-2 col-start-2 row-start-1 row-span-3'>
              <span className='flex items-baseline gap-1'>
                  <Title className='text-dark-blue font-medium'>฿</Title>
                  <Title className='text-dark-blue'>{formatPrice(service.price)}</Title>
              </span>
              <Button
                text='Book'
                className='bg-dark-blue rounded-[10px] px-6! text-white hover:bg-darker-blue border-b-3 active:scale-[98%]'
                onClick={handleBookGuide}
              />
            </div>
          </header>

          <div className='grid grid-cols-[1fr_auto] grid-rows-[1fr_auto] p-2.5 gap-2.5'>
            <RatingOverview 
              className='row-start-1 col-start-1' 
              rating={service.rating} 
              rating_count={service.rating_count}
              subtopic_ratings={service.subtopic_ratings}
              comment={first_comment}
              rating_meta={guideRatingMeta}
            />

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] row-start-1 col-start-2'>
                <MiniMap location_link=''/>
                <ul>
                  {
                    service.nearby_locations.slice(0, 4).map((location,idx) => (
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
              <Caption>{service.description || 'no description for this rentaurant'}</Caption>
            </div>

          </div>
        </div>
      </section>

      <section id='review' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className=' py-1.5 px-4'>Reviews</Title>
        {
          service.rating_count > 0 ?
          <Rating 
            rating={service.rating}
            rating_count={service.rating_count}
            reviews={service.review} 
            subtopic_ratings={service.subtopic_ratings}
            rating_meta={guideRatingMeta}
          />
          :
          <Caption className='text-gray flex items-center h-8 pl-6'>
            there is currently no review for this guide.
          </Caption>
        }
        
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
                service.nearby_locations.map((location,idx) => (
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

      <section id='info' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4 mb-2'>Policy</Title>
        <div className='flex flex-col px-4 py-2 gap-3'>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <ClockIcon width='16' className='text-custom-gray self-center'/>
            <SubBody className='font-semibold col-start-2'>Start/End</SubBody>
            <span className='col-start-2 flex  gap-1.5'>
              <SubBody className='text-custom-gray'>Start:</SubBody>
              <SubBody className='font-semibold'>{service.policy.start}</SubBody>
              <SubBody className='text-custom-gray'>End:</SubBody>
              <SubBody className='font-semibold'>{service.policy.end}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1.5'>
            <GuestIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Max Guests</SubBody>
              <SubBody className='text-custom-gray'>{service.policy.max_guest ? service.policy.max_guest : '-'}</SubBody>
            </span>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-1'>
            <ContactIcon width='16' className='text-custom-gray self-center'/>
            <span className='col-start-2 flex gap-1.5'>
              <SubBody className='font-semibold'>Contact</SubBody>
              <SubBody className='text-custom-gray'>{service.policy.contact ? service.policy.contact : '-'}</SubBody>
            </span>
          </div>
        </div>
      </section>
    </DefaultPage>
  );
}
