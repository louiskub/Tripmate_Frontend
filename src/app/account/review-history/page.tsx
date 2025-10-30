"use client";
import DefaultPage from "@/components/layout/default-layout";
import ProfileNavbar from "@/components/navbar/side-nav-variants/profile-side-navbar";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import EditReviewPopup from "./edit-review-popup";

type ReviewCardProps = {
  name: string;
  coverImg?: string;
  service?: string;
  score: Record<string, number>;
  review: string;
  date: string;
  viewOption: string;
  img?: string[];
  location?: string;
};

// ---------------- Sample Reviews ----------------
const reviewsData: ReviewCardProps[] = [
  {
    name: "Pool Villa Resort",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh3PEPFGu-DCyBRIYE09C1ZKbM5MiTqA5hww&s",
    service: "Hotel",
    location: "Phuket, Thailand",
    score: {
      Cleanliness: 9,
      Service: 8,
      Facilities: 9,
      Comfort: 8,
      Value_for_money: 8,
    },
    review:
      "The staff are friendly and listen to customer feedback and use it to improve. The hotel is constantly being developed and improved.",
    date: "12 Aug 2025",
    img: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/17/7f/a5/big-beach.jpg?w=900&h=500&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/17/7f/a5/big-beach.jpg?w=900&h=500&s=1",
    ],
    viewOption: "List",
  },
  {
    name: "Seafood Delight",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWtBwPjoEDAH_Q_XsApIT9VSZ6p-qupAycyQ&s",
    service: "Restaurant",
    location: "Phuket, Thailand",
    score: {
      Overall: 9,
    },
    review:
      "Delicious seafood with a nice atmosphere. Friendly staff and great service!",
    date: "15 Aug 2025",
    img: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/17/7f/a5/big-beach.jpg?w=900&h=500&s=1",
    ],
    viewOption: "List",
  },
];

