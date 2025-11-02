'use client'

import ProfilePageLayout from '@/components/layout/profile-page-layout';
import { Button, TextButton } from '@/components/buttons/buttons'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { paths } from '@/config/paths.config'

import HotelCard from '@/components/services/service-card/hotel-card';
import RestaurantCard from '@/components/services/service-card/restaurant-card';
import RentalCarCard from '@/components/services/service-card/rental-car-card';
import GuideCard from '@/components/services/service-card/guide-card';
import AttractionCard from '@/components/services/service-card/attraction-card';
// import TripCard from '@/components/services/service-card/trip-card'
import { FavoriteProps } from '@/models/favorite';
import { favorite_data_mock } from '@/mocks/favorite';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUserIdFromToken } from '@/utils/service/cookie';
import { endpoints } from '@/config/endpoints.config';
import axios from 'axios';
import HotelCardProps from '@/models/service/card/hotel-card';
import RentalCarCardProps from '@/models/service/card/rental-car-card';
import { getCarRentalCenter, getProfile } from '@/utils/service/get-functions';
import RestaurantCardProps from '@/models/service/card/restaurant-card';
import GuideCardProps from '@/models/service/card/guide-card';
import AttractionCardProps from '@/models/service/card/attraction-card';

export default function Favorite() {
  const [currentTab, setCurrentTab] = useState("hotel");
  const [data, setData] = useState<FavoriteProps>(favorite_data_mock)

  const currentServices = data[currentTab as keyof FavoriteProps]

  const tabs: tab[] = [
        {label: 'Hotel', id: 'hotel'},
        {label: 'Restaurant', id: 'restaurant'},
        {label: 'Rental Car', id: 'rental_car'},
        {label: 'Guide', id: 'guide'},
        {label: 'Attraction', id: 'attraction'},
        {label: 'Trip', id: 'trip'},
  ]

  useEffect(() => {
    const token = Cookies.get("token");
    const user_id = getUserIdFromToken(token)
    if (!token || !user_id) return;

    const fetchFavorite = async () => {
    try {
        const attraction = await axios.get(endpoints.favorite_page(user_id, 'place'), {
        headers: { Authorization: `Bearer ${token}` },
        });
        const restaurant = await axios.get(endpoints.favorite_page(user_id, 'restaurant'), {
        headers: { Authorization: `Bearer ${token}` },
        });
        const guide = await axios.get(endpoints.favorite_page(user_id, 'guide'), {
        headers: { Authorization: `Bearer ${token}` },
        });
        const hotel = await axios.get(endpoints.favorite_page(user_id, 'hotel'), {
        headers: { Authorization: `Bearer ${token}` },
        });
        const car = await axios.get(endpoints.favorite_page(user_id, 'car_rental_center'), {
        headers: { Authorization: `Bearer ${token}` },
        });

        console.log(attraction)
        console.log(restaurant)
        console.log(guide)
        console.log(hotel)
        console.log(car)

        const hotels: HotelCardProps[] = hotel.data.map((d: any) => {
        const prices = d.rooms?.flatMap((r: any) => r.room_options?.map((opt: any) => opt.price) ?? []) ?? [];
          return {
            ...d,
            id: d.hotel_id
          };
        });

        const restaurants: RestaurantCardProps[] = restaurant.data.map((d: any) => {
          return {
            ...d,
            favorite: d.favorite ?? false,
            tag: d.cuisine,
            id: d.id,
          };
        });

        const cars: RentalCarCardProps[] = await Promise.all(
          car.data.map(async (d: any) => {
            const car_center = await axios.get(endpoints.car_center(d.rental_car_id));
            console.log(car_center)
            return {
              name: d.name ?? '',
              owner: {
                id: d.crcId ?? '',   
                profile_pic: d.owner.profile_pic,     // no profile_pic
                name: d.owner.name,            // no owner name
              },
              rating: d.rating ?? 0, //ไม่มี
              rating_count: d.service?.reviews?.length ?? 0, //none
              location: d.service?.location?.zone ?? '',     // if location exists
              price: d.pricePerDay ? Number(d.pricePerDay) : 0, // convert string to number
              brand: d.brand ?? '',
              model: d.model ?? '',
              pictures: d.pictures?.slice(0, 3) ?? [],
              favorite: d.favorite ?? false,
              id: d.id ?? '',
            };
          })
        );

        const guides: GuideCardProps[] = await Promise.all(
        guide.data.map(async (d: any) => {
          const profile = await axios.get(endpoints.profile(user_id), {
            headers: { Authorization: `Bearer ${token}` },
            });
          return {
            ...d,
            guider: {
              user_id: d.guider.user_id,
              profile_pic: d.guider.profile_pic,
              name: `${d.guider.first_name} ${d.guider.last_name}`
            },
            type: null,
            pictures: d.pictures?.slice(0, 3) ?? [],
            favorite: d.favorite ?? false,
          };
        })
      );

      const attractions: AttractionCardProps[] = attraction.data.map((d: any) => {
        return {
          name: d.name ?? '',
          type: d.type ?? '',
          location: d.zone ?? '',
          pictures: d.pictures?.slice(0, 3) ?? [],
          favorite: d.favorite ?? false,
          id: d.id,
        };
      });

        const favData: FavoriteProps = {
          hotel: hotels,
          restaurant: restaurants,
          rental_car:cars,
          guide: guides,
          attraction: attractions,
          trip: [''],
        }

        console.log(favData)

        setData(favData);
    } catch (err) {
        console.error("Failed to fetch profile", err);
    }
    };

    fetchFavorite();
}, []);

  return (
    <ProfilePageLayout>
        <div className="flex-1 px-5 py-2.5 flex flex-col gap-2.5">
          <div className='flex justify-between'>
              <PageTitle>Favorite</PageTitle>
          </div>
          
          <FavoriteTab current_tab={currentTab} onSelect={setCurrentTab} tabs={tabs}/>

          <span className='flex justify-between p-1'>
            <Body>{currentServices && currentServices.length > 0 ? currentServices.length: 'No favorite'} {currentTab} found.</Body>
          </span>
          
          <div className="rounded-[10px] border-b border-light-gray flex flex-col">
            {currentTab === 'hotel' && data.hotel?.map((card, idx) => <HotelCard key={idx} {...card} />)}
            {currentTab === 'restaurant' && data.restaurant?.map((card, idx) => <RestaurantCard key={idx} {...card} />)}
            {currentTab === 'rental_car' && data.rental_car?.map((card, idx) => <RentalCarCard key={idx} {...card} />)}
            {currentTab === 'guide' && data.guide?.map((card, idx) => <GuideCard key={idx} {...card} />)}
            {currentTab === 'attraction' && data.attraction?.map((card, idx) => <AttractionCard key={idx} {...card} />)}
            {/* {currentTab === 'trip' && data.trip?.map((trip, i) => <TripCard key={i} trip={trip} />)} */}
          </div>    
      </div>
    </ProfilePageLayout>
  );
}

type tab = {
  label: string
  id: string
}

type TabProps = {
  current_tab: string;
  onSelect: (tab_id: string) => void;
  tabs: tab[]
}

const FavoriteTab = ({current_tab, onSelect, tabs}: TabProps) => {
    return (
        <div className='sticky top-15 z-10 flex gap-2.5 px-2 text-custom-gray items-center bg-custom-white mt-2 h-9.5 rounded-lg shadow-[var(--boxshadow-lifted)]'>
            {tabs.map((tab) => (
                <Button 
                    onClick={ () => {
                        onSelect(tab.id)
                        document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`h-7! rounded-md px-4! ${
                        current_tab === tab.id 
                        ? 'bg-pale-blue text-dark-blue'
                        : 'hover:text-dark-blue'
                    }`}
                    key={tab.id}
                    text={tab.label}
                />
            ))}
        </div>
    )
}
