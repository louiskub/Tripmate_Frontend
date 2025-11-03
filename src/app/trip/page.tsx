"use client"

import DefaultPage from '@/components/layout/default-layout'
import SearchServiceInput from '@/components/inputs/search-service-input'
import ServiceFilter from '@/components/inputs/service-filter'
import { Body } from '@/components/text-styles/textStyles'
import TripCard from '@/components/services/service-card/trip-card'
import { trips } from '@/mocks/trips'

export default function AllTrip() {
  return (
    <DefaultPage current_tab='trip'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between p-2.5'>
            <Body>Found {trips.length} trips</Body>
            <Body>Sort by</Body>
          </span>

          {trips.map((trip, idx) => (
            <TripCard key={idx} {...trip} trip_id={trip.id}/>
          ))}
        </div>

        {/* <div className='flex flex-shrink-0 flex-col w-60 gap-2.5'>
          <ServiceFilter/>
          <ServiceFilter/>
          <ServiceFilter/>
        </div> */}
      </div>
    </DefaultPage>
  )
}
