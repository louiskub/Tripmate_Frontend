import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import AttractionDetailModel from '@/models/service/detail/attraction-detail';
import AttractionDetail from '@/components/services/pages/attraction-detail';
import { attraction_detail } from '@/mocks/attractions';

export default async function RentalCarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <AttractionDetail service={attraction_detail}/>

  try {
    const response = await axios.get<AttractionDetailModel>(endpoints.attraction.detail(id));
    const hotel = response.data;
    return <AttractionDetail service={hotel} />;

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
