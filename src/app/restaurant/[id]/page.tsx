import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import RestaurantDetailModel from '@/models/service/detail/restaurant-detail';
import RestaurantDetail from '@/components/services/pages/restaurant-detail';
import { restaurant_detail } from '@/mocks/restaurants';

export default async function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id)
  try {
    const response = await axios.get(endpoints.restaurant.detail(id));
    const data = response.data;
    console.log(data)
    const service: RestaurantDetailModel = {
      name: data.name ?? '',
      description: data.description,
      pictures: data.pictures ?? [],
      rating: data.rating ?? 0, //ไม่มี
      subtopic_ratings: data.subtopicRatings,
      rating_count: data.service?.reviews?.length ?? 0, //none
      review: data.service?.reviews,
      menu: data.menu,
      location: data.service?.location?.zone ?? '',     // if location exists
      nearby_locations: data.nearbyLocations || [],  
      favorite: data.favorite ?? false,
      cuisine: data.cuisine,
      id: data.id ?? '',
    }
    return <RestaurantDetail service={service} />;

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
