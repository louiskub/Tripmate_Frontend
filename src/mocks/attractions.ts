import AttractionCardProps from '@/models/service/card/attraction-card';
import AttractionDetail from '@/models/service/detail/attraction-detail';
import { Children } from 'react';

const attractions: AttractionCardProps[] = [
    {
        id: '1',
        name: 'Grand Palace',
        type: 'Historical Landmark',
        price: 0,
        pictures: [
            'https://static.wixstatic.com/media/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg/v1/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg',
            'https://www.expique.com/wp-content/uploads/2021/01/Grand-Palace-7.jpg'
            ,'https://lp-cms-production.imgix.net/2021-06/GettyRF_620722958.jpg?w=1920&h=640&fit=crop&crop=faces%2Cedges&auto=format&q=75'
        ],
        rating: 9.6,
        rating_count: 12345,
        location: 'Bangkok, Thailand',
        favorite: true
    }
]

const attraction_detail: AttractionDetail = {
    name: 'Grand Palace',
    type: 'Historical Landmark',
    description: 'The Grand Palace is a complex of buildings at the heart of Bangkok, Thailand, and has been the official residence of the Kings of Siam since 1782.',
    fee: [
        {
            group: 'Thai',
            title: 'Children',
            price: 40,
        },
        {
            group: 'Thai',
            title: 'Adult',
            price: 200,
        },
        {
            group: 'Foreigner',
            title: 'Children',
            price: 120,
        },
        {
            group: 'Foreigner',
            title: 'Adult',
            price: 350,
        },
    ],
    pictures: [
        'https://static.wixstatic.com/media/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg/v1/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg',
        'https://www.expique.com/wp-content/uploads/2021/01/Grand-Palace-7.jpg'
        ,'https://lp-cms-production.imgix.net/2021-06/GettyRF_620722958.jpg?w=1920&h=640&fit=crop&crop=faces%2Cedges&auto=format&q=75'
    ],
    rating: 9.6,
    rating_count: 12345,
    review: [
        {
        user: 'Alice',
        comment: 'Amazing place, a must-visit in Bangkok!',
        pictures: ['https://cdn.royalgrandpalace.th/stocks/home_banner/d640x980/1g/j6/gsay1gj6ae/banner.jpg'],
        user_profile: 'https://www.dictionary.com/e/wp-content/uploads/2021/09/20210922_atw_memeStonk_800x800.png',
        rating: 10.0,
        date: '2025-10-10'
        },
        {
        user: 'Bob',
        comment: 'Beautiful architecture, but very crowded.',
        pictures: [],
        user_profile: 'https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_0_1023_742/master/1023.jpg?width=465&dpr=1&s=none&crop=none',
        rating: 8.0,
        date: '2025-10-08'
        }
    ],
    location: 'Bangkok, Thailand',
    nearby_locations: ['Wat Pho', 'Chao Phraya River', 'Khao San Road'],
    favorite: true
};



export { attractions, attraction_detail }