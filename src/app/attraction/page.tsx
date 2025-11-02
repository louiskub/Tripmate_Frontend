import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import AttractionCard from '@/components/services/service-card/attraction-card';
import AttractionCardProps from '@/models/service/card/attraction-card';
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { attractions } from '@/mocks/attractions';

import { cookies } from 'next/headers';
import { endpoints } from '@/config/endpoints.config';
import axios from 'axios';

async function getService(): Promise<AttractionCardProps[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    try {
      const response = await axios.get(endpoints.attraction.all, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      console.log(data)

  //   id: string;
    // name: string;
    // type: string;
    // pictures: string[];
    // location: string;
    // favorite: boolean;
      
      const services: AttractionCardProps[] = data.map((d: any) => {
        return {
          name: d.name ?? '',
          type: d.type ?? '',
          location: d.zone ?? '',
          pictures: d.pictures?.slice(0, 3) ?? [],
          favorite: d.favorite ?? false,
          id: d.id,
        };
      });

      return services
    } 
    catch (error: any) {
      console.log("API Error:", error.response?.data || error.message);
      throw error
    } 
}

export default async function AllAttraction() {
  const services = await getService()

  return (
    <DefaultPage current_tab='attraction'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between  p-2.5'>
            <Body>Found {services ? services.length : 0} attractions</Body>
          </span>
          {services?.map((attraction, idx) => (
            <AttractionCard key={idx} {...attraction} />
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
