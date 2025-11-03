import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import RentalCarCard from '@/components/services/service-card/rental-car-card'
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'

import { rental_cars } from '@/mocks/rental-cars'; 
import RentalCarCardProps from '@/models/service/card/rental-car-card';

import { cookies } from 'next/headers';
import { endpoints } from '@/config/endpoints.config';
import axios from 'axios';
import { getCarRentalCenter } from '@/utils/service/get-functions';

async function getService(key: string): Promise<RentalCarCardProps[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    try {
      console.log(endpoints.rental_car.all(key))
      const response = await axios.get(endpoints.rental_car.all(key), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  const data = response.data;
  console.log(data)
  
  const services: RentalCarCardProps[] = await Promise.all(
    data.map(async (d: any) => {
      const car_center = await getCarRentalCenter(d.crcId);
      return {
        name: d.name ?? '',
        owner: {
          id: data.crcId ?? '',   
          profile_pic: car_center?.data.image,     // no profile_pic
          name: car_center?.data.name,            // no owner name
        },
        rating: d.rating ?? 0, //ไม่มี
        rating_count: d.service?.reviews?.length ?? 0, //none
        location: d.service?.location?.zone ?? '',     // if location exists
        price: d.pricePerDay ? Number(d.pricePerDay) : 0, // convert string to number
        brand: d.brand ?? '',
        model: d.model ?? '',
        pictures: d.pictures?.slice(0, 3) ?? [],
        favorite: d.service?.bookmarks.length > 0 ? true: false,
        id: d.id ?? '',
      };
    })
  );

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
export default async function AllRentalCar({ searchParams }: PageProps) {
  const key = await searchParams.q ?? ''
  const services = await getService(key)

  return (
    <DefaultPage current_tab='rental_car'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between p-2.5'>
            <Body>Found {services ? services.length : 0} Rental cars</Body>
          </span>
          {services?.map((car, idx) => (
            <RentalCarCard key={idx} {...car}/>
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
