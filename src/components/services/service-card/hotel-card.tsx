import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, GenderInput, MaleGender, OtherGender } from '@/components/inputs/gender-input'
import { Button, TextButton } from '@/components/buttons/buttons'
import { Tag } from '@/components/services/other/Tag'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import ImageSlide from '@/components/services/other/image-slide';
import StarIcon from '@/assets/icons/star-filled.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import { useBoolean } from '@/hooks/use-boolean'

import FavoriteButton from '@/components/services/other/favorite-button'

type HotelCardProps = {
    name: string
    star: number
    rating: number
    rating_count: number
    location: string
    price: number
    type: string
    pictures: Array<string>
    favorite: boolean
    hotel_id: string
}

const HotelCard = (hotel: HotelCardProps) => {
    function ratingText(rating: number): string {
        if (rating >= 9.0) return "Excellent";
        if (rating >= 8.0) return "Very Good";
        if (rating >= 7.0) return "Good";
        if (rating >= 6.0) return "Pleasant";
        if (rating >= 5.0) return "Average";
        if (rating >= 4.0) return "Poor";
        return "Very Poor";
    }

    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5">
            <ImageSlide pictures={hotel.pictures}>
                <FavoriteButton favorite={hotel.favorite} hotel_id={hotel.hotel_id}/>
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
                    <div className="inline-flex items-center gap-[3px]">
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
                    <Button as='a' href={paths.hotel.detail} text='view hotel' className='bg-dark-blue rounded-lg text-custom-white !h-8 !px-3' />
                </div>
            </div>
        </div>
    )
}

export default HotelCard