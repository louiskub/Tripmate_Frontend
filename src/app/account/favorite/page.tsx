'use client'

import ProfilePageLayout from '@/components/layout/profile-page-layout';
import { Button, TextButton } from '@/components/buttons/buttons'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { paths } from '@/config/paths.config'

import HotelCard from '@/components/services/service-card/hotel-card';
import RestaurantCard from '@/components/services/service-card/restaurant-card';
import RentalCarCard from '@/components/services/service-card/rental-car-card';
import GuideCard from '@/components/services/service-card/guide-card';
import AttractionCard from '@/components/services/service-card/attraction-card';
// import TripCard from '@/components/services/service-card/trip-card'
import { FavoriteProps } from '@/models/favorite';
import { favorite_data_mock } from '@/mocks/favorite';

import { useState } from 'react';

export default function Favorite() {
  const [currentTab, setCurrentTab] = useState("hotel");

  const data: FavoriteProps = favorite_data_mock

  const currentServices = data[currentTab as keyof FavoriteProps]

  const tabs: tab[] = [
        {label: 'Hotel', id: 'hotel'},
        {label: 'Restaurant', id: 'restaurant'},
        {label: 'Rental Car', id: 'rental_car'},
        {label: 'Guide', id: 'guide'},
        {label: 'Attraction', id: 'attraction'},
        {label: 'Trip', id: 'trip'},
  ]

  return (
    <ProfilePageLayout>
        <div className="flex-1 px-5 py-2.5 flex flex-col gap-2.5">
          <div className='flex justify-between'>
              <PageTitle>Favorite</PageTitle>
          </div>
          
          <FavoriteTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>

          <span className='flex justify-between p-1'>
            <Body>{currentServices && currentServices.length > 0 ? currentServices.length: 'No favorite'} {currentTab} found.</Body>
          </span>
          
          <div className="rounded-[10px] border-b border-light-gray flex flex-col">
            {currentTab === 'hotel' && data.hotel?.map(card => <HotelCard key={card.id} {...card} />)}
            {currentTab === 'restaurant' && data.restaurant?.map(card => <RestaurantCard key={card.id} {...card} />)}
            {currentTab === 'rental_car' && data.rental_car?.map(card => <RentalCarCard key={card.id} {...card} />)}
            {currentTab === 'guide' && data.guide?.map(card => <GuideCard key={card.id} {...card} />)}
            {currentTab === 'attraction' && data.attraction?.map(card => <AttractionCard key={card.id} {...card} />)}
            {/* {currentTab === 'trip' && data.trip?.map((trip, i) => <TripCard key={i} trip={trip} />)} */}
          </div>    
      </div>
    </ProfilePageLayout>
  );
}

type tab = {
  label: string
  id: string
}

type TabProps = {
  current_tab: string;
  onSelect: (tab_id: string) => void;
  tabs: tab[]
}

const FavoriteTab = ({current_tab, onSelect, tabs}: TabProps) => {
    return (
        <div className='sticky top-15 z-10 flex gap-2.5 px-2 text-custom-gray items-center bg-custom-white mt-2 h-9.5 rounded-lg shadow-[var(--boxshadow-lifted)]'>
            {tabs.map((tab) => (
                <Button 
                    onClick={ () => {
                        onSelect(tab.id)
                        document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`h-7! rounded-md px-4! ${
                        current_tab === tab.id 
                        ? 'bg-pale-blue text-dark-blue'
                        : 'hover:text-dark-blue'
                    }`}
                    key={tab.id}
                    text={tab.label}
                />
            ))}
        </div>
    )
}
