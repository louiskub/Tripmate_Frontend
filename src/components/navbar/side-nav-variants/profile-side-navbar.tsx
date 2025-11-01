import { MenuButton, Button } from '@/components/buttons/buttons';
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

type ProfileSideNavBarProps = {
    current?: string
}

export default function ProfileSideNavBar({current}: ProfileSideNavBarProps) {
    return (
        <div className='w-56 text-base border-r border-r-light-gray self-stretch bg-custom-white flex flex-col gap-2'>
            <div>
                <PageOptionSide text='Profile' href={paths.account.profile} active={current === 'profile'}>
                    <ProfileIcon />
                </PageOptionSide>
                <PageOptionSide text='Manage Account' href={paths.account.manage_account} active={current === 'manage_account'}>
                    <AccountIcon />
                </PageOptionSide>
                <PageOptionSide text='Notification' href={paths.account.notification} active={current === 'notification'}>
                    <BellIcon />
                </PageOptionSide>
                <PageOptionSide text='Favorites' href={paths.account.favorite} active={current === 'favorite'}>
                    <HeartIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='Booking History' href={paths.account.booking_history} active={current === 'booking_history'}>
                    <BookingIcon />
                </PageOptionSide>
                <PageOptionSide text='Review History' href={paths.account.review_history} active={current === 'review_history'}>
                    <ReviewIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='My Groups' href={paths.account.group} active={current === 'my_group'}>
                    <GroupIcon />
                </PageOptionSide>
                <PageOptionSide text='My Trips' href={paths.account.trip} active={current === 'my_trip'}>
                    <TripIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='Log out'href='' className='text-red hover:bg-dark-white hover:text-red'>
                    <LogOutIcon />
                </PageOptionSide>
            </div>
        </div>
    )
}