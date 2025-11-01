import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import GuideDetailModel from '@/models/service/detail/guide-detail';
import GuideDetail from '@/components/services/pages/guide-detail';
import { guide_detail } from '@/mocks/guide';

export default async function GuideDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // return <GuideDetail service={guide_detail}/>

  try {
    console.log(endpoints.guide.detail(id))
    const response = await axios.get(endpoints.guide.detail(id));
    const data = response.data;
    console.log(data)
    const guide: GuideDetailModel = {
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
    }
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
