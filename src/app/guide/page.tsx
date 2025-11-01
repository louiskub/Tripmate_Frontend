"use client"

import DefaultPage from '@/components/layout/default-layout';
import SearchServiceInput from '@/components/inputs/search-service-input'
import GuideCard from '@/components/services/service-card/guide-card';
import ServiceFilter from '@/components/inputs/service-filter'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { guides } from '@/mocks/guide';

export default function AllGuides() {
  return (
    <DefaultPage current_tab='guide'>
      <SearchServiceInput/>
      <div className='flex w-full gap-2.5 mt-2'>
        <div className='shadow-[var(--light-shadow)] flex flex-col bg-custom-white rounded-[10px] w-full'>
          <span className='flex justify-between  p-2.5'>
            <Body>Found {guides.length} attractions</Body>
          </span>
          {guides.map((guide, idx) => (
            <GuideCard key={idx} {...guide} />
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
