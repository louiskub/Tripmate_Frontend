"use client"
import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, GenderInput, MaleGender, OtherGender } from '@/components/inputs/gender-input'
import { Button, TextButton } from '@/components/buttons/buttons'
import { Tag } from '@/components/services/other/Tag'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import { endpoints } from '@/config/endpoints.config'
import ImageSlide from '@/components/services/other/image-slide';
import StarIcon from '@/assets/icons/star-filled.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import ClockIcon from '@/assets/icons/Clock.svg'
import { useBoolean } from '@/hooks/use-boolean'
import RestaurantCardProps from '@/models/service/card/restaurant-card';

import {ratingText} from '@/utils/service/rating'

import FavoriteButton from '@/components/services/other/favorite-button'

import { useRouter } from "next/navigation"


const RestaurantCard = (service: RestaurantCardProps) => {
    const router = useRouter();
    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5
                    hover:bg-dark-white hover:cursor-pointer"
            onClick={() => router.push(paths.restaurant.detail(service.id))}>
            <ImageSlide pictures={service.pictures}>
                <FavoriteButton favorite={service.favorite ?? false} id={service.id} type='service'/>
            </ImageSlide>

            <div className="w-full flex overflow-hidden">
                <div className="flex flex-col flex-1">
                    <div className='flex flex-col flex-1 gap-2'>
                        <Subtitle className='max-w-full line-clamp-2 leading-6'>{service.name}</Subtitle>
                        
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
                        <div className="flex gap-[3px] pl-1">
                            <ClockIcon width='12' className='self-start mt-0.5'/>
                            <div className='flex flex-col'>
                                {service.open.map((o, i) => <Caption key={i}>{o.day} {o.open} - {o.close}</Caption>)}
                            </div>
                        </div>
                    </div>
                    
                    {service.tag && <Tag text={service.tag} />}
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard