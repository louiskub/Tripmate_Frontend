import { useBoolean } from '@/hooks/use-boolean'

import {ButtonText, Caption, SubBody, Title, Subtitle, Body, SubCaption} from '@/components/text-styles/textStyles'
import { Tag } from '@/components/services/other/Tag'

import { HotelSubtopicRating } from '@/models/service/detail/hotel'

import BedIcon from '@/assets/icons/bed.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import PersonIcon from '@/assets/icons/person.svg'
import XIcon from '@/assets/icons/X.svg'

import { Button, TextButton } from '@/components/buttons/buttons'
import { Room } from '@/models/service/detail/hotel'
import ImageSlide from '@/components/services/other/image-slide'
import { useState } from 'react'



type RoomDetailProps = {
    room: Room
}

export const RoomDetail = ({room}: RoomDetailProps) => {
    const showPopup = useBoolean(false)
    return (
        <div className='border border-light-gray px-4 py-2 rounded-[10px] grid grid-cols-[240px_1fr] gap-1.5'>
            <Subtitle className='col-span-2'>{room.name}</Subtitle>
            <div className='w-60'>
                <ImageSlide className='w-60 h-45' pictures={room.pictures} />
                    <SubBody className='flex items-center gap-1 col-span-2 mt-2.5'>
                        <HeartIcon width='14'/> {room.size} m²
                    </SubBody>
                    <ul className='grid grid-cols-2 gap-1 py-1'>
                    {
                        room.facility.slice(0,6).map((facility, idx) => (
                            <li
                                className='list-none '
                                key={idx}>
                                    <Caption className='flex items-center gap-1'>
                                        <HeartIcon width='12'/>
                                        {facility}
                                    </Caption>
                            </li>
                        ))
                    }
                    </ul>
                    <TextButton
                        className='text-dark-blue !py-0'
                        onClick={showPopup.setTrue}>
                        <SubBody>
                            View room detail
                        </SubBody>
                    </TextButton>
            </div>
            <div className='border border-light-gray rounded-[10px] overflow-hidden self-start'>
                {
                    room.room_options.map((option) => (
                        <div className=' border-light-gray grid grid-cols-[1fr_120px_200px_100px] border-b h-24'
                            key={option.name}>
                            <div className='border-r border-light-gray h-full p-2.5'>
                                <ButtonText>{option.name}</ButtonText>
                                <Caption className='flex items-center gap-1'>
                                    <BedIcon width='12'/>
                                    {option.bed}
                                </Caption>
                            </div>
                            <div className='border-r border-light-gray p-2.5 flex items-center justify-center'>
                                <HotelGuest guest={option.max_guest}/>
                            </div>
                            <div className='border-r border-light-gray p-2.5 h-full flex flex-col items-end gap-1 justify-end'>
                                <span className='flex items-baseline h-4.5 gap-1'>
                                    <Body className='text-dark-blue leading-4'>฿</Body>
                                    <ButtonText className='text-dark-blue'>{option.price}</ButtonText>
                                </span>
                                <SubCaption>incl. taxes & fees ฿ {(option.price * 1.17).toFixed(2)}</SubCaption>
                            </div>
                            <div className='flex justify-center p-2.5'>
                                <Button
                                    text='Book'
                                    className='bg-dark-blue text-custom-white h-8! w-20'
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
            {showPopup.value && <RoomDetailPopup close={showPopup.setFalse}/>}
        </div>
    )
}

type HotelGuestProp = {
    guest: number
}

const HotelGuest = ({ guest }: HotelGuestProp) => {
    return (
        <SubBody className="flex items-center gap-0.5">
        {guest > 3 ? (
            <>
            <PersonIcon width="20" />
            <Body>{guest}</Body>
            </>
        ) : (
            Array.from({ length: guest }).map((_, i) => (
            <PersonIcon key={i} width="16" />
            ))
        )}
        </SubBody>
    );
};

type RoomDetailPopupProps = {
    close: () => void
}

const RoomDetailPopup = ({close}: RoomDetailPopupProps) => {
    return (
        <div className='fixed top-0 left-0 bg-transparent-black w-full h-full flex justify-center items-center z-10'>
            <div className='relative bg-custom-white w-lg h-96 shadow-[var(--light-shadow)] rounded-[10px]'>
                RoomDetailPopup
                <Button
                    onClick={close}>
                    <XIcon className="absolute top-4 right-4 text-custom-gray" width='16' />
                </Button>
            </div>
        </div>
    )
}

export default RoomDetail

