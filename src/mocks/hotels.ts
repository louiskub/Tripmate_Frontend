import HotelDetail from "@/models/service/detail/hotel-detail"
import HotelCardProps from "@/models/service/card/hotel-card"

export const hotels: HotelCardProps[] = [
    {
        name: 'Centre Point Prime Hotel Pattaya',
        star: 5,
        rating: 8.7,
        rating_count: 1808,
        location: 'South Pattaya, Pattaya',
        price: 1809.33,
        type: 'hotel',
        pictures: 
        ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
        ],
        favorite: true,
        hotel_id: 'svc-001'
    },
    {
        name: 'Centre Point Prime Hotel Pattaya',
        star: 5,
        rating: 8.7,
        rating_count: 1808,
        location: 'South Pattaya, Pattaya',
        price: 1809.33,
        type: 'hotel',
        pictures: 
        ['https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
            'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640'
        ],
        favorite: false,
        hotel_id: 'svc-002'
    }
]


export const mockHotel1: HotelDetail = 
{
    name: 'Centre Point Prime Hotel Pattaya',
    type: 'hotel',
    star: 5,

    description: 'Staying at Centre Point Prime Hotel Pattaya is a good choice when you are visiting Na Kluea. 24-hours front desk is available to serve you, from check-in to check-out, or any assistance you need. Should you desire more, do not hesitate to ask the front desk, we are always ready to accommodate you. WiFi is available within public areas of the property to help you to stay connected with family and friends.',

    pictures: 
    [
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6d207fe600a2de57f0b4e8f7bd0dc74d.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-48dbaff76038a1598d6460554dd16bf2.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-ed2a0d87cecc0f5fd602a8935c648e14.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-5ac28fd0584f23fe5ef2c37c8c8e1fe0.jpeg?_src=imagekit&tr=dpr-2,c-at_max,f-jpg,fo-auto,h-162,pr-true,q-80,w-234.66666666666666',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-85627bb14c6f166f0be7eb1d2c09811e.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-a6b0ba1797253e1027d3ec811a5c4b02.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
        'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-3f31d631a4a3fe157c237167537fcaba.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-40,w-640',
        'https://ik.imagekit.io/tvlk/generic-asset/TzEv3ZUmG4-4Dz22hvmO9NUDzw1DGCIdWl4oPtKumOg=/lodging/31000000/30540000/30530900/30530835/89cc498e_z.jpg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-40,w-640',
        'https://ik.imagekit.io/tvlk/generic-asset/Xu2nMkuFryWbglwGb9u8HF1tDA7YkFEKtvXcoaIy0V2uaMwwbgeWu94ExJkiy1+S/4/RoomImage/v2/1083665/5828735/69313770/168371014.jpg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-40,w-640',
        'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-1c450af3e4efd97b13aa7a7d4f0bb564.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-360,pr-true,q-80,w-640',
    ],

    facilities: 
    {
        health: [
            '24-Hour Front Desk',
            'Dinner restaurant',
            'Room service',
            'Spa',
            'Massage',
            'Garden',
            'Fitness center',
            'Kids club',
            'Laundry',
        ],
        internet: [
            '24-Hour Front Desk',
            'Dinner restaurant',
            'Room service',
            'Spa',
            'Massage',
            'Garden',
            'Fitness center',
            'Kids club',
            'Laundry',
        ],
        food: [
            'Dinner restaurant',
            'Room service'
        ],
        accessibility: [
            '24-Hour Front Desk',
            'Dinner restaurant',
            'Room service',
            'Spa',
            'Massage',
            'Garden',
            'Fitness center',
            'Kids club',
            'Laundry'
        ],
        services: [
            'Room service',
            'Spa',
            'Massage',
            'Garden',
            'Fitness center',
        ],
        transportation: [
            'Dinner restaurant',
            'Room service',
            'shuttle bus'
        ]
    },

    rating: 8.7,
    subtopic_ratings: {
        cleanliness: 9.1,
        comfort: 8.9,
        meal: 8.3,
        location: 8.6,
        service: 8.9,
        facilities: 8.9
    },
    rating_count: 1628,
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

    room: [
        {
            name: 'Deluxe King',
            pictures: [
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-005f1458cc7fc0aa14c5f36d9b043cb9.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724',
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-4eb30c3b07fa7a6e07cd8001f19a9637.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724',
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-67da52a19e6abd1f0e424ccb04df0495.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724',
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6fafb2e9d44f744b17aa52531dedb213.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724'
            ],
            room_options: [
                {
                    name: 'Breakfast not Included',
                    bed: 'double bed',
                    max_guest: 2,
                    price: 1504.50,
                },
                {
                    name: 'Breakfast Included',
                    bed: 'double bed',
                    max_guest: 2,
                    price: 1976.50,
                }
            ],
            size: 28,
            facility: [
                'Shower',
                'Balcony / terrace',
                'Microwave',
                'Hot water',
                'Kitchenette',
                'Refrigerator',
                'Air conditioning',
            ]
        },
        {
            name: 'Deluxe Premier King',
            pictures: [
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-005f1458cc7fc0aa14c5f36d9b043cb9.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724',
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-4eb30c3b07fa7a6e07cd8001f19a9637.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724',
                'https://ik.imagekit.io/tvlk/generic-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20016086-6fafb2e9d44f744b17aa52531dedb213.jpeg?_src=imagekit&tr=c-at_max,f-jpg,h-460,pr-true,q-40,w-724'
            ],
            room_options: [
                {
                    name: 'Breakfast Included',
                    bed: 'double bed',
                    max_guest: 2,
                    price: 2087.50,
                }
            ],
            size: 33,
            facility: [
                'Non-smoking',
                'Free WiFi',
                'Shower',
                'Balcony / terrace',
                'Microwave',
                'Hot water',
                'Kitchenette',
                'Refrigerator',
                'Air conditioning',
            ]
        }
    ],

    policy: {
        check_in: "From 14:00",
        check_out: "Before 12:00",
        breakfast: "Everyday 6:00 - 11:00",
        pet_allow: false,
        contact: "0123456789"
    },
}