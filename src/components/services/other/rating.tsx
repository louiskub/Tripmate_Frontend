import {Body, ButtonText, Caption, SmallTag, SubBody, SubCaption, Title} from '@/components/text-styles/textStyles'
import { Tag } from '@/components/services/other/Tag'

import { HotelSubtopicRating } from '@/models/service/detail/hotel-detail'
import Reviews from '@/models/service/reviews';

import {ratingText, ratingMeta} from '@/utils/service/rating'

import ArrowIcon from '@/assets/icons/pagination-arrow.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import { RestaurantSubtopicRating } from '@/models/service/detail/restaurant-detail';

type RatingOverviewProps = {
    rating: number
    rating_count: number
    subtopic_ratings: HotelSubtopicRating | RestaurantSubtopicRating
    comment?: string
    className?: string
    rating_meta: ratingMeta[]
}

export const RatingOverview = ({rating, rating_count, subtopic_ratings, comment, className, rating_meta}: RatingOverviewProps) => {

    return (
        <div className={`flex flex-col justify-between p-2.5 border border-light-gray rounded-[10px] ${className}`}>
            <div className='grid grid-cols-[auto_1fr] grid-rows-2 gap-x-2.5'>
                <div className="row-span-2 w-12 h-10 bg-pale-blue rounded-[10px] shadow-[0px_0px_10px_0px_var(--color-dark-blue)] border-2 border-custom-white inline-flex justify-center items-center gap-2.5">
                    <Title className='text-dark-blue'>{rating}</Title>
                </div>
                <ButtonText className='text-dark-blue'>{ratingText(rating)}</ButtonText>
                <button 
                    className='hover:cursor-pointer col-start-2 flex justify-self-start '
                    onClick={ () => {
                        document.getElementById('review')?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    <Caption className='text-dark-gray flex items-center h-4'>
                        from {rating_count} reviews
                        <ArrowIcon width='10'/>
                    </Caption>
                </button>
            </div>

            <ul className='flex flex-wrap'>
                {rating_meta.map((meta) => (
                    <li
                        key={meta.key}
                    >
                        <Tag text={`${meta.label} ${subtopic_ratings[meta.key as keyof (HotelSubtopicRating | RestaurantSubtopicRating)]}`} />
                    </li>
                ))}
            </ul>

            {comment && <div className='flex flex-col gap-2 basis-1/2'>
                <Caption className='text-dark-gray'>What guest says</Caption>
                <Caption className='h-full max-h-full p-2 border border-light-blue rounded-lg overflow-auto custom-scroll-bar'>
                    {comment}
                </Caption>
            </div>}
        </div>
    )
}


type RatingProps = {
    rating: number
    rating_count: number
    subtopic_ratings: HotelSubtopicRating | RestaurantSubtopicRating
    reviews?: Reviews[]
    className?: string
    rating_meta: ratingMeta[]
}

export const Rating = (rating: RatingProps) => {

    return (
        <div className={`flex flex-col gap-2 grid-rows-2 justify-between rounded-[10px] ${rating.className}`}>
            <div className='grid grid-cols-[auto_1fr] py-4 px-24 gap-28 border-b border-light-gray'>  
                <div className='grid grid-cols-[auto_1fr] grid-rows-2 gap-x-2.5 self-center justify-self-center'>
                    <div className="row-span-2 w-12 h-10 bg-pale-blue rounded-[10px] shadow-[0px_0px_10px_0px_var(--color-dark-blue)] border-2 border-custom-white inline-flex justify-center items-center gap-2.5">
                        <Title className='text-dark-blue'>{rating.rating}</Title>
                    </div>
                    <ButtonText className='text-dark-blue'>{ratingText(rating.rating)}</ButtonText>
                    <button 
                        className='hover:cursor-pointer col-start-2 flex justify-self-start '
                        onClick={ () => {
                            document.getElementById('review')?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        <Caption className='text-dark-gray flex items-center h-4'>
                            from {rating.rating_count} reviews
                            <ArrowIcon width='10'/>
                        </Caption>
                    </button>
                </div>

                <ul className='flex flex-col gap-2.5'>
                    {rating.rating_meta.map((meta) => (
                        <li
                            key={meta.key}
                        >
                            <SubtopicRating topic={meta.label} rating={rating.subtopic_ratings[meta.key as keyof (HotelSubtopicRating | RestaurantSubtopicRating)]}/>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex flex-col row-start-2 col-span-2 gap-2'>
                {
                    rating.reviews?.map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))
                }
            </div>
        </div>
    )
}

type SubtopicRatingProps = {
    topic: string
    rating: number
}

const SubtopicRating = ({topic, rating}: SubtopicRatingProps) => {
    return (
        <div className='flex items-center w-full text-dark-blue gap-2.5'>
            <Body className='w-30'>{topic}</Body>
            <div className='bg-pale-blue rounded-full w-full h-2.5'>
                <div 
                    className='bg-dark-blue rounded-full h-full'
                    style={{ width: `${(rating / 10) * 100}%` }}
                />
            </div>
            <SubBody className='w-6'>{rating}</SubBody>
        </div>
    )
}

type ReviewCardProps = {
    review: Reviews
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    return (
        <div className="px-5 py-4 rounded-[10px] border border-light-gray flex gap-1.5">
            <div className="w-48 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    {
                        review.user_profile ? 
                        <img
                            className="flex-shrink-0 object-cover rounded-full w-4 h-4 aspect-square"
                            src={review.user_profile} />
                        :
                        <ProfileIcon width="16"/>
                    }
                    
                    <SubBody>{review.user}</SubBody>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1.5">
                <Tag className='gap-0.5! bg-pale-blue px-2.5 text-dark-blue'>
                    <SmallTag>{review.rating}</SmallTag>
                    <SubCaption className='text-dark-gray'>/10</SubCaption>
                </Tag>
                <Caption className=''>{review.comment}</Caption>
                <div className='flex w-full justify-between'>
                    <div className='flex gap-1.5'>
                        {
                            review.pictures?.map((pic, i) => (
                                <img key={i} 
                                className="flex-shrink-0 object-cover rounded-[10px] w-20 h-20 aspect-square"
                                src={pic} />
                            ))
                        }
                    </div>
                    <Caption className="self-end text-custom-gray">{review.date}</Caption>
                </div>
            </div>
        </div>
    )
}