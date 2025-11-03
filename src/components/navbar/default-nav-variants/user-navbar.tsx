"use client"
import { MenuButton, Button } from '@/components/buttons/buttons';
import { PageOptionDropdown } from '../navbar-button';
import { SubBody, ButtonText } from '@/components/text-styles/textStyles';
import { paths } from '@/config/paths.config'
import { useBoolean } from '@/hooks/use-boolean'

import ProfileIcon from '@/assets/icons/profile.svg'
import AccountIcon from '@/assets/icons/person.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import BookingIcon from '@/assets/icons/booking.svg'
import ReviewIcon from '@/assets/icons/review.svg'
import GroupIcon from '@/assets/icons/group.svg'
import TripIcon from '@/assets/icons/trip.svg'
import BellIcon from '@/assets/icons/bell.svg'
import LogOutIcon from '@/assets/icons/logout.svg'

import { useRouter } from "next/navigation"

export default function UserNavbar() {
    // const {user} = useUser();
    const showDropdown = useBoolean(false);
    const username = localStorage.getItem('username');
    const first_name = localStorage.getItem('fname');
    const last_name = localStorage.getItem('lname');
    const profile_pic = localStorage.getItem('profileImg');
    
    return (
        <nav className="w-full h-14 px-7 sticky top-0 z-20 bg-white border-b border-light-gray inline-flex justify-between items-center">
            <a href={paths.home} className="flex items-center gap-[3px]">
                <div className="text-center justify-start text-dark-blue text-2xl font-extrabold ">TripMate</div>
            </a>
            <div className="flex justify-end items-center gap-5">
                {/* <Button as='a' href={paths.account.notification}>
                    <BellIcon className="w-7.5" />
                </Button> */}
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
            <div className="-translate-x-1/2 left-1/2 absolute flex justify-center items-center gap-2.5">
                <MenuButton text='Trip' href={paths.trip.all}></MenuButton>
                <MenuButton text='Group' href={paths.group.all} />
            </div>
            {showDropdown.value && <ProfileDropdown first_name={first_name || ''} last_name={last_name || ''} username={username || ''} profile_pic={profile_pic || ''}  />}
        </nav>
    )
}

type ProfileDropdownProps = {
    first_name: string;
    last_name: string;
    username: string;
    profile_pic?: string;
}

export const ProfileDropdown = ({first_name = "first", last_name = "last", username = "username", profile_pic = "/images/placeholder.png"}: ProfileDropdownProps) => {
    const router = useRouter();
    
    const clickLogout = (e?: React.MouseEvent) => {
        e?.preventDefault(); // 🧠 stop <a> navigation
        document.cookie = "token=; max-age=0; path=/";
        localStorage.clear();
        // window.location.reload();
        window.location.href = "/auth/login"
        // router.replace(paths.home);
    }

    return (
        <div className='w-[280px] rounded-xl shadow-[var(--boxshadow-lifted)] top-12 right-7.5 self-stretch bg-custom-white border border-pale-blue flex flex-col gap-2 absolute overflow-hidden'>
            <div className="self-stretch h-16 px-2.5 border-b border-light-gray inline-flex justify-start items-center gap-1.5">
                <img
                    onClick={() => router.push(paths.account.profile)}
                    className="w-11 h-11 rounded-[100px] shadow object-cover border border-light-gray hover:cursor-pointer" 
                    src={profile_pic || '/images/placeholder.png'} />
                <div
                    className="flex-1 inline-flex flex-col gap-1">
                    <ButtonText
                        onClick={() => router.push(paths.account.profile)}
                        className='translate-y-0.5 hover:cursor-pointer'>{first_name} {last_name}</ButtonText>
                    <div className="self-stretch flex items-center -translate-y-0.5">
                            <SubBody className='text-custom-gray'>@</SubBody>
                            <SubBody className='text-custom-black'>{username}</SubBody>
                    </div>
                </div>
            </div>
            <div>
                <PageOptionDropdown text='Profile' href={paths.account.profile}>
                    <ProfileIcon />
                </PageOptionDropdown>
                <PageOptionDropdown text='Manage Account' href={paths.account.manage_account}>
                    <AccountIcon />
                </PageOptionDropdown>
                {/* <PageOptionDropdown text='Notification' href={paths.account.notification}>
                    <BellIcon />
                </PageOptionDropdown> */}
                <PageOptionDropdown text='Favorites' href={paths.account.favorite}>
                    <HeartIcon />
                </PageOptionDropdown>
            </div>
            <div>
                <PageOptionDropdown text='Booking History' href={paths.account.booking_history}>
                    <BookingIcon />
                </PageOptionDropdown>
                <PageOptionDropdown text='Review History' href={paths.account.review_history}>
                    <ReviewIcon />
                </PageOptionDropdown>
            </div>
            <div>
                <PageOptionDropdown text='My Groups' href={paths.account.group}>
                    <GroupIcon />
                </PageOptionDropdown>
                <PageOptionDropdown text='My Trips' href={paths.account.trip}>
                    <TripIcon />
                </PageOptionDropdown>
            </div>
            <div>
                <PageOptionDropdown 
                    onclick={clickLogout}
                    text='Log out'href='' className='text-red hover:bg-dark-whit h-10 hover:text-red hover:bg-dark-white'>
                    <LogOutIcon />
                </PageOptionDropdown>
            </div>
        </div>
    )
}