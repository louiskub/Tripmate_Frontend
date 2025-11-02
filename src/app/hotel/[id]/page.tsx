import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import HotelDetailModel from '@/models/service/detail/hotel-detail';
import HotelDetail from '@/components/services/pages/hotel-detail';
import { mockHotel1 } from '@/mocks/hotels';

export default async function HotelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    
    const response = await axios.get(endpoints.hotel.detail(id));
    const data = response.data;
    console.log(data)
    const hotel: HotelDetailModel = {
      ...data,
      review: [],
      subtopic_ratings: data.subtopicRatings,
      policy: {
        breakfast: data.breakfast,
        check_in: data.checkIn,
        check_out: data.checkOut,
        contact: data.contact
      },
      nearby_locations: data.nearbyLocations,
      room: mockHotel1.room,
      lat: data.service.location.lat,
      long: data.service.location.long,

    }
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
