"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import HotelCard from '@/components/services/service-card/hotel-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import HotelCardProps from '@/models/service/card/hotel-card';

const hotels: HotelCardProps[] = [
  {
    name: 'Centre Point Prime Hotel Pattaya',
    star: 5,
    rating: 8.7,
    rating_count: 1808,
    location: 'South Pattaya, Pattaya',
    price: 1809.33,
    type: 'hotel',
    pictures: 
      ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
      ],
    favorite: true,
    hotel_id: '1'
  },
  {
    name: 'Centre Point Prime Hotel Pattaya',
    star: 5,
    rating: 8.7,
    rating_count: 1808,
    location: 'South Pattaya, Pattaya',
    price: 1809.33,
    type: 'hotel',
    pictures: 
      ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
      ],
    favorite: false,
    hotel_id: '2'
  }
]

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
