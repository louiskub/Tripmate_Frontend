import { useBoolean } from '@/hooks/use-boolean'

import {ButtonText, Caption, SubBody, Title, Subtitle, Body, SubCaption} from '@/components/text-styles/textStyles'
import { Tag } from '@/components/services/other/Tag'

import { HotelSubtopicRating } from '@/models/service/detail/hotel-detail'

import BedIcon from '@/assets/icons/bed.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import PersonIcon from '@/assets/icons/person.svg'
import XIcon from '@/assets/icons/X.svg'

import { Button, TextButton } from '@/components/buttons/buttons'
import { Room } from '@/models/service/detail/hotel-detail'
import ImageSlide from '@/components/services/other/image-slide'
import { useState } from 'react'

import PagiArrowIcon from '@/assets/icons/pagination-arrow.svg'
import GalleryIcon from '@/assets/icons/gallery.svg'
import SizeIcon from '@/assets/icons/heart.svg'

import { PictureListItem } from './service-pictures'
import GuidePopup from './guide-popup'


type RoomDetailProps = {
    room: Room
    service_id: string
}

export const RoomDetail = ({room, service_id}: RoomDetailProps) => {
    const showPopup = useBoolean(false)
    const [guidePopup, setGuidePopup] = useState(false)

    return (
        <div className='border border-light-gray px-4 py-2 rounded-[10px] grid grid-cols-[240px_1fr] gap-1.5'>
            <Subtitle className='col-span-2'>{room.name}</Subtitle>
            <div className='w-60'>
                <ImageSlide className='w-60 h-45' pictures={room.pictures} onClick={showPopup.setTrue}/>
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
                                    onClick={() => setGuidePopup(true)}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
            {showPopup.value && <RoomDetailPopup close={showPopup.setFalse} room={room}/>}
            {guidePopup && <GuidePopup Close={() => setGuidePopup(false)} type='hotel' service_id={service_id}/>}
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
    room: Room
}

const RoomDetailPopup = ({close, room}: RoomDetailPopupProps) => {
    const starting_price = Math.min(
        ...room.room_options.map((opt) => opt.price)
    );
    const [pictureIdx, setPictureIdx] = useState<number>(0);

        const prev = () => {
        if (pictureIdx !== null && pictureIdx > 0) {
            setPictureIdx(pictureIdx - 1)
        }
    }

    const next = () => {
        if (pictureIdx !== null && pictureIdx < room.pictures.length - 1) {
            setPictureIdx(pictureIdx + 1)
        } 
    }

    return (
        <div className='fixed top-0 left-0 bg-transparent-black w-full h-full flex justify-center items-center z-20'>
        <div className="w-[1000px] h-[640px] bg-custom-white rounded-2xl flex flex-col">
            <div className="w-full flex-none h-14 pl-5 pr-1 border-b border-light-gray flex justify-between items-center text-gray">
                <Title className='text-custom-black'>{room.name}</Title>

                <div
                    onClick={close}
                    className='hover:bg-dark-white aspect-square rounded-full h-full flex justify-center items-center hover:cursor-pointer'>
                    <XIcon width='22'/>
                </div>
                
            </div>
            <div className="overflow-hidden flex-1 inline-flex w-full">
                <div className="p-5 grid grid-rows-[1fr_auto] w-7/10 gap-5">
                    <div className='flex items-center justify-center gap-4 relative'>
                        <div 
                            className='overflow-hidden rounded-2xl aspect-3/2 h-full'
                            key={pictureIdx}
                            onClick={() => setPictureIdx(pictureIdx)}
                        >
                            <img className="w-full h-full object-cover" src={room.pictures[pictureIdx]} />
                            <Body className='bg-translucent-white px-3 rounded-lg text-center absolute left-1/2 -translate-x-1/2 bottom-1'>{pictureIdx + 1}/{room.pictures.length}</Body>

                        </div>
                        
                        <div className='absolute z-20 flex justify-between w-full px-4'>
                            <Button
                                onClick= {prev}
                                className='w-8 max-w-8 bg-custom-white/60 shadow-[var(--boxshadow-lifted)] '>
                                <PagiArrowIcon className='w-2/3 -scale-100 text-dark-blue'/>
                            </Button>

                            <Button
                                onClick={next}
                                className='w-8 max-w-8 bg-custom-white/60 shadow-[var(--boxshadow-lifted)]'>
                                <PagiArrowIcon className='w-2/3 text-dark-blue'/>
                            </Button>
                        </div>
                        
                    </div>
                    <div className='flex gap-1.5 items-center'>
                        {room.pictures.slice(0, pictureIdx).map((picture, idx) => 
                            <PictureListItem picture={picture} idx={idx} key={idx} onClick={setPictureIdx} />
                        )}
                        <PictureListItem active picture={room.pictures[pictureIdx]} idx={pictureIdx} onClick={setPictureIdx} />
                        {room.pictures.slice(pictureIdx + 1).map((picture, idx) =>
                            <PictureListItem picture={picture} idx={idx + pictureIdx + 1} key={idx + pictureIdx + 1} onClick={setPictureIdx} />
                        )}
                    </div>
                </div>
                <div className='flex flex-col w-3/10 flex-1 gap-6 border border-l border-light-gray overflow-auto'>
                    <div className='flex flex-col gap-2 px-3 mt-3'>
                        <SubBody className='font-black!'>
                            Room Information
                        </SubBody>
                        <SubBody className='flex gap-2 px-1'>
                            <HeartIcon width='14'/> {room.size} m²
                        </SubBody>
                        <SubBody className='flex gap-2 px-1'>
                            <PersonIcon width='14'/> {room.room_options[0].max_guest} guests
                        </SubBody>
                    </div>
                    <ul className='flex flex-col gap-2 auto-rows-auto px-3 flex-1'>
                        <SubBody className='font-black!'>
                            Room Facilities
                        </SubBody>
                        {
                            room.facility.slice(0,6).map((facility, idx) => (
                                <li
                                    className='list-none'
                                    key={idx}>
                                        <SubBody className='flex gap-2 px-1'>
                                            <HeartIcon width='14'/> {facility}
                                        </SubBody>
                                </li>
                            ))
                        }
                    </ul>
                    <div className='flex flex-col w-full px-3 pt-2 pb-3 bg-custom-white shadow-[var(--boxshadow-lifted)] gap-2'>
                        <SubBody className='text-dark-gray'>
                            starting from
                        </SubBody>
                        <div className='flex items-baseline gap-1'>
                            <Title className='text-dark-blue'>฿ {starting_price}</Title>
                            <Caption>/room /night</Caption>
                        </div>
                        <button 
                            onClick={close}
                            className='bg-dark-blue text-white h-7! text-base default-btn rounded-lg w-full hover:cursor-pointer hover:bg-darker-blue'>
                                see room options
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default RoomDetail

