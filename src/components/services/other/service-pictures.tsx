import {PageTitle, SubBody, Title, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState, ReactNode } from 'react';

import { HotelSubtopicRating } from '@/models/service/detail/hotel-detail';

import ArrowIcon from '@/assets/icons/arrow.svg'
import PagiArrowIcon from '@/assets/icons/pagination-arrow.svg'
import XIcon from '@/assets/icons/X.svg'
import { RatingProps } from './rating';
import { picture } from 'framer-motion/client';

import GalleryIcon from '@/assets/icons/gallery.svg'

type ServicePicturesProps = {
    pictures: Array<string>
    children: ReactNode
    onClick: () => void
}

const ServicePictures = ({ pictures, children, onClick }: ServicePicturesProps) => {
    return (
        <div 
            onClick={onClick}
            className="relative flex overflow-hidden w-full h-90 gap-1.5">
            <div className='absolute right-0'>
                {children} 
            </div>    
            
            <div className="rounded-[10px] h-full flex-1 overflow-hidden">
                <img 
                    src={pictures[0] || '/images/placeholder.png'}
                    onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = "/images/placeholder.png"; // fallback immediately
                    }}
                    className="w-full h-full object-cover hover:scale-102 transition-transform  hover:cursor-pointer" 
                />
            </div>
            <div className='flex-1 h-full grid grid-cols-2 grid-rows-2 gap-1.5'>
                {pictures.slice(1, 5).map((pic, idx) => (
                    <div key={idx} className="w-full h-full overflow-hidden rounded-[10px]">
                        <img
                        onError={(e) => {
                            e.currentTarget.onerror = null; // prevent infinite loop
                            e.currentTarget.src = "/images/placeholder.png"; // fallback immediately
                        }}
                        src={pic || '/images/placeholder.png'}
                        className="w-full h-full object-cover overflow-hidden hover:scale-105 hover:cursor-pointer transition-transform"
                        />
                    </div>
                    ))}
            </div>
        </div>
    )
}

type PicturePopupProps = {
    pictures: string[]
    name: string
    children?: ReactNode
    Close: () => void
}

export const PicturePopup = ({ pictures, name, children, Close }: PicturePopupProps) => {
    const [pictureIdx, setPictureIdx] = useState<number | null>(null);

    const prev = () => {
        if (pictureIdx !== null && pictureIdx > 0) {
            setPictureIdx(pictureIdx - 1)
        }
    }

    const next = () => {
        if (pictureIdx !== null && pictureIdx < pictures.length - 1) {
            setPictureIdx(pictureIdx + 1)
        } 
    }

    return (
        <div className='fixed top-0 left-0 bg-transparent-black w-full h-full py-6 px-12 flex justify-center z-20'>
        <div className="w-full h-full bg-custom-white rounded-2xl flex flex-col">
            <div className="w-full flex-none h-14 px-5 border-b border-light-gray flex justify-between items-center text-gray">
                <div
                    onClick={() => setPictureIdx(null)}
                    className='hover:bg-dark-white aspect-square rounded-full h-full flex justify-center items-center hover:cursor-pointer'>
                    <ArrowIcon width='22' className='-scale-x-100'/>
                </div>
                <Title className='text-custom-black'>{name}</Title>

                <div
                    onClick={Close}
                    className='hover:bg-dark-white aspect-square rounded-full h-full flex justify-center items-center hover:cursor-pointer'>
                    <XIcon width='22'/>
                </div>
                
            </div>
            <div className="overflow-hidden flex-1 inline-flex w-full">
                {pictureIdx !== null ?
                    <div className="p-5 grid grid-rows-[1fr_auto] w-3/4 gap-5 overflow-auto">
                        <div className='flex items-center justify-center gap-6'>
                            <Button
                                onClick= {prev}
                                className='w-1/10 max-w-8 bg-custom-white shadow-[var(--boxshadow-lifted)]'>
                                <PagiArrowIcon className='w-2/3 -scale-100'/>
                            </Button>

                            <div 
                                className='relative overflow-hidden rounded-2xl aspect-3/2 h-[535px]'
                                key={pictureIdx}
                                onClick={() => setPictureIdx(pictureIdx)}
                            >
                                <img
                                    onError={(e) => {
                                        e.currentTarget.onerror = null; // prevent infinite loop
                                        e.currentTarget.src = "/images/placeholder.png"; // fallback immediately
                                    }}
                                    className="w-full h-full object-cover" 
                                    src={pictures[pictureIdx] || '/images/placeholder.png'} />
                                <Body className='bg-translucent-white px-3 rounded-lg text-center absolute left-1/2 -translate-x-1/2 bottom-1'>{pictureIdx + 1}/{pictures.length}</Body>
                            </div>
                            <Button
                                onClick={next}
                                className='w-1/10 max-w-8 bg-custom-white shadow-[var(--boxshadow-lifted)]'>
                                <PagiArrowIcon className='w-2/3'/>
                            </Button>
                        </div>
                        <div className='flex gap-1.5 items-center'>
                            <button
                                onClick={() => setPictureIdx(null)}
                                className='default-btn h-18 w-18 rounded-xl bg-light-blue text-dark-blue flex flex-col items-center justify-center hover:cursor-pointer'>
                                <GalleryIcon width='36' />
                                <ButtonText>gallery</ButtonText>
                            </button>
                            {pictures.slice(0, pictureIdx).map((picture, idx) => 
                                <PictureListItem picture={picture} idx={idx} onClick={setPictureIdx} />
                            )}
                            <PictureListItem active picture={pictures[pictureIdx]} idx={pictureIdx} onClick={setPictureIdx} />
                            {pictures.slice(pictureIdx + 1).map((picture, idx) =>
                                <PictureListItem picture={picture} idx={idx + pictureIdx + 1} onClick={setPictureIdx} />
                            )}
                        </div>
                    </div>
                    :
                    <div className="p-6 grid grid-cols-3 auto-rows-max gap-6 w-3/4 overflow-auto">
                        {
                            pictures.map((picture, idx) => 
                                <div 
                                    className='overflow-hidden rounded-[10px] hover:cursor-pointer'
                                    key={idx}
                                    onClick={() => setPictureIdx(idx)}
                                >
                                    <img className="hover:scale-105 transition-all object-cover w-full h-full" src={picture || '/images/placeholder.png'} />
                                </div>
                            )
                        }
                    </div>
                }
                <div className='w-1/4 pb-5 border border-l border-light-gray overflow-auto'>
                    {children}
                </div>
            </div>
        </div>
    </div>
    )
    
}


type PictureListItemProps = {
    picture: string
    idx: number
    onClick: (idx: number) => void
    active?: boolean
}

export const PictureListItem = ({picture, idx, onClick, active = false}: PictureListItemProps) => {
    return (
        <div 
            className={`h-18 w-18 overflow-hidden rounded-[10px] hover:cursor-pointer ${active? 'border-3 border-dark-blue box-content': ''}`}
            onClick={() => onClick(idx)}
        >
            <img 
                onError={(e) => {
                    e.currentTarget.onerror = null; // prevent infinite loop
                    e.currentTarget.src = "/images/placeholder.png"; // fallback immediately
                }}
                className={`w-full h-full hover:scale-103 transition-all object-cover ${active? '': 'opacity-50 hover:opacity-100'}`}
                src={picture || "/images/placeholder.png"} />
        </div>
    )
}

export default ServicePictures