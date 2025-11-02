import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import GuideCard from '@/components/services/service-card/guide-card';
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { guides } from '@/mocks/guide';
import GuideCardProps from '@/models/service/card/guide-card';
import { getProfile } from '@/utils/service/profile(server)';

import { cookies } from 'next/headers';
import { endpoints } from '@/config/endpoints.config';
import axios from 'axios';

async function getService(): Promise<GuideCardProps[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    try {
      
      const response = await axios.get(endpoints.guide.all, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      console.log(data)
      if(!data) return null

      const services: GuideCardProps[] = await Promise.all(
        data.map(async (d: any) => {
          const profile = await getProfile(d.service.ownerId);

          return {
            name: d.name,
            guider: {
              user_id: d.service.ownerId,
              profile_pic: profile?.profileImg,
              name: `${profile?.fname} ${profile?.lname}`
            },
            rating: d.rating,
            rating_count: d.service?.reviews?.length ?? 0,
            location: d.service.location.zone ?? '',
            price: d.dayRate || 0,
            type: d.specialties,
            pictures: d.pictures?.slice(0, 3) ?? [],
            favorite: d.favorite ?? false,
            id: d.id,
          };
        })
      );
      return services
    } 
    catch (error: any) {
      console.log("API Error:", error.response?.data || error.message);
      throw error
    } 
}


export default async function AllGuides() {
  const services = await getService()
  return (
    <DefaultPage current_tab='guide'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between  p-2.5'>
            <Body>Found {services ? services.length : 0} attractions</Body>
          </span>
          {services?.map((guide, idx) => (
            <GuideCard key={idx} {...guide} />
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
