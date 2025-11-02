"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import ServiceNavTab from '@/components/services/tabs/service-nav-tab'
import { useState, useEffect } from 'react';

import {Title, Caption, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import ServicePictures from '@/components/services/other/service-pictures'
import FavoriteButton from '@/components/services/other/favorite-button'
import { Tag } from '@/components/services/other/Tag';
import { TextButton } from '@/components/buttons/buttons';
import { RatingOverview, Rating, RatingPopup } from '@/components/services/other/rating';
// import MiniMap from '@/components/other/mini-map';
import LargeMap from '@/components/other/large-map';

import CheckIcon from '@/assets/icons/bullet.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'

import PriceCard from '@/components/services/other/price_card';

import AttractionDetailModel from '@/models/service/detail/attraction-detail';
import { PicturePopup } from '@/components/services/other/service-pictures';

import MiniMap from '@/components/map/minimap';

type AttractionDetailProps = {
  service: AttractionDetailModel
}

export default function AttractionDetail( {service} : AttractionDetailProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [PicturePopUp, setPicturePopUp] = useState(false);

type tab = {
    label: string
    id: string
}

  const tabs: tab[] = [
        {label: 'Overview', id: 'overview'},
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


  return (
    <DefaultPage current_tab='attraction'>
      <SearchServiceInput/>
      <ServiceNavTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>
      <div className="p-2 flex justify-between items-center">
        <Body> 
          {`Restaurant > ${service.location} > `} 
          <TextButton className='text-dark-blue'>{service.name}</TextButton>
        </Body>
        <ButtonText className='text-dark-blue font-medium'>See all restaurants in {service.location}</ButtonText>
      </div>
      <section id='overview' className='rounded-[10px] flex flex-col gap-2'>
        <ServicePictures pictures={service.pictures} onClick={() => setPicturePopUp(true)}>
          <FavoriteButton favorite={service.favorite ?? false} id={service.id} type='place' large/>
        </ServicePictures>
        {PicturePopUp && 
          <PicturePopup pictures={service.pictures}
            name={service.name}
            Close={() => setPicturePopUp(false)}>
          </PicturePopup>}
        <div className='rounded-[10px] bg-custom-white shadow-[var(--light-shadow)]'>
          <header className='grid px-4 py-2 grid-rows-2 border-b border-light-gray'>
            <Title className=''>{service.name}</Title>
            {service.type && <div>
              <Tag text={service.type} />
            </div>}
              {/* <div className='flex items-center justify-end gap-2 col-start-2 row-start-1 row-span-2'>
                <span className='flex items-baseline gap-1'>
                    {lowest_fee > 0 ?
                    <>   
                    <Caption className='text-dark-gray'>From</Caption>
                    <SubBody className='text-dark-blue'>฿</SubBody>
                    <ButtonText className='text-dark-blue'>{lowest_fee}</ButtonText>
                    </>
                    :
                    <ButtonText className='text-dark-blue'>Free</ButtonText>}
                </span>
              </div> */}
          </header>

          <div className='grid grid-cols-[1fr_auto] p-2.5 gap-2.5'>
            {/* <RatingOverview 
              className=' row-start-1 col-start-1' 
              rating={service.rating} 
              rating_count={service.rating_count} 
              comment={first_comment} 
            /> */}

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] row-start-1 col-start-2'>
                <MiniMap lat={service.lat} long={service.long} name={service.name} />
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

            <div className='flex flex-col gap-2.5 p-2.5 border border-light-gray rounded-[10px] col-start-1'>
              <ButtonText className='text-dark-blue'>Description</ButtonText>
              <Caption>{service.description || 'no description for this rentaurant'}</Caption>
            </div>

          </div>
        </div>
      </section>

      {/* <section id='fee' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className='border-b border-light-gray py-1.5 px-4'>Admission Fee</Title>
        {lowest_fee ?
        <div className='flex justify-center px-4 py-5'>
          {Object.entries(fee_groups).map(([groupName, items]) => (
          <div key={groupName} className="flex flex-col gap-4 px-10">
            <Subtitle className="text-gray">{groupName}</Subtitle>
              {items.map((item: any) => (
                <PriceCard key={item.title} name={item.title} price={item.price} per='one-time' />
              ))}
          </div>
      ))}
      </div>
        :
        <SubBody className='p-4 flex gap-1'>
          <CheckIcon width='16' className='text-green'/>
          Admission is free at this service.
        </SubBody>
        }
        
      </section> */}

      {/* <section id='review' className='bg-custom-white mt-4 p-2.5 rounded-[10px] shadow-[var(--light-shadow)]'>
        <Title className=' py-1.5 px-4'>Reviews</Title>
        <Rating 
          rating={service.rating}
          rating_count={service.rating_count}
          reviews={service.review} 
          />
      </section> */}

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
    </DefaultPage>
  );
}
