"use client";
import DefaultPage from '@/components/layout/default-layout';
import ProfileNavbar from '@/components/navbar/side-nav-variants/profile-side-navbar';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// ---------------- ReviewCard ----------------
type ReviewCardProps = {
  name: string;
  service: string;
  score: number;
  review: string;
  date: string;
  viewOption: string;
};


const reviews = [
  {
    name: "John Doe",
    service: "Hotel",
    score: 10,
    review: "The staff are friendly and listen to customer feedback and use it to improve. The hotel is constantly being developed and improved.",
    date: "12 Aug 2025",
  },
  {
    name: "Jane Smith",
    service: "Restaurant",
    score: 9.5,
    review: "Great food and very welcoming atmosphere.",
    date: "10 Aug 2025",
  },
  {
    name: "Alice Johnson",
    service: "Attraction",
    score: 8.5,
    review: "A must-visit place with stunning views.",
    date: "5 Aug 2025",
  },
  {
    name: "Bob Brown",
    service: "Rental Car",
    score: 9.0,
    review: "The car was in excellent condition and the service was top-notch.",
    date: "1 Aug 2025",
  },
  {
    name: "Charlie Davis",
    service: "Guide",
    score: 9.5,
    review: "An unforgettable experience with a knowledgeable guide.",
    date: "3 Aug 2025",
  }
];


const ReviewCard = ({ name, service, score, review, date, viewOption }: ReviewCardProps) => {
  if (viewOption === "List")
    return (
    <div className="w-full p-4 rounded-[10px] border border-light-gray flex gap-4">
      <div className="w-48 flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-custom-black" />
          <span className="text-sm font-medium text-custom-black">{name}</span>
        </div>
        <span className="text-xs text-gray">{service}</span>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="px-2 py-0.5 bg-pale-blue rounded-2xl inline-flex items-center gap-1 w-fit">
          <span className="text-xs font-medium text-dark-blue">{score.toFixed(1)}</span>
          <span className="text-[10px] text-gray">/10</span>
        </div>
        <p className="text-xs text-custom-black">{review}</p>
        <div className="flex gap-2">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/17/7f/a5/big-beach.jpg?w=900&h=500&s=1"
            alt="Review Image"
            className="w-40 h-40 rounded-lg"
          />
          {/* <div className="w-20 h-20 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-lg" /> */}
        </div>
        <span className="text-xs text-gray text-right">{date}</span>
      </div>
    </div>
  )
  return (
      <div className="w-full p-4 rounded-[10px] border border-light-gray bg-custom-white flex flex-col gap-3">
    {/* Header: Name, Service, and Score */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-4 h-4 bg-custom-black rounded-full flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-custom-black truncate">{name}</span>
          <span className="text-xs text-gray">{service}</span>
        </div>
      </div>
      <div className="px-2.5 py-1 bg-pale-blue rounded-full flex items-center gap-1 flex-shrink-0">
        <span className="text-xs font-semibold text-dark-blue">{score.toFixed(1)}</span>
        <span className="text-[10px] text-gray">/10</span>
      </div>
    </div>

    {/* Review Text */}
    <p className="text-sm text-custom-black leading-relaxed">{review}</p>

    {/* Image */}
    <div className='mt-auto'>
        <img
        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/17/7f/a5/big-beach.jpg?w=900&h=500&s=1"
        alt="Review"
        className="w-full h-32 object-cover rounded-lg"
      />

      {/* Date */}
      <span className="text-xs text-gray">{date}</span>
    </div>
    
  </div>
  )
}

export default function ReviewHistory() {
  // useEffect(() => {
  //   document.documentElement.setAttribute('data-theme', 'dracula');
  //   console.log("theme: ", document.documentElement.getAttribute('data-theme'));
  // }, [])
  const [sortOption, setSortOption] = useState("option1");
  const [viewOption, setViewOption] = useState("List");
  const [filterReview, setFilterReview] = useState("All");
  const [remainReview, setRemainReview] = useState(reviews);
  const filterRemainReview = (filter: string) => {
    if (filter == filterReview)
      filter = "All"
    setFilterReview(filter);

    if (filter == "All") 
      setRemainReview(reviews);
    else 
      setRemainReview(reviews.filter(r => r.service == filter));
  }
  
  return (
    <DefaultPage>
        <div className='bg-custom-white -m-1 p-2 pt-5 rounded-lg'>
          <div className='flex gap-5'>
            <ProfileNavbar />
            <div className="flex-1 flex flex-col gap-4 ">
              <h1 className="text-2xl font-extrabold text-custom-black">Reviews</h1>

              {/* Filter Tabs */}
              <div className="flex gap-2 bg-custom-white shadow p-2 rounded-[10px]">
                {["Hotel", "Restaurant", "Rental Car", "Guide", "Attraction"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-1 rounded-md text-base font-medium text-gray hover:bg-pale-blue hover:text-dark-blue 
                      ${filterReview == tab ? "bg-pale-blue text-dark-blue" : ""}`}
                    onClick={() => filterRemainReview(tab)}
                    
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-custom-black">
                  {remainReview.length} reviews
                </span>
                <div className="flex gap-4">
                  <select defaultValue="" className="text-custom-black d-select w-fit" onChange={(e) => setSortOption((e.target as HTMLSelectElement).value)}>
                    <option value="" disabled>Sort by option</option>
                    <option value="option1">Sort by option1</option>
                  </select>
                  <select defaultValue="" className="text-custom-black d-select w-fit" onChange={(e) => setViewOption((e.target as HTMLSelectElement).value)}>
                    <option value="" disabled>View</option>
                    <option value="List">List</option>
                    <option value="Grid">Grid</option>
                  </select>
                  {/* <button className="text-base font-medium text-custom-black">View</button> */}
                </div>
              </div>

              {/* Reviews List */}
              <div className={`gap-4 ${viewOption === "Grid" ? "grid grid-cols-2 lg:grid-cols-3" : "flex flex-col"}`}>
                {remainReview.map((r, idx) => (
                  <ReviewCard viewOption={viewOption} key={idx} {...r} />
                ))}
              </div>
            </div>
          </div>
        </div>
    </DefaultPage>
  );
}
