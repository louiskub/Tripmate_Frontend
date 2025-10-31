import GuideCardProps from "@/models/service/card/guide-card";
import GuideDetail from "@/models/service/detail/guide-detail";

const guides: GuideCardProps[] = [
    {
        id: '1',
        name: 'Bangkok Old Town Cultural Walk',
        type: 'city tour',
        price: 1200,
        pictures: [
            'https://static.wixstatic.com/media/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg/v1/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg',
            'https://www.expique.com/wp-content/uploads/2021/01/Grand-Palace-7.jpg',
            'https://lp-cms-production.imgix.net/2021-06/GettyRF_620722958.jpg?w=1920&h=640&fit=crop&crop=faces%2Cedges&auto=format&q=75'
        ],
        duration: "03:30",
        rating: 4.0,
        rating_count: 12345,
        location: 'Bangkok, Thailand',
        favorite: true,
        guider: {
            username: "37f66c3b-2edd-4a36-b6db-5dabd2a783c1",
            profile_pic: "",
            first_name: "Somsak",
            last_name: "Phanpipat"
        },
    }
]

const guide_detail: GuideDetail = {
    name: "Bangkok Old Town Cultural Walk",
    type: 'city tour',
    guider: {
        username: "2fe5f9cf-bb15-4543-b57a-73a443914c4f",
        profile_pic: "",
        first_name: "Somsak",
        last_name: "Phanpipat"
    },
    duration: "03:00",
    price: 1200, // THB
    pictures: [
        'https://static.wixstatic.com/media/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg/v1/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg',
        'https://www.expique.com/wp-content/uploads/2021/01/Grand-Palace-7.jpg',
        'https://lp-cms-production.imgix.net/2021-06/GettyRF_620722958.jpg?w=1920&h=640&fit=crop&crop=faces%2Cedges&auto=format&q=75'
    ],
    rating: 9.6,
    subtopic_ratings: {
        knowledge: 9.6,
        communication: 9.6,
        punctuality: 9.6,
        safety: 9.6,
        route_planning: 9.6,
        local_insights: 9.6
    },
    rating_count: 0,
    location: "Bangkok, Thailand",
    nearby_locations: ["Wat Pho", "Grand Palace", "Tha Maharaj", "Wat Arun"],
    policy: {
        start: "09:00",
        end: "12:00",
        max_guest: 8,
        contact: "+66 81 234 5678"
    },
    favorite: false
};




export { guides, guide_detail }