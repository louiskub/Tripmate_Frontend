import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import RentalcarDetailModel from '@/models/service/detail/rental-car';
import RentalCarDetail from '@/components/services/pages/rental-car-detail';
import { rental_car_detail } from '@/mocks/rental-cars';

export default async function RentalCarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <RentalCarDetail service={rental_car_detail}/>

  try {
    const response = await axios.get<RentalcarDetailModel>(endpoints.rental_car.detail(id));
    const hotel = response.data;
    return <RentalCarDetail service={hotel} />;

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
