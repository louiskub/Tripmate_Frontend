import { MenuButton, Button } from '@/components/buttons';
import { PageOptionSide} from '../navbar-button';
import { paths } from '@/config/paths.config'

import ProfileIcon from '@/assets/icons/profile.svg'
import AccountIcon from '@/assets/icons/person.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import BookingIcon from '@/assets/icons/booking.svg'
import ReviewIcon from '@/assets/icons/review.svg'
import GroupIcon from '@/assets/icons/group.svg'
import TripIcon from '@/assets/icons/trip.svg'
import BellIcon from '@/assets/icons/bell.svg'
import LogOutIcon from '@/assets/icons/logout.svg'


export default function AuthNavbar() {
    return (
        <div className='w-56 h-full border-r border-r-light-gray self-stretch bg-custom-white flex flex-col gap-2'>
            <div>
                <PageOptionSide text='Profile' href={paths.account.profile}>
                    <ProfileIcon />
                </PageOptionSide>
                <PageOptionSide text='Manage Account' href={paths.account.manage_account}>
                    <AccountIcon />
                </PageOptionSide>
                <PageOptionSide text='Notification' href={paths.account.notification}>
                    <BellIcon />
                </PageOptionSide>
                <PageOptionSide text='Favorites' href={paths.account.favorite}>
                    <HeartIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='Booking History' href={paths.account.booking_history}>
                    <BookingIcon />
                </PageOptionSide>
                <PageOptionSide text='Review History' href={paths.account.review_history}>
                    <ReviewIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='My Groups' href={paths.account.group}>
                    <GroupIcon />
                </PageOptionSide>
                <PageOptionSide text='My Trips' href={paths.account.trip}>
                    <TripIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='Log out'href='' className='text-red hover:bg-dark-white'>
                    <LogOutIcon />
                </PageOptionSide>
            </div>
        </div>
    )
}