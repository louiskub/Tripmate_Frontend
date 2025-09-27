import DefaultPage from '@/components/layout/default-layout';
import ProfileNavbar from '@/components/navbar/side-nav-variants/profile-side-navbar';

// ---------------- ReviewCard ----------------
type ReviewCardProps = {
  name: string;
  service: string;
  score: number;
  review: string;
  date: string;
};

const ReviewCard = ({ name, service, score, review, date }: ReviewCardProps) => (
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
        <div className="w-20 h-20 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-lg" />
      </div>
      <span className="text-xs text-gray text-right">{date}</span>
    </div>
  </div>
);

// ---------------- Page ----------------
// export default function AccountPage() {
  

//   return (
//     <div className="w-[1216px] flex gap-5 p-7">
//       <Sidebar />
//       <div className="flex-1 flex flex-col gap-4">
//         <h1 className="text-2xl font-extrabold text-custom-black">Reviews</h1>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 bg-custom-white shadow p-2 rounded-[10px]">
//           {["Hotel", "Restaurant", "Rental Car", "Guide", "Attraction"].map((tab) => (
//             <button
//               key={tab}
//               className="px-4 py-1 rounded-md text-base font-medium text-gray hover:bg-pale-blue hover:text-dark-blue"
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium text-custom-black">
//             {reviews.length} reviews
//           </span>
//           <div className="flex gap-4">
//             <span className="text-base font-medium text-custom-black">Sort by option1</span>
//             <span className="text-base font-medium text-custom-black">View</span>
//           </div>
//         </div>

//         {/* Reviews List */}
//         <div className="flex flex-col gap-4">
//           {reviews.map((r, idx) => (
//             <ReviewCard key={idx} {...r} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function ReviewHistory() {
  const reviews = [
    {
      name: "John Doe",
      service: "Hotel",
      score: 10,
      review:
        "The staff are friendly and listen to customer feedback and use it to improve. The hotel is constantly being developed and improved.",
      date: "12 Aug 2025",
    },
    {
      name: "Jane Smith",
      service: "Restaurant",
      score: 9.5,
      review: "Great food and very welcoming atmosphere.",
      date: "10 Aug 2025",
    },
  ];
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
                    className="px-4 py-1 rounded-md text-base font-medium text-gray hover:bg-pale-blue hover:text-dark-blue"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-custom-black">
                  {reviews.length} reviews
                </span>
                <div className="flex gap-4">
                  <span className="text-base font-medium text-custom-black">Sort by option1</span>
                  <span className="text-base font-medium text-custom-black">View</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="flex flex-col gap-4">
                {reviews.map((r, idx) => (
                  <ReviewCard key={idx} {...r} />
                ))}
              </div>
            </div>
          </div>
        </div>
    </DefaultPage>
  );
}
