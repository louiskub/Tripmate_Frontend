import { MenuButton, Button } from '@/components/buttons';
import { paths } from '@/config/paths.config'

import ProfileIcon from '@/assets/icons/profile.svg'
import BellIcon from '@/assets/icons/bell.svg'

export default function AdminNavbar() {
    return (
        <nav className="w-full h-14 px-7 relative bg-custom-white border-b border-light-gray inline-flex justify-between items-center overflow-hidden">
            <a href={paths.home} className="flex items-center gap-[3px]">
                <div className="text-center justify-start text-black text-2xl font-extrabold">Logo</div>
                <div className="text-center justify-start text-dark-blue text-2xl font-extrabold ">TripMate</div>
            </a>
            <div className="flex justify-end items-center gap-2.5">
                <Button as='a' href={paths.account.notification}>
                    <BellIcon className="w-7.5" />
                </Button>
                <Button>
                    <ProfileIcon className="w-7.5" />
                </Button>
            </div>
        </nav>
    )
}