import RentalCarCardProps from '@/models/service/card/rental-car-card';
import RentalCarDetail from '@/models/service/detail/rental-car';
import Reviews from '@/models/service/reviews';

const rental_cars: RentalCarCardProps[] = 
[
    {
        name: 'Cheap Car for Rent',
        owner: {
        user_id: '37f66c3b-2edd-4a36-b6db-5dabd2a783c1',
        first_name: 'Mit',
        last_name: 'Shasheep',
        profile_pic: 'https://i.redd.it/help-me-find-instagram-account-of-this-cat-he-she-looks-so-v0-9329bx84mpud1.jpg?width=1080&format=pjpg&auto=webp&s=3e69817d9d72fd45c8cd6bd3505553009b0a4b0b'
        },
        rating: 8.8,
        rating_count: 1234,
        location: 'underwater',
        price: 4412.00,
        type: 'Luxury Car',
        pictures: 
        [
        "https://www.motoringresearch.com/wp-content/uploads/2025/03/000-Best-Luxury-Cars-to-Buy.jpg",
        "https://www.motoringresearch.com/wp-content/uploads/2025/03/000-Best-Luxury-Cars-to-Buy.jpg",
        ],
        favorite: false,
        id: 'Hee123'
    },
    {
        name: 'Cheap Car for Rent',
        owner: {
        user_id: '37f66c3b-2edd-4a36-b6db-5dabd2a783c1',
        first_name: 'Mit',
        last_name: 'Shasheep',
        profile_pic: ''
        },
        rating: 8.8,
        rating_count: 1234,
        location: 'underwater',
        price: 4412.00,
        type: 'Luxury Car',
        pictures: 
        [
        "https://www.motoringresearch.com/wp-content/uploads/2025/03/000-Best-Luxury-Cars-to-Buy.jpg",
        "https://www.motoringresearch.com/wp-content/uploads/2025/03/000-Best-Luxury-Cars-to-Buy.jpg",
        ],
        favorite: false,
        id: '213'
    },
]

const rental_car_detail: RentalCarDetail = {
    name: 'Cheap Car for Rent',
    owner: {
        id: '37f66c3b-2edd-4a36-b6db-5dabd2a783c1',
        profile_pic: 'https://i.redd.it/help-me-find-instagram-account-of-this-cat-he-she-looks-so-v0-9329bx84mpud1.jpg?width=1080&format=pjpg&auto=webp&s=3e69817d9d72fd45c8cd6bd3505553009b0a4b0b',
        name: 'Mit Shasheep',
    },
    brand: 'Luxury',
    model: 'car',
    price: 9999,
    pictures: [
        "https://www.motoringresearch.com/wp-content/uploads/2025/03/000-Best-Luxury-Cars-to-Buy.jpg",
        "https://www.motoringresearch.com/wp-content/uploads/2025/03/000-Best-Luxury-Cars-to-Buy.jpg",
    ],
    rating: 9.2,
    rating_count: 102,
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
    nearby_locations: ['Dusit Thani College Pattaya',
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
    services: {
        deposit: 1000,
        delivery: {
            in_local: 500,
            out_local: 1000
        },
        insurance: 500
    },
    policy: {
        pick_up: 'From 9.00',
        drop_off: 'Until 20.00',
        fuel: false,
        pet_allow: false,
        contact: '0812345678'
    },
    favorite: false
}

// const review: Reviews = {
//     user: '',
//     user_profile: '',
//     rating: 0,
//     comment: '',
//     pictures: [''],
//     date: '',
// }

export { rental_cars, rental_car_detail }