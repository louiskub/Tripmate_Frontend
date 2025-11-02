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
import RestaurantCardProps from '@/models/service/card/restaurant-card';

import {ratingText} from '@/utils/service/rating'

import FavoriteButton from '@/components/services/other/favorite-button'

import { useRouter } from "next/navigation"


const RestaurantCard = (restaurant: RestaurantCardProps) => {
    const router = useRouter();
    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5
                    hover:bg-dark-white hover:cursor-pointer"
            onClick={() => router.push(paths.restaurant.detail(restaurant.id))}>
            <ImageSlide pictures={restaurant.pictures}>
                <FavoriteButton favorite={service.favorite ?? false} id={restaurant.id} type='restaurant'/>
            </ImageSlide>

            <div className="w-full flex overflow-hidden">
                <div className="flex flex-col flex-1">
                    <div className='flex flex-col flex-1 gap-2'>
                        <Subtitle className='max-w-full line-clamp-2 leading-6'>{restaurant.name}</Subtitle>
                        
                        <div className="inline-flex items-center gap-[3px]">
                            <Tag text={(restaurant.rating).toString()} />
                            <Caption className='text-dark-blue'>{ratingText(restaurant.rating)}</Caption>
                        </div>
                        <div className="inline-flex items-center gap-[3px] pl-1">
                            <LocationIcon width='12'/>
                            <Caption>{restaurant.location}</Caption>
                        </div>
                    </div>
                        
                    <Tag text={restaurant.tag} />
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard