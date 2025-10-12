"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import {paths} from "@/config/paths.config"

// import { MenuButton, Button } from '@/components/buttons';
import { PageOptionSide} from '../navbar-button';

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


const NavItem = ({ label, href, active }: { label: string; href: string; active?: boolean }) => (
  <Link
    className={`px-4 py-2 rounded-md cursor-pointer ${
      active ? "bg-light-blue font-semibold" : "hover:bg-pale-blue"
    }`}
    href={href}
  >
    {label}
  </Link>
);

export function AccountNav() {
  const [vendorType] = useLocalStorage('vendorType', 'car');
  const pathname = usePathname();
  console.log("pathname: ", pathname);
  const  navItems = [
      <NavItem key="total" label={`Total ${vendorType}`} href={paths.vendor.account.manage} />,
      <NavItem key="available" label={`Available ${vendorType}`} href={paths.vendor.account.manage} />
  ]

  if (vendorType != "car") {
    navItems.push(
      <NavItem key="unavailable" label={`Unavailable ${vendorType}`} href={paths.vendor.account.manage} />,
      <NavItem key="full_booking" label={`Full booking ${vendorType}`} href={paths.vendor.account.manage} />
    )
  }
  else {
    navItems.push(
      <NavItem key="active_rentals" label={`Active Rentals`} href={paths.vendor.account.manage} />,
      <NavItem key="under_repair" label={`Under Repair`} href={paths.vendor.account.manage} />
    )
  }

  navItems.push(
    <div className="mt-auto flex flex-col" key="actions">
      <NavItem href={paths.vendor.account.create} label={`Add New ${vendorType}`} active={pathname === paths.vendor.account.create} />
      <NavItem href={paths.vendor.account.manage} label={`Remove ${vendorType}`} active={pathname === paths.vendor.account.manage} />
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