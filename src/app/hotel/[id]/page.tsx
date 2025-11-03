import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import HotelDetailModel from '@/models/service/detail/hotel-detail';
import HotelDetail from '@/components/services/pages/hotel-detail';
import { mockHotel1 } from '@/mocks/hotels';
import { getNearbyLocations, getProfile } from '@/utils/service/get-functions';
import { picture } from 'framer-motion/client';
import { formatDate } from '@/utils/service/string-formatter';

export default async function HotelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    
    const response = await axios.get(endpoints.hotel.detail(id));
    const data = response.data;

    
    const get_nearby_locations = await getNearbyLocations(data.service.location.lat.toFixed(2), data.service.location.long.toFixed(2))

    const reviews = await Promise.all(
      data.service.reviews.map(async (review: any) => {
        const profile = await getProfile(review.userId);
        return {
          user: `${profile?.fname} ${profile?.lname}`, // fixed duplicate fname
          user_profile: profile?.profileImg,
          rating: review.rating,
          comment: review.comment,
          pictures: review.image,
          date: formatDate(review.createdAt),
        };
      })
    );

    const hotel: HotelDetailModel = {
      ...data,
      review: reviews,
      subtopic_ratings: {
        cleanliness: data.subtopicRatings.cleanliness || 0,
        comfort: data.subtopicRatings.comfort || 0,
        meal: data.subtopicRatings.meal || 0,
        location: data.subtopicRatings.location || 0,
        service: data.subtopicRatings.service || 0,
        facilities: data.subtopicRatings.facilities || 0,
      },
      policy: {
        breakfast: data.breakfast,
        check_in: data.checkIn,
        check_out: data.checkOut,
        contact: data.contact
      },
      nearby_locations: get_nearby_locations || [],
      room: data?.rooms?.map((room: any) => ({
        id: room.id,
        name: room.name,
        pictures: room.pictures,
        room_options: room?.options?.map((o:any) => ({
          ...o
        })),
        size: room.sizeSqm,
        facility: room.facilities,
      })),
      lat: data.service.location.lat,
      long: data.service.location.long,
      id: data.id,
      facilities: {
        health: data.facilities.health,
        internet: data.facilities.internet,
        food: data.facilities.food,
        accessibility: data.facilities.accessibility,
        service: data.facilities.service,
        transportation: data.facilities.transportation,
      },
      favorite: data.service.bookmarks?.length > 0 ? true : false
    }

    console.log(hotel)
    
    return <HotelDetail service={hotel} />;

  } 
  catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error; // rethrow if you want caller to handle
  } 
}
