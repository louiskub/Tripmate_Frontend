import Review from "./service/reviews";
import HotelCardProps from "./service/card/hotel-card";
import RestaurantCardProps from "./service/card/restaurant-card";
import RentalCarCardProps from "./service/card/rental-car-card";
import GuideCardProps from "./service/card/guide-card";
import AttractionCardProps from "./service/card/attraction-card";
// import TripCardProps from "./service/card/trip-card";

export type FavoriteProps = {
    hotel?: HotelCardProps[],
    restaurant?:RestaurantCardProps[],
    rental_car?:RentalCarCardProps[],
    guide?: GuideCardProps[]
    attraction?: AttractionCardProps[],
    trip?: string[],
}