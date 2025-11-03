import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import RentalcarDetailModel from '@/models/service/detail/rental-car';
import RentalCarDetail from '@/components/services/pages/rental-car-detail';
import { rental_car_detail } from '@/mocks/rental-cars';
import { getCarRentalCenter, getNearbyLocations, getProfile } from '@/utils/service/get-functions';
import { formatDate } from '@/utils/service/string-formatter';

export default async function RentalCarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const response = await axios.get(endpoints.rental_car.detail(id));
    const data = response.data;
    const profile = await getCarRentalCenter(data.crcId)
    console.log(profile?.data)

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

    const car: RentalcarDetailModel = {
      name: data.name ?? '',
      owner: {
        id: data.crcId ?? '',
        profile_pic: profile?.data.image, // no profile_pic
        name: profile?.data.name, // no owner name
      },
      rating: data.rating ?? 0, //ไม่มี
      rating_count: data.service?.reviews?.length ?? 0, //none
      review: reviews,
      location: data.service?.location?.zone ?? '', // if location exists
      nearby_locations: get_nearby_locations,
      price: data.pricePerDay ? Number(data.pricePerDay) : 0, // convert string to number
      brand: data.brand ?? '',
      model: data.model ?? '',
      description: data.description,
      pictures: data.pictures ?? [],
      favorite: data.favorite ?? false,
      id: data.id ?? '',
      services: {
        deposit: data.deposit,
        delivery: {
          in_local: 500,
          out_local: 1000,
        },
        insurance: 500,
      },
      policy: {
        fuel: data.fuelPolicy || false,
        seats: data.seats,
        contact: profile?.data.contacts.phone
      },
      lat: 0,
      long: 0
    }
    return <RentalCarDetail service={car} />;
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
