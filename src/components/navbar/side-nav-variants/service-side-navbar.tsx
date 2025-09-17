import { MenuButton, Button } from '@/components/buttons';
import { PageOptionSide} from '../navbar-button';
import { paths } from '@/config/paths.config'

import HotelIcon from '@/assets/icons/hotel.svg'
import RestaurantIcon from '@/assets/icons/restaurant.svg'
import CarIcon from '@/assets/icons/car.svg'
import GuideIcon from '@/assets/icons/guide.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import MapIcon from '@/assets/icons/map.svg'


export default function ServiceNavbar(current: string) {
    return (
        <div className='w-56 h-full border-r-light-gray self-stretch bg-custom-white border border-pale-blue flex flex-col gap-4'>
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