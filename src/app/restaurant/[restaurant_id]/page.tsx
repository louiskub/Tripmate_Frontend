import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import RestaurantDetailModel from '@/models/service/detail/restaurant-detail';
import RestaurantDetail from '@/components/services/pages/restaurant-detail.tsx';
import { restaurant_detail } from '@/mocks/restaurants';

export default async function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <RestaurantDetail service={restaurant_detail}/>

  try {
    const response = await axios.get<RestaurantDetailModel>(endpoints.restaurant.detail(id));
    const hotel = response.data;
    return <RestaurantDetail service={hotel} />;

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
