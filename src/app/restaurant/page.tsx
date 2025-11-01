"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import RestaurantCard from '@/components/services/service-card/restaurant-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import RestaurantCardProps from '@/models/service/card/restaurant-card';
import { restaurants } from '@/mocks/restaurants';

export default function AllRestaurant() {
  return (
    <DefaultPage current_tab='restaurant'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between  p-2.5'>
            <Body>Found 9999 restaurants</Body>
            <Body>Sort by</Body>
          </span>
          {restaurants.map((restaurant, idx) => (
            <RestaurantCard key={idx} {...restaurant} />
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
