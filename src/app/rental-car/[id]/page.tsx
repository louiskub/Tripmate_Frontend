import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import RentalcarDetailModel from '@/models/service/detail/rental-car';
import RentalCarDetail from '@/components/services/pages/rental-car-detail';
import { rental_car_detail } from '@/mocks/rental-cars';

export default async function RentalCarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id)
  // return <RentalCarDetail service={rental_car_detail}/>

  try {
    const response = await axios.get(endpoints.rental_car.detail(id));
    const data = response.data;
    console.log(data)
    const car: RentalcarDetailModel = {
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
    return <RentalCarDetail service={car} />;

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
