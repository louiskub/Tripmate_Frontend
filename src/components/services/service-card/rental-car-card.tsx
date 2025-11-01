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
import RentalCarCardProps from '@/models/service/card/rental-car-card';

const RentalCarCard = (car: RentalCarCardProps) => {
    const router = useRouter();
    return (
        <div className="w-full min-h-48 p-2.5 border-t border-light-gray grid grid-cols-[180_1fr] gap-2.5
                    hover:bg-dark-white hover:cursor-pointer"
            onClick={() => router.push(paths.rental_car.detail(car.rental_car_id))}>
            <ImageSlide pictures={car.pictures}>
                <FavoriteButton favorite={car.favorite} id={car.rental_car_id} type='rental_car'/>
            </ImageSlide>

            <div className="w-full flex overflow-hidden">
                <div className='flex flex-col flex-1 gap-2'>
                    <div className='ml-1'>
                        <div className='flex gap-1 items-center text-dark-gray mb-1'>
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault()
                                    window.location.href = paths.other_profile(car.owner.user_id)
                                }}
                            
                            className='w-4 aspect-square'>
                                {car.owner.profile_pic ?
                                    <img src={car.owner.profile_pic} className='object-cover w-full h-full rounded-full'/> :
                                    <ProfileIcon className='text-custom-gray'/>
                                }
                            </div>
                            <Caption>{car.owner.first_name} {car.owner.last_name}</Caption>
                        </div>
                        <Subtitle className='max-w-full line-clamp-2 leading-6'>{car.name}</Subtitle>
                    </div>
                    
                    <Tag text={car.type}/>

                    <div className="inline-flex items-center gap-[3px] mt-2">
                        <Tag text={(car.rating).toString()} />
                        <Caption className='text-dark-blue'>{ratingText(car.rating)}</Caption>
                    </div>
                    
                    <div className="inline-flex items-center gap-[3px] pl-1">
                        <LocationIcon width='12'/>
                        <Caption>{car.location}</Caption>
                    </div>
                </div>
                <div className="self-stretch h-full inline-flex flex-col justify-end items-end gap-2">
                <span className='flex items-baseline gap-1'>
                    <Caption className='text-dark-gray'>From</Caption>
                    <SubBody className='text-dark-blue'>฿</SubBody>
                    <ButtonText className='text-dark-blue'>{car.price}</ButtonText>
                </span>
                </div>
            </div>
        </div>
    )
}

export default RentalCarCard