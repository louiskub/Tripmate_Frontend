
import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import RestaurantCard from '@/components/services/service-card/restaurant-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import RestaurantCardProps from '@/models/service/card/restaurant-card';
import { restaurants } from '@/mocks/restaurants';

import { cookies } from 'next/headers';
import { endpoints } from '@/config/endpoints.config';
import axios from 'axios';

async function getService(key:string): Promise<RestaurantCardProps[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    try {
      const response = await axios.get(endpoints.restaurant.all(key), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      console.log(data)
    //       name: string
    // rating: number
    // rating_count: number
    // location: string
    // pictures: Array<string>
    // favorite: boolean
    // tag: string
    // open: {
    //     day: string
    //     open: string
    //     close: string
    // }[]
    // id: string
      const services: RestaurantCardProps[] = data.map((d: any) => {
        return {
          name: d.name,
          rating: d.rating,
          rating_count: d.service?.reviews?.length ?? 0,
          location: d.service.location.zone ?? '',
          pictures: d.pictures?.slice(0, 3) ?? [],
          favorite: d.service.bookmarks.length > 0 ? true: false,
          tag: d.cuisine,
          id: d.id,
          open: d.openingHours || []
        };
      });

      const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(key.toLowerCase())
      );

      return filteredServices
    } 
    catch (error: any) {
      console.log("API Error:", error.response?.data || error.message);
      return null
    } 
}


  interface PageProps {
    searchParams: {
      q?: string;
    };
  }

export default async function AllRestaurant({ searchParams }: PageProps) {
  const key = await searchParams.q ?? ''
  const services = await getService(key)

  return (
    <DefaultPage current_tab='restaurant'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between  p-2.5'>
            <Body>Found {services ? services.length : 0} restaurants</Body>
          </span>
          {services?.map((restaurant, idx) => (
            <RestaurantCard key={idx} {...restaurant} />
          ))}
        </div>
        {/* <div className='flex flex-shrink-0 flex-col w-60 gap-2.5'>
          <ServiceFilter/>
          <ServiceFilter/>
          <ServiceFilter/>
        </div> */}
      </div>
      
    </DefaultPage>
  );
}
