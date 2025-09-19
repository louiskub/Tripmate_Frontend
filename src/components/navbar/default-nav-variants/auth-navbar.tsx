import { MenuButton, Button } from '@/components/buttons';
import { SubBody } from '@/components/TextStyles';
import { paths } from '@/config/paths.config';

export default function AuthNavbar() {
    return (
        <nav className="w-full h-14 px-7 fixed bg-white border-b border-light-gray inline-flex justify-between items-center overflow-hidden">
            <a href={paths.home} className="flex items-center gap-[3px]">
                <div className="text-center justify-start text-black text-2xl font-extrabold">Logo</div>
                <div className="text-center justify-start text-dark-blue text-2xl font-extrabold ">TripMate</div>
            </a>
            <div className="flex justify-end items-center gap-2.5">
                <a className="text-dark-blue" href={paths.auth.provider}>
                    <SubBody>Post your business?</SubBody>
                </a>
            </div>
            <div className="-translate-x-1/2 left-1/2 absolute flex justify-center items-center gap-2.5">
                <MenuButton text='Trip' href={paths.trip.all}></MenuButton>
                <MenuButton text='Group' href={paths.group.all}></MenuButton>
            </div>
        </nav>
    )
}