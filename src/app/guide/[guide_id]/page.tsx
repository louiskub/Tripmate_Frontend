import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import GuideDetailModel from '@/models/service/detail/guide-detail';
import GuideDetail from '@/components/services/pages/guide-detail';
import { guide_detail } from '@/mocks/guide';

export default async function RentalCarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <GuideDetail service={guide_detail}/>

  try {
    const response = await axios.get<GuideDetailModel>(endpoints.guide.detail(id));
    const hotel = response.data;
    return <GuideDetail service={hotel} />;

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
