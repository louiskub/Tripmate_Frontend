"use client"

import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption, Title} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { Tag } from '@/components/services/other/Tag'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import { endpoints } from '@/config/endpoints.config'
import ImageSlide from '@/components/services/other/image-slide';

import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import ProfileIcon from '@/assets/icons/profile-filled.svg'
import StarIcon from "@/assets/icons/star-filled.svg"
import ClockIcon from "@/assets/icons/Clock.svg"

import { useBoolean } from '@/hooks/use-boolean'

import {ratingText} from '@/utils/service/rating'
import { formatDurationHHMM } from '@/utils/service/string-formatter';
import FavoriteButton from '@/components/services/other/favorite-button'

import { useRouter } from "next/navigation"
import GuideCardProps from '@/models/service/card/guide-card';

const GuideCard = (service: GuideCardProps) => {
    const router = useRouter();
    // const duration = formatDurationHHMM(service.duration);
    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5
                    hover:bg-dark-white hover:cursor-pointer"
            onClick={() => router.push(paths.guide.detail(service.id))}>
            <ImageSlide pictures={service.pictures}>
                <FavoriteButton favorite={service.favorite ?? false} id={service.id} type='service'/>
            </ImageSlide>

            <div className="w-full flex overflow-hidden">
                <div className='flex flex-col flex-1 gap-2'>
                    <div className='ml-1'>
                        <div 
                        onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault()
                                window.location.href = paths.other_profile(service.guider.user_id)
                            }}
                            className='flex gap-1 items-center text-dark-gray mb-1'>
                            <div className='w-4 aspect-square'>
                                {service.guider.profile_pic ?
                                    <img src={service.guider.profile_pic} className='object-cover w-full h-full rounded-full'/> :
                                    <ProfileIcon className='text-custom-gray'/>
                                }
                            </div>
                            <Caption>{service.guider.name}</Caption>
                        </div>
                        <Subtitle className='max-w-full line-clamp-2 leading-6'>{service.name}</Subtitle>
                    </div>
                    
                    
                    <div className="inline-flex items-center gap-1">
                        {
                            service.type?.map((tag, idx) =>
                                <Tag text={tag} key={idx}/>
                            )
                        }
                        {/* <div className="inline-flex items-center gap-1 pl-1 text-dark-gray">
                            <ClockIcon width='10'/>
                            <Caption>{duration}</Caption>
                        </div> */}
                    </div>

                    {service.rating_count ? 
                        <div className="inline-flex items-center gap-[3px] mt-2">
                            <Tag text={(service.rating).toString()} /> 
                            <Caption className='text-dark-blue'>{ratingText(service.rating)}</Caption>
                        </div>
                        :
                        <div className="inline-flex items-center gap-[3px] mt-2">
                            <Tag text='0' /> 
                            <Caption className='text-dark-blue font-semibold!'>no rating</Caption>
                        </div>}
                    
                    {service.location && <div className="inline-flex items-center gap-[3px] pl-1">
                        <LocationIcon width='12'/>
                        <Caption>{service.location}</Caption>
                    </div>}
                </div>
                <div className="self-stretch h-full inline-flex flex-col justify-end items-end gap-2">
                <span className='flex items-baseline gap-1'>
                    <Body className='text-dark-blue'>฿</Body>
                    <Title className='text-dark-blue'>{service.price}</Title>
                    <Body className='text-gray'>/day</Body>
                </span>
                </div>
            </div>
        </div>
    )
}

export default GuideCard