"use client"
import { MenuButton, Button } from '@/components/buttons/buttons';
import { PageOptionDropdown } from '../navbar-button';
import { SubBody, ButtonText, SmallTag } from '@/components/text-styles/textStyles';
import { paths } from '@/config/paths.config'
import { useBoolean } from '@/hooks/use-boolean'
import { endpoints, BASE_URL } from "@/config/endpoints.config";
import { usePathname } from 'next/navigation';

import { ProfileDropdown } from '@/components/navbar/default-nav-variants/user-navbar'

import ProfileIcon from '@/assets/icons/profile.svg'
import AccountIcon from '@/assets/icons/person.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import BookingIcon from '@/assets/icons/booking.svg'
import ReviewIcon from '@/assets/icons/review.svg'
import GroupIcon from '@/assets/icons/group.svg'
import TripIcon from '@/assets/icons/trip.svg'
import BellIcon from '@/assets/icons/bell.svg'
import LogOutIcon from '@/assets/icons/logout.svg'
import { number } from 'framer-motion';
import { useUser } from '@/context/userContext';

type BookNavbarProps = {
    book_state: number;
    restaurant?: boolean;
}

export default function BookNavbar({restaurant = false, book_state}: BookNavbarProps) {
    const showDropdown = useBoolean(false);
    const username = localStorage.getItem('username');
    const first_name = localStorage.getItem('fname');
    const last_name = localStorage.getItem('lname');
    const profile_pic = localStorage.getItem('profileImg');
    return (
        <nav className="w-full h-14 px-7 sticky top-0 z-10 bg-white border-b border-light-gray inline-flex justify-between items-center">
            <a href={paths.home} className="flex items-center gap-[3px]">
                <div className="text-center justify-start text-dark-blue text-2xl font-extrabold ">TripMate</div>
            </a>
            <div className="flex justify-end items-center gap-2.5">
                <Button as='a' href={paths.account.notification}>
                    <BellIcon className="w-7.5" />
                </Button>
                <Button
                    className="w-10 h-10 rounded-full overflow-hidden border border-light-gray"
                    onClick={showDropdown.toggle}>
                    
                    {profile_pic 
                        ? <img 
                            src={profile_pic || '/images/placeholder.png'}
                            className="w-full h-full object-over" />
                        : <ProfileIcon className="w-7.5" />}
                </Button>
            </div>
            {
                restaurant ? 
                    <StepsRestaurant state={book_state}/>:
                    <Steps state={book_state}/>
                    
            }
            
            {showDropdown.value && <ProfileDropdown first_name={first_name || ''} last_name={last_name || ''} username={username || ''} profile_pic={profile_pic || ''}  />}
        </nav>
    )
}

type StepsProps = {
    state: number
}

const Steps = ({state}: StepsProps) => {
    return (
        <div className="-translate-x-1/2 left-1/2 absolute flex gap-2">
            <Step text='Fill in' number='1' active />
            <div className={`w-24 h-0.5 translate-y-2 ${state >= 2 ? 'bg-dark-blue': 'bg-custom-gray'}`}></div>
            <Step text='Payment' number='2'  active={state >= 2}/>
            <div className={`w-24 h-0.5 translate-y-2 ${state > 3 ? 'bg-dark-blue': 'bg-custom-gray'}`}></div>
            <Step text='Complete' number='3'  active={state >= 3}/>
        </div>
    )
    
}

type StepsRestaurantProps = {
    state: number
}

const StepsRestaurant = ({state}: StepsRestaurantProps) => {
    return (
        <div className="-translate-x-1/2 left-1/2 absolute flex gap-2">
            <Step text='Fill in' number='1' active />
            <div className={`w-24 h-0.5 translate-y-2 ${state >= 2 ? 'bg-dark-blue': 'bg-custom-gray'}`}></div>
            <Step text='Complete' number='2' active={state >= 2} />
        </div>
    )
    
}

type StepProps = {
    text: string;
    number: string;
    active?: boolean
}

const Step = ({text, number, active = false}: StepProps) => {
    return (
        <div className='flex flex-col items-center w-4 gap-0.5'>
            <SmallTag className={`w-4 h-4 rounded-full text-center text-dark-white ${active ? 'bg-dark-blue': 'bg-custom-gray'}`}>
                {number}
            </SmallTag>
            <SmallTag className={`text-nowrap ${active ? 'text-dark-blue': 'text-custom-gray'}`}>{text}</SmallTag>
        </div>
)
} 