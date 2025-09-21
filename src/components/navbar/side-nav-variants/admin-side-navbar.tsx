import { MenuButton, Button } from '@/components/buttons/buttons';
import { PageOptionSide} from '../navbar-button';
import { paths } from '@/config/paths.config'

import HotelIcon from '@/assets/icons/hotel.svg'
import RestaurantIcon from '@/assets/icons/restaurant.svg'
import CarIcon from '@/assets/icons/car.svg'
import GuideIcon from '@/assets/icons/guide.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import MapIcon from '@/assets/icons/map.svg'



export default function Admin() {
    return (
        <div className='w-56 sticky top-14 z-10 h-[calc(100vh-56px)] border-r-light-gray bg-custom-white border border-pale-blue flex flex-col gap-2'>
            <div>
                <PageOptionSide text='Profile' href={paths.account.profile}>
                    <HotelIcon />
                </PageOptionSide>
                <PageOptionSide text='Manage Account' href={paths.account.manage_account}>
                    <RestaurantIcon />
                </PageOptionSide>
                <PageOptionSide text='Notification' href={paths.account.notification}>
                    <CarIcon />
                </PageOptionSide>
                <PageOptionSide text='Favorites' href={paths.account.favorite}>
                    <GuideIcon />
                </PageOptionSide>
                <PageOptionSide text='Favorites' href={paths.account.favorite}>
                    <LocationIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='Booking History' href={paths.account.booking_history}>
                    <MapIcon />
                </PageOptionSide>
            </div>
        </div>
    )
}