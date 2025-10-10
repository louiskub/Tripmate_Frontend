"use client"

import { MenuButton, Button } from '@/components/buttons';
import { PageOptionSide} from '../navbar-button';
import { paths } from '@/config/paths.config'

import HotelIcon from '@/assets/icons/hotel.svg'
import RestaurantIcon from '@/assets/icons/restaurant.svg'
import CarIcon from '@/assets/icons/car.svg'
import GuideIcon from '@/assets/icons/guide.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import MapIcon from '@/assets/icons/map.svg'
import TouristAttractionIcon from '@/assets/icons/tourist-attracton.svg'
import HomeIcon from '@/assets/icons/Home.svg'

import PersonIcon from '@/assets/icons/person.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import UploadIcon from '@/assets/icons/upload.svg'

import {useLocalStorage} from '@/hooks/use-storage'

export function UploadImg() {
  const [vendorType, setVendorType] = useLocalStorage('vendorType', 'Car');

  console.log("UploadImg component rendered");
        return (
      <div className="flex flex-col items-center justify-center w-[300px] h-64 border-2 border-dashed border-blue-300 rounded-lg bg-custom-white hover:bg-light-gray transition-colors">
        <div className="text-center">
          <p className="text-2xl font-semibold text-[#7C7676]">Upload Image</p>
          <p className="mt-1 text-[#ccc]">Restaurant photo</p>
          <div className="mt-6">
            <label
              htmlFor="file-upload"
              className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-[#3AADFF] border border-[#3AADFF] hover:bg-blue-50 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block w-5 h-5 mr-2 -mt-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Choose File</span>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept='image/*'/>
          </div>
        </div>
      </div>

  );
}

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
  const [vendorType, setVendorType] = useLocalStorage('vendorType', 'Car');
  let navItems = [
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


  return (
    <div className="w-48 bg-custom-white flex flex-col gap-2 p-2">
      {navItems}
    </div>
  );
};



export default function VendorSideNavbar() {
    const [vendorType] = useLocalStorage('vendorType', null);
    return (
        <div className='sticky top-0 w-56 h-[100vh] border-r-light-gray self-stretch bg-custom-white border border-pale-blue flex flex-col gap-4'>
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
                <PageOptionSide text='Booking History' href={paths.restaurant.all} active={vendorType === 'restaurant'}>
                    <TouristAttractionIcon />
                </PageOptionSide>
            </div>
        </div>
    )
}