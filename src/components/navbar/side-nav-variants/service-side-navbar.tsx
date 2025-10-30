import { MenuButton, Button } from '@/components/buttons/buttons';
import { PageOptionSide} from '../navbar-button';
import { paths } from '@/config/paths.config'

import HotelIcon from '@/assets/icons/hotel.svg'
import RestaurantIcon from '@/assets/icons/restaurant.svg'
import CarIcon from '@/assets/icons/car.svg'
import GuideIcon from '@/assets/icons/guide.svg'
import LocationIcon from '@/assets/icons/attraction-filled.svg'
import MapIcon from '@/assets/icons/map.svg'

type SideNavBarProps = {
    current?: string
}

export default function ServiceNavbar({ current }: SideNavBarProps) {
    return (
        <div className='min-w-56 sticky top-14 z-10 h-[calc(100vh-56px)] border-r-light-gray bg-custom-white border border-pale-blue flex flex-col gap-4'>
            <div>
                <PageOptionSide text='Hotels' href={paths.hotel.all} active={current === 'hotel'}>
                    <HotelIcon />
                </PageOptionSide>
                <PageOptionSide text='Restaurants' href={paths.restaurant.all} active={current === 'restaurant'}>
                    <RestaurantIcon />
                </PageOptionSide>
                <PageOptionSide text='Rental Cars' href={paths.rental_car.all} active={current === 'rental_car'}>
                    <CarIcon />
                </PageOptionSide>
                <PageOptionSide text='Guides' href={paths.guide.all} active={current === 'guide'}>
                    <GuideIcon />
                </PageOptionSide>
                <PageOptionSide text='Tourist Attractions' href={paths.attraction.all} active={current === 'attraction'}>
                    <LocationIcon />
                </PageOptionSide>
            </div>
            <div>
                <PageOptionSide text='Map' href={paths.map}  active={current === 'map'}>
                    <MapIcon />
                </PageOptionSide>
            </div>
        </div>
    )
}