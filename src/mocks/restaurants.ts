import RestaurantCardProps from '@/models/service/card/restaurant-card';
import RestaurantDetail from '@/models/service/detail/restaurant-detail';

const restaurants: RestaurantCardProps[] = [
    {
        name: 'Pupen Seafood',
        rating: 8.8,
        rating_count: 1234,
        location: 'South Pattaya, Pattaya',
        pictures: 
        ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
        ],
        favorite: true,
        tag: 'seafood',
        restaurant_id: '1'
    },
    {
        name: 'Pupen Seafood',
        rating: 8.8,
        rating_count: 1234,
        location: 'South Pattaya, Pattaya',
        pictures: 
        ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
        ],
        favorite: true,
        tag: 'seafood',
        restaurant_id: '1'
    },
]

const restaurant_detail: RestaurantDetail = {
    name: 'Pupen Seafood',
    description: 'description',
    pictures: ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
    ],
    rating: 8.8,
    rating_count: 0,
    review: [
        {
            user: 'Kittipod S.',
            rating: 10.0,
            comment: "The staff are friendly and helpful. The price is good value for money. Breakfast is varied. There is a water park, a pool, sand for kids to play in, and a children's playroom. My kids love it.",
            date: "12 Aug 2025"
        },
        {
            user: 'd***i',
            rating: 9.7,
            comment: "Just stayed 1 night but it was an awesome experience. The room’s great, bathroom, bedroom, even have a microwave and complete dining utensils. Also The Waves, makes your children won’t stop playing. Great experience!",
            pictures: [
                'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752316449085_07b2b92d4070d001?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720'
            ],
            date: "12 Aug 2025"
        },
        {
            user: 'Pornphak B',
            rating: 8.9,
            comment: "The kids had a lot of fun and loved The Wave water park. They played for 2 days straight. No matter how hot the sun was, they still played and refused to go up. The hotel service was very good. I recommend it for families who want to take their children on a trip.",
            pictures: [
                'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752306872854_bd8bf3888d3aee1f?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720',
                'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752306697611_e5212ab8ab8a3c64?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720',
                'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752306697610_609da4c72d404c2c?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720',
            ],
            date: "12 Aug 2025"
        },
    ],
    location: '',
    nearby_locations: [
        'Dusit Thani College Pattaya',
        'Mini Siam',
        'Bangkok Pattaya Hospital',
        'Bangkok Pattaya Hospital',
        'CentralPlaza Marina Pattaya',
        'The Sanctuary of Truth',
        'Pattaya',
        'โรงเรียนมารีวิทย์ พัทยา',
        'Dusit Thani College Pattaya',
        'Mini Siam',
        'Bangkok Pattaya Hospital',
        'Bangkok Pattaya Hospital',
    ],
    favorite: false,
    subtopic_ratings: {
        cleanliness: 8.0,
        delicacy: 9.0,
        service: 9.6,
        location: 8.6,
        vibe: 7.5
    },
    menu: [
        'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752306872854_bd8bf3888d3aee1f?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720',
        'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752306697611_e5212ab8ab8a3c64?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720',
        'https://ik.imagekit.io/tvlk/ugc-review/guys1L+Yyer9kzI3sp-pb0CG1j2bhflZGFUZOoIf1YOBAm37kEUOKR41ieUZm7ZJ/ugc-photo-ap-southeast-1-581603780057-acd24e232f75f09e/REVIEW/REVIEW_1752306697610_609da4c72d404c2c?_src=imagekit&tr=c-at_max,h-1280,q-40,w-720',
    ],
    cuisine: ["Seafood", "Thai Food"]
}

export { restaurants, restaurant_detail }