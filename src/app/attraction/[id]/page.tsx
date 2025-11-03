import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import AttractionDetailModel from '@/models/service/detail/attraction-detail';
import AttractionDetail from '@/components/services/pages/attraction-detail';
import { attraction_detail } from '@/mocks/attractions';
import { getNearbyLocations } from '@/utils/service/get-functions';

export default async function RentalCarDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const response = await axios.get(endpoints.attraction.detail(id));
    const data = response.data;

    const get_nearby_locations = await getNearbyLocations(data.location.lat, data.location.long)
    console.log(get_nearby_locations)

    const service: AttractionDetailModel = {
      name: data.name ?? '',
      type: data.type ?? '',
      location: data.zone ?? '',
      pictures: data.pictures?.slice(0, 3) ?? [],
      favorite: data.favorite ?? false,
      id: data.id,
      description: data.description ?? '',
      nearby_locations: get_nearby_locations,
      lat: data.location.lat,
      long: data.location.long,
    }
    return <AttractionDetail service={service} />;
  } 
  catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
}
