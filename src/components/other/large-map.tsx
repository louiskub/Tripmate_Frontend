import {ButtonText, Caption, SubBody, Title} from '@/components/text-styles/textStyles'
import { Tag } from '@/components/services/other/Tag'

import { HotelSubtopicRating } from '@/models/service/detail/hotel-detail'

import ArrowIcon from '@/assets/icons/arrow.svg'
import LocationIcon from '@/assets/icons/location.svg'
import { Button } from '../buttons/buttons'


type LargeMapProps = {
    location_link: string
    className?: string
}

export const LargeMap = ({location_link, className}: LargeMapProps) => {

    return (
        <div className={`relative rounded-[10px] w-full flex justify-center items-center ${className}`}>
            <div className='w-full bottom-0'>
                <img src='/images/overview-map-bg.png' className='object-cover w-full'/>
            </div>
            <div className='z-10 flex flex-col justify-center items-center gap-2 absolute'>
                <LocationIcon />
            </div>
        </div>
    )
}

export default LargeMap

