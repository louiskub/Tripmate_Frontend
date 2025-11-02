import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import HotelCard from '@/components/services/service-card/hotel-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
// import { hotels } from '@/mocks/hotels';
import { cookies } from 'next/headers';
import { endpoints } from '@/config/endpoints.config';
import HotelCardProps from '@/models/service/card/hotel-card';
import axios from 'axios';

async function getHotel(key: string): Promise<HotelCardProps[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    try {
      console.log(endpoints.hotel.all(key))
      const response = await axios.get(endpoints.hotel.all(key), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.data;
      console.log(response)
            
      const hotels: HotelCardProps[] = data.map((d: any) => {
        const prices = d.rooms?.flatMap((r: any) => r.room_options?.map((opt: any) => opt.price) ?? []) ?? [];

        return {
          ...d,
          rating_count: d.service?.reviews?.length ?? 0,
          location: d.service.location.zone ?? '',
          price: prices.length ? Math.min(...prices) : 0, // fallback to 0 if no price
          pictures: d.pictures?.slice(0, 3) ?? [],
          favorite: d.favorite ?? false,
        };
      });

      return hotels
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

export default async function AllHotel({ searchParams }: PageProps) {
  const key = await searchParams.q ?? ''
  const hotels = await getHotel(key)
  return (
    <DefaultPage current_tab='hotel'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between p-2.5'>
            <Body>Found {hotels ? hotels.length : 0} hotels</Body>
          </span>
          {hotels?.map((hotel, idx) => (
            <HotelCard key={idx} {...hotel}/>
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
