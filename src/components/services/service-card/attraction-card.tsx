import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { Tag } from '@/components/services/other/Tag'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import { endpoints } from '@/config/endpoints.config'
import ImageSlide from '@/components/services/other/image-slide';

import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import { useBoolean } from '@/hooks/use-boolean'

import {ratingText} from '@/utils/service/rating'

import FavoriteButton from '@/components/services/other/favorite-button'
import { useRouter } from "next/navigation"

import Link from "next/link";
import AttractionCardProps from '@/models/service/card/attraction-card';

const AttractionCard = (attraction: AttractionCardProps) => {
    const router = useRouter();
    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5
                    hover:bg-dark-white hover:cursor-pointer"
            onClick={() => router.push(paths.attraction.detail(attraction.id))}>
            <ImageSlide pictures={attraction.pictures}>
                <FavoriteButton favorite={attraction.favorite} id={attraction.id} type='rental_car'/>
            </ImageSlide>

            <div className="w-full flex overflow-hidden">
                <div className="flex flex-col flex-1">
                    <div className='flex flex-col flex-1 gap-2'>
                        <Subtitle className='max-w-full line-clamp-2 leading-6'>{attraction.name}</Subtitle>
                        
                        <div className="inline-flex items-center gap-[3px]">
                            <Tag text={(attraction.rating).toString()} />
                            <Caption className='text-dark-blue'>{ratingText(attraction.rating)}</Caption>
                        </div>
                        <div className="inline-flex items-center gap-[3px] pl-1">
                            <LocationIcon width='12'/>
                            <Caption>{attraction.location}</Caption>
                        </div>
                    </div>
                        
                    <Tag text={attraction.type} />
                </div>
                <div className="self-stretch h-full inline-flex flex-col justify-end items-end gap-2">
                <span className='flex items-baseline gap-1'>
                    {attraction.price > 0 ?
                    <>   
                    <Caption className='text-dark-gray'>From</Caption>
                    <SubBody className='text-dark-blue'>฿</SubBody>
                    <ButtonText className='text-dark-blue'>{attraction.price}</ButtonText>
                    </>
                    :
                    <ButtonText className='text-dark-blue'>Free</ButtonText>}
                </span>
                </div>
            </div>
        </div>
    )
}

export default AttractionCard