import {ButtonText, Caption, SubBody, Title} from '@/components/text-styles/textStyles'
import { Tag } from '@/components/services/other/Tag'

import { HotelSubtopicRating } from '@/models/service/detail/hotel-detail'

import ArrowIcon from '@/assets/icons/arrow.svg'
import LocationIcon from '@/assets/icons/location.svg'
import { Button } from '../buttons/buttons'


type MiniMapProps = {
    location_link: string
}

export const MiniMap = ({location_link}: MiniMapProps) => {

    return (
        <div className={`relative rounded-[10px] w-64 flex justify-center items-center`}>
            <div className='w-64 bottom-0'>
                <img src='/images/overview-map-bg.png' className='object-cover w-64'/>
            </div>
            <div className='z-10 flex flex-col justify-center items-center gap-2 absolute'>
                <LocationIcon />
                <button 
                    className='shadow-[var(--light-shadow)] px-2! bg-custom-white h-7 flex items-center gap-1 rounded-[10px]'>
                    <SubBody className='font-semibold'>View on map</SubBody>
                    <ArrowIcon width='14'/>
                </button>
            </div>
            
        </div>
    )
}

export default MiniMap

