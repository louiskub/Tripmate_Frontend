// import TripHeader from "./trip-header";
// import TripSidebarLeft from "./trip-sidebar-left";
// import TripTimeline from "./trip-timeline";
// import TripSidebarRight from "./trip-sidebar-right";
// import DefaultLayout from "@/components/layout/default-layout";

// export default function TripPage() {
//   const tripData = {
//     title: "Trip to Pattaya",
//     tripId: "#123456",
//     isPrivate: true,
//     from: "Sat, 25 Aug 2025",
//     to: "Sun, 26 Aug 2025",
//     fromTime: "10:00",
//     toTime: "18:00",
//     location: "Pattaya Beach",
//     image: "https://placehold.co/300x200",
//     people: [
//       { name: "Louis", role: "Head", img: "https://placehold.co/28x28", isYou: true },
//       { name: "Connor", role: "Member", img: "https://placehold.co/28x28" },
//     ],
//     days: [
//       {
//         day: 1,
//         date: "25 Aug 2025",
//         events: [
//           { time: "10:00", title: "Meet at Station", desc: "description", place: "Bangkok" },
//           { time: "13:00", title: "Arrive at Restaurant", desc: "description", place: "Pattaya" },
//           { time: "15:30", title: "Check-in at Hotel", desc: "description", place: "Centara Hotel" },
//         ],
//       },
//     ],
//   };

//   return (
//     <DefaultLayout>
//         <TripHeader title={tripData.title} tripId={tripData.tripId} isPrivate={tripData.isPrivate} />
//         <div className="flex flex-col lg:flex-row gap-6">
//             <TripSidebarLeft
//                 from={tripData.from}
//                 to={tripData.to}
//                 fromTime={tripData.fromTime}
//                 toTime={tripData.toTime}
//                 location={tripData.location}
//                 image={tripData.image}
//             />
//             <TripTimeline days={tripData.days} />
//             <TripSidebarRight people={tripData.people} />
//         </div>
                
//     </DefaultLayout>
//     // <main className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6">
//     //   <TripHeader title={tripData.title} tripId={tripData.tripId} isPrivate={tripData.isPrivate} />
//     //   <div className="flex flex-col lg:flex-row gap-6">
        
//     //   </div>
//     // </main>
//   );
// }

import DefaultLayout from "@/components/layout/default-layout";
import TripEditor from "./trip";

export default function TripPage() {
    return (
        <DefaultLayout>
            <TripEditor />
        </DefaultLayout>
    );
}