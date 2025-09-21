import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import ImageSlide from '@/components/services/other/image-slide';
import StarIcon from '@/assets/icons/star-filled.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import { useBoolean } from '@/hooks/use-boolean'

type tab = {
    label: string
    id: string
}

type HotelNavTabProps = {
    current_tab: string;
    onSelect: (tab_id: string) => void;
}

const HotelNavTab = ({current_tab, onSelect}: HotelNavTabProps) => {
    const tabs: tab[] = [
        {label: 'Overview', id: 'overview'},
        {label: 'Rooms', id: 'room'},
        {label: 'Facilities', id: 'facility'},
        {label: 'Reviews', id: 'review'},
        {label: 'Location', id: 'location'},
        {label: 'Policy', id: 'policy'},
    ]

    return (
        <div className='sticky top-15 z-10 flex gap-2.5 px-2 text-custom-gray items-center bg-custom-white mt-2 h-9.5 rounded-lg shadow-[var(--boxshadow-lifted)]'>
            {tabs.map((tab) => (
                <Button 
                    onClick={ () => {
                        onSelect(tab.id)
                        document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`h-7! rounded-md px-4! ${
                        current_tab === tab.id 
                        ? 'bg-pale-blue text-dark-blue'
                        : 'hover:text-dark-blue'
                    }`}
                    key={tab.id}
                    text={tab.label}
                />
            ))}
        </div>
    )
}

export default HotelNavTab