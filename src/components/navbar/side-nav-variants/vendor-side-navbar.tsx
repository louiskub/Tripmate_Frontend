"use client"

// import { MenuButton, Button } from '@/components/buttons';
import { PageOptionSide} from '../navbar-button';
import { paths } from '@/config/paths.config'

import HotelIcon from '@/assets/icons/hotel.svg'
import RestaurantIcon from '@/assets/icons/restaurant.svg'
import CarIcon from '@/assets/icons/car.svg'
import GuideIcon from '@/assets/icons/guide.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
// import MapIcon from '@/assets/icons/map.svg'
import TouristAttractionIcon from '@/assets/icons/tourist-attracton.svg'
import HomeIcon from '@/assets/icons/Home.svg'

// import PersonIcon from '@/assets/icons/person.svg'
// import ProfileIcon from '@/assets/icons/profile.svg'
// import UploadIcon from '@/assets/icons/upload.svg'

import {useLocalStorage} from '@/hooks/use-storage'


const NavItem = ({ label, active }: { label: string; active?: boolean }) => (
  <div
    className={`px-4 py-2 rounded-md cursor-pointer ${
      active ? "bg-light-blue font-semibold" : "hover:bg-pale-blue"
    }`}
  >
    {label}
  </div>
);

export function AccountNav() {
  const [vendorType] = useLocalStorage('vendorType', 'Car');
  const  navItems = [
      <NavItem key="total" label={`Total ${vendorType}`} active />,
      <NavItem key="available" label={`Available ${vendorType}`} />
  ]

  if (vendorType != "Car") {
    navItems.push(
      <NavItem key="unavailable" label={`Unavailable ${vendorType}`} />,
      <NavItem key="full_booking" label={`Full booking ${vendorType}`} />
    )
  }
  else {
    navItems.push(
      <NavItem key="active_rentals" label={`Active Rentals`} />,
      <NavItem key="under_repair" label={`Under Repair`} />
    )
  }

  navItems.push(
    <div className="mt-auto" key="actions">
      <NavItem label={`Add New ${vendorType}`} />
      <NavItem label={`Remove ${vendorType}`} />
    </div>
  )


  return (
    <div className="w-48 bg-custom-white flex flex-col gap-2 p-2">
      {navItems}
    </div>
  );
};



export default function VendorSideNavbar() {
    const [vendorType] = useLocalStorage('vendorType', null);
    return (
        <div className='sticky top-0 w-56 h-[calc(100vh-56px)] border-r-light-gray self-stretch bg-custom-white border border-pale-blue flex flex-col gap-4'>
            <div>
                <PageOptionSide text='Dashboard' href={paths.hotel.all}>
                    <HomeIcon />
                </PageOptionSide>
                {
                    vendorType == 'restaurant'?
                        <PageOptionSide text='Restaurants' href={paths.restaurant.all} active={vendorType === 'restaurant'}>
                            <RestaurantIcon />
                        </PageOptionSide>
                    : vendorType == 'hotel'?
                        <PageOptionSide text='Hotels' href={paths.hotel.all} active={vendorType === 'hotel'}>
                            <HotelIcon />
                        </PageOptionSide>
                    : vendorType == 'rental_car'?
                        <PageOptionSide text='Rental Cars' href={paths.rental_car.all} active={vendorType === 'rental_car'}>
                            <CarIcon />
                        </PageOptionSide>
                    : vendorType == 'guide'?
                        <PageOptionSide text='Guides' href={paths.guide.all} active={vendorType === 'guide'}>
                            <GuideIcon />
                        </PageOptionSide>
                    :   <PageOptionSide text='Tourist Attractions' href={paths.attraction.all} active={vendorType === 'attraction'}>
                            <LocationIcon />
                        </PageOptionSide> 
                }
                <PageOptionSide text='Booking History' href={paths.restaurant.all} active={false}>
                    <TouristAttractionIcon />
                </PageOptionSide>
            </div>
        </div>
    )
}