import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import HotelDetailModel from '@/models/service/detail/hotel-detail';
import HotelDetail from '@/components/services/pages/hotel-detail';
import { mockHotel1 } from '@/mocks/hotels';

export default async function HotelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <HotelDetail service={mockHotel1}/>

  try {
    const response = await axios.get<HotelDetailModel>(endpoints.hotel.detail(id));
    const hotel = response.data;
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