// ---------------- ReviewCard ----------------
const ReviewCard = ({
  name,
  coverImg,
  location,
  score,
  review,
  date,
  viewOption,
  img,
  onEdit,
  onDelete,
}: ReviewCardProps & {
  onEdit: (review: ReviewCardProps) => void;
  onDelete: (review: ReviewCardProps) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const average =
    Object.keys(score).length === 0
      ? 0
      : Object.values(score).reduce((a, b) => a + b, 0) /
        Object.keys(score).length;

  return (
    <div className="relative">
      <div className="w-full p-4 rounded-[10px] border border-light-gray flex flex-col gap-3 bg-custom-white hover:shadow-sm transition">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {/* <div className="w-10 h-10 rounded-full border border-light-gray flex items-center justify-center bg-white" /> */}
            <img src={coverImg}  
            // onError={"this.onerror=null; this.src='https://i.sstatic.net/y9DpT.jpg'"}
            alt="" className="w-10 h-10 rounded-full border border-light-gray flex items-center justify-center bg-white" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-custom-black">
                {name}
              </span>
              <span className="text-xs text-gray">{location}</span>
            </div>
          </div>

          {/* More button */}
          <div className="relative">
            <button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit({
                      name,
                      location,
                      score,
                      review,
                      date,
                      viewOption,
                      img,
                    });
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm text-custom-black hover:bg-gray-100"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete({
                      name,
                      location,
                      score,
                      review,
                      date,
                      viewOption,
                      img,
                    });
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-2 py-0.5 bg-pale-blue rounded-2xl inline-flex items-center gap-1 w-fit">
          <span className="text-xs font-medium text-dark-blue">
            {average.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray">/10</span>
        </div>

        <p className="text-sm text-custom-black leading-relaxed">{review}</p>
        {img && img.length > 0 && (
          <div className="mt-auto flex flex-col gap-2">
            <div
              className={`grid gap-2 ${
                img.length === 1
                  ? "grid-cols-1"
                  : img.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {img.map((src, index) => (
                <img
                  key={`${name}-${index}`}
                  src={src}
                  alt={`Review ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
            <span className="text-xs text-gray text-right block">{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------- ReviewHistory ----------------
export default function ReviewHistory() {
  // const [sortOption, setSortOption] = useState("option1");
  const [viewOption, setViewOption] = useState("List");
  const [filterReview, setFilterReview] = useState("All");
  const [remainReview, setRemainReview] = useState(reviewsData);

  // Popup state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<ReviewCardProps | null>(null);

  const handleEdit = (review: ReviewCardProps) => {
    setSelectedReview(review);
    setIsEditing(true);
  };

  const handleDelete = (review: ReviewCardProps) => {
    if (!confirm(`Delete review by ${review.name}?`)) return;
    setRemainReview((prev) =>
      prev.filter((r) => r.name !== review.name || r.date !== review.date)
    );
  };

  const filterRemainReview = (filter: string) => {
    setFilterReview(filter === filterReview ? "All" : filter);
    if (filter === "All" || filter === filterReview) setRemainReview(reviewsData);
    else setRemainReview(reviewsData.filter((r) => r.service === filter));
  };

  const sortByOption = (option: string) => {
    console.log("Sorting by:", option);

    const sortedReviews = [...remainReview]; // copy เพื่อไม่ mutate state เดิม

    if (option === "date") {
      sortedReviews.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // เรียงจากใหม่ → เก่า
      });
    } 
    else if (option === "score") {
      sortedReviews.sort((a, b) => {
        const avgA =
          Object.values(a.score).reduce((sum, val) => sum + val, 0) /
          Object.keys(a.score).length;
        const avgB =
          Object.values(b.score).reduce((sum, val) => sum + val, 0) /
          Object.keys(b.score).length;
        return avgB - avgA; // คะแนนมาก → น้อย
      });
    }

    setRemainReview(sortedReviews);
  };

  const handleSave = (updatedReview: ReviewCardProps) => {
    setRemainReview((prev) =>
      prev.map((r) =>
        r.name === updatedReview.name && r.date === updatedReview.date
          ? updatedReview
          : r
      )
    );
  };

  return (
    <DefaultPage>
      <div className="bg-custom-white -m-1 p-2 pt-5 rounded-lg">
        <div className="flex gap-5">
          <ProfileNavbar />
          <div className="flex-1 flex flex-col gap-4 ">
            <h1 className="text-2xl font-extrabold text-custom-black">Reviews</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-custom-white shadow p-2 rounded-[10px]">
              {["Hotel", "Restaurant", "Rental Car", "Guide", "Attraction"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-1 rounded-md text-base font-medium text-gray hover:bg-pale-blue hover:text-dark-blue 
                      ${
                        filterReview === tab
                          ? "bg-pale-blue text-dark-blue"
                          : ""
                      }`}
                    onClick={() => filterRemainReview(tab)}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-custom-black">
                {remainReview.length} reviews
              </span>
              <div className="flex gap-4">
                <select
                  defaultValue=""
                  className="text-custom-black d-select w-fit"
                  onChange={(e) =>
                    sortByOption((e.target as HTMLSelectElement).value)
                    // setSortOption((e.target as HTMLSelectElement).value)
                  }
                >
                  <option value="" disabled>
                    Sort by option
                  </option>
                  <option value="date">Sort by date</option>
                  <option value="score">Sort by score</option>
                </select>
                <select
                  defaultValue=""
                  className="text-custom-black d-select w-fit"
                  onChange={(e) =>
                    setViewOption((e.target as HTMLSelectElement).value)
                  }
                >
                  <option value="" disabled>
                    View
                  </option>
                  <option value="List">List</option>
                  <option value="Grid">Grid</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div
              className={`gap-4 ${
                viewOption === "Grid"
                  ? "grid grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col"
              }`}
            >
              {remainReview.map((r) => (
                <ReviewCard
                  key={`${r.name}-${r.date}`}
                  viewOption={viewOption}
                  {...r}
                  onEdit={() => handleEdit(r)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {isEditing && (
        <EditReviewPopup
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          initialData={selectedReview}
          onSave={handleSave}
        />
      )}
    </DefaultPage>
  );
}
