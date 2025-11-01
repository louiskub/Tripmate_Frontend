"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import HotelCard from '@/components/services/service-card/hotel-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { hotels } from '@/mocks/hotels';

export default function AllHotel() {
  return (
    <DefaultPage current_tab='hotel'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between p-2.5'>
            <Body>Found 9999 hotels</Body>
            <Body>Sort by</Body>
          </span>
          {hotels.map((hotel, idx) => (
            <HotelCard key={idx} {...hotel} hotel_id={idx.toString()}/>
          ))}
        </div>
        <div className='flex flex-shrink-0 flex-col w-60 gap-2.5'>
          <ServiceFilter/>
          <ServiceFilter/>
          <ServiceFilter/>
        </div>
      </div>
      
    </DefaultPage>
  );
}
