import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import RestaurantDetailModel from '@/models/service/detail/restaurant-detail';
import RestaurantDetail from '@/components/services/pages/restaurant-detail';
import { restaurant_detail } from '@/mocks/restaurants';
import { getNearbyLocations, getProfile } from '@/utils/service/get-functions';
import { formatDate } from '@/utils/service/string-formatter';

export default async function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id)
  try {
    const response = await axios.get(endpoints.restaurant.detail(id));
    const data = response.data;
    console.log(data)
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

    const get_nearby_locations = await getNearbyLocations(data.service.location.lat, data.service.location.long)
    console.log(get_nearby_locations)

    const service: RestaurantDetailModel = {
      name: data.name ?? '',
      description: data.description,
      pictures: data.pictures ?? [],
      rating: data.rating ?? 0, //ไม่มี
      subtopic_ratings: data.subtopicRatings,
      rating_count: data.service?.reviews?.length ?? 0, //none
      review: reviews,
      menu: data.menu,
      location: data.service?.location?.zone ?? '', // if location exists
      nearby_locations: get_nearby_locations,
      favorite: data.favorite ?? false,
      cuisine: data.cuisine,
      id: data.id ?? '',
      lat: 0,
      long: 0
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
