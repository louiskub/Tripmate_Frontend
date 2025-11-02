import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import GuideDetailModel from '@/models/service/detail/guide-detail';
import GuideDetail from '@/components/services/pages/guide-detail';
import { guide_detail } from '@/mocks/guide';
import { getNearbyLocations, getProfile } from '@/utils/service/get-functions';
import { formatDate } from '@/utils/service/string-formatter';

export default async function GuideDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // return <GuideDetail service={guide_detail}/>
  
  
  try {
    const response = await axios.get(endpoints.guide.detail(id));
    const data = response.data;
    const profile = await getProfile(data.service.ownerId)
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

    console.log(profile)
    const guide: GuideDetailModel = {
      name: data.name,
      guider: {
        user_id: data.service.ownerId,
        profile_pic: profile?.profileImg,
        name: `${profile?.fname} ${profile?.lname}`
      },
      type: data.specialties,
      price: data.dayRate || 0,
      description: data.description || '',
      pictures: data.pictures ?? [],
      rating: data.rating,
      subtopic_ratings: data.subtopicRatings,
      rating_count: data.service?.reviews?.length ?? 0,
      review: reviews,
      location: data.service.location.zone ?? '',
      nearby_locations: get_nearby_locations,
      policy: {
        mon_fri: data.availability.mon_fri,
        weekend: data.availability.weekend,
        overtime: data.overtimeRate,
        contact: data.contact
      },
      id: data.id,
      favorite: data.favorite ?? false,
      lat: 0,
      long: 0
    }
    console.log(guide)

    return <GuideDetail service={guide} />;

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
