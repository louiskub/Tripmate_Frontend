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

async function getService(): Promise<RentalCarCardProps[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    try {
      
      const response = await axios.get(endpoints.rental_car.all, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  const data = response.data;
  const services: RentalCarCardProps[] = data.map((d: any) => ({
    name: d.name ?? '',
    owner: {
      id: d.crcId ?? '',   
      profile_pic: '',     // no profile_pic
      name: '',            // no owner name
    },
    rating: d.rating ?? 0, //ไม่มี
    rating_count: d.service?.reviews?.length ?? 0, //none
    location: d.service?.location?.zone ?? '',     // if location exists
    price: d.pricePerDay ? Number(d.pricePerDay) : 0, // convert string to number
    brand: d.brand ?? '',
    model: d.model ?? '',
    pictures: d.pictures?.slice(0, 3) ?? [],
    favorite: d.favorite ?? false,
    id: d.id ?? '',
  }));


  return services
  } 
    catch (error: any) {
      console.log("API Error:", error.response?.data || error.message);
      throw error
    } 
}

export default async function AllRentalCar() {
  const services = await getService()

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
        <div className='flex flex-shrink-0 flex-col w-60 gap-2.5'>
          <ServiceFilter/>
          <ServiceFilter/>
          <ServiceFilter/>
        </div>
      </div>
      
    </DefaultPage>
  );
}
