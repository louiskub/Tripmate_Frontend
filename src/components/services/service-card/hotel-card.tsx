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
import { useBoolean } from '@/hooks/use-boolean'

import {ratingText} from '@/utils/service/rating'
import HotelCardProps from '@/models/service/card/hotel-card'
import FavoriteButton from '@/components/services/other/favorite-button'

import { useRouter } from "next/navigation"


const HotelCard = (hotel: HotelCardProps) => {
    const router = useRouter();
    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5 hover:bg-dark-white hover:cursor-pointer"
            onClick={() => router.push(paths.hotel.detail(hotel.id))}>
            <ImageSlide pictures={hotel.pictures}>
                <FavoriteButton favorite={service.favorite ?? false} id={hotel.id} type='hotel'/>
            </ImageSlide>

            <div className="w-full flex overflow-hidden">
                <div className="flex flex-col flex-1 gap-2">
                    <Subtitle className='max-w-full line-clamp-2 leading-6'>{hotel.name}</Subtitle>
                    <div className='text-dark-blue flex gap-1'>
                        <Tag text={hotel.type} />
                        <span className='flex'>
                            {Array.from({ length: hotel.star }).map((_, i) => (
                                <StarIcon key={i} width="12" />
                            ))}
                        </span>
                    </div>
                    
                    <div className="inline-flex items-center gap-[3px] mt-2">
                        <Tag text={(hotel.rating).toString()} />
                        <Caption className='text-dark-blue'>{ratingText(hotel.rating)}</Caption>
                    </div>
                    <div className="inline-flex items-center gap-[3px] pl-1">
                        <LocationIcon width='12'/>
                        <Caption>{hotel.location}</Caption>
                    </div>
                    
                </div>

                <div className="self-stretch h-full inline-flex flex-col justify-end items-end gap-2">
                    <span className='flex items-baseline gap-1'>
                        <Caption className='text-dark-gray'>From</Caption>
                        <SubBody className='text-dark-blue'>฿</SubBody>
                        <ButtonText className='text-dark-blue'>{hotel.price}</ButtonText>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default HotelCard