"use client";
import DefaultPage from "@/components/layout/default-layout";
import ProfileNavbar from "@/components/navbar/side-nav-variants/profile-side-navbar";
import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import EditReviewPopup from "./edit-review-popup";

import axios from "axios";
import { authJsonHeader } from "@/utils/service/get-header";
import { endpoints } from "@/config/endpoints.config";

type ReviewCardProps = {
  // --- [MODIFIED] ---
  // เพิ่ม ID เพื่อให้แน่ใจว่า key ไม่ซ้ำ
  // และใช้ในการอ้างอิงตอน Edit/Delete
  id: string; 
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
// --- [REMOVED] ---
// ไม่จำเป็นต้องใช้ reviewsData ที่เป็น static อีกต่อไป
// const reviewsData: ReviewCardProps[] = [ ... ];

// ---------------- ReviewCard ----------------
const ReviewCard = ({
  id, // --- [NEW] ---
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
            <img
              src={coverImg}
              onError={(e) => {
                // --- [NEW] ---
                // เพิ่ม fallback image ที่ดีขึ้น
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src =
                  "https://i.sstatic.net/y9DpT.jpg";
              }}
              alt={name}
              className="w-10 h-10 rounded-full border border-light-gray flex items-center justify-center bg-white object-cover" // --- [MODIFIED] ---
            />
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
                      id, // --- [NEW] ---
                      name,
                      location,
                      score,
                      review,
                      date,
                      viewOption,
                      img,
                      coverImg, // --- [NEW] ---
                      service, // --- [NEW] ---
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
                      id, // --- [NEW] ---
                      name,
                      location,
                      score,
                      review,
                      date,
                      viewOption,
                      img,
                      coverImg, // --- [NEW] ---
                      service, // --- [NEW] ---
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
            {/* --- [MODIFIED] ---
                จัดรูปแบบวันที่ให้แสดงผลสวยงามขึ้น
            */}
            <span className="text-xs text-gray text-right block">
              {new Date(date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- [REMOVED] ---
// async function getHotel(){ ... }

// ---------------- ReviewHistory ----------------
export default function ReviewHistory() {
  const [viewOption, setViewOption] = useState("List");
  const [filterReview, setFilterReview] = useState("All");

  // --- [NEW] ---
  // State สำหรับเก็บข้อมูลทั้งหมดที่ดึงมาจาก API
  const [allReviews, setAllReviews] = useState<ReviewCardProps[]>([]);
  // State สำหรับแสดงผล (หลังจากการกรอง/จัดเรียง)
  const [remainReview, setRemainReview] = useState<ReviewCardProps[]>([]);
  // State สำหรับ loading
  const [isLoading, setIsLoading] = useState(true);

  // --- [MODIFIED] ---
  // แก้ไข useEffect ทั้งหมดเพื่อดึงและประมวลผลข้อมูล
  useEffect(() => {
    async function fetchReview() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          endpoints.review.getAll,
          authJsonHeader()
        );
        const reviewsList = res.data; // นี่คือ Array ของรีวิว
        console.log("data, ", reviewsList);

        // Helper function สำหรับแปลง score1, score2... เป็น Object
        const mapScores = (reviewData: any): Record<string, number> => {
          const scores: Record<string, number> = {};
          for (let i = 1; i <= 6; i++) {
            if (
              reviewData[`score${i}`] !== null &&
              reviewData[`score${i}`] !== undefined
            ) {
              // ใช้ชื่อ generic ไปก่อน
              // คุณสามารถเปลี่ยนชื่อ 'Metric ${i}' เป็นชื่อที่เฉพาะเจาะจงได้
              scores[`Metric ${i}`] = reviewData[`score${i}`];
            }
          }
          return scores;
        };

        // สร้าง Array ของ Promises เพื่อดึงข้อมูลรายละเอียดของแต่ละรีวิว
        const reviewPromises = reviewsList.map(
          async (reviewData: any): Promise<ReviewCardProps | null> => {
            
            // ตรวจสอบ status และกำหนด serviceType ให้ตรงกับ Filter
            let type = reviewData.status; // "hotel", "place", null
            let serviceType: string;

            if (type === "hotel") {
              serviceType = "Hotel";
            } else if (type === "place") {
              serviceType = "Attraction"; // แมพ "place" ไปเป็น "Attraction"
            } else if (!type) {
              serviceType = "Attraction"; // ถ้า null ก็ให้เป็น "Attraction"
            } else {
              // สำหรับ "Rental Car", "Guide" (ถ้ามี)
              serviceType = type.charAt(0).toUpperCase() + type.slice(1);
            }

            try {
              // --- กรณี Hotel ---
              if (type === "hotel" && reviewData.serviceId) {
                const detailRes = await axios.get(
                  endpoints.hotel.detail(reviewData.serviceId),
                  authJsonHeader()
                );
                const details = detailRes.data;
                const loc = details.location;
                const locationString = [loc.name, loc.province, loc.country]
                  .filter(Boolean)
                  .join(", ");

                return {
                  id: reviewData.id,
                  review: reviewData.comment,
                  date: reviewData.createdAt,
                  img: reviewData.image,
                  score: mapScores(reviewData),
                  service: serviceType, // "Hotel"
                  name: details.name,
                  coverImg:
                    details.service?.serviceImg || details.pictures?.[0],
                  location: locationString,
                  viewOption: "List",
                };
              }
              // --- กรณี Place (ที่เราแมพเป็น Attraction) ---
              else if (type === "place" && reviewData.placeId) {
                
                // !!! ข้อควรระวัง: คุณต้องเพิ่ม endpoint สำหรับ "place"
                // ผมจะสมมติว่ามี endpoints.place.detail(id)
                // const detailRes = await axios.get(endpoints.place.detail(reviewData.placeId), authJsonHeader());
                // const details = detailRes.data;

                // --- MOCK DATA (ชั่วคราว) ---
                // ลบส่วนนี้ออกเมื่อคุณมี endpoint ของ place
                const details = {
                  name: "Mocked Place Name",
                  coverImg: "https://i.sstatic.net/y9DpT.jpg",
                  location: { name: "Mocked Location", country: "Thailand" },
                };
                // --- จบส่วน MOCK DATA ---

                const loc = details.location;
                const locationString = [loc.name, loc.country]
                  .filter(Boolean)
                  .join(", ");

                return {
                  id: reviewData.id,
                  review: reviewData.comment,
                  date: reviewData.createdAt,
                  img: reviewData.image,
                  score: mapScores(reviewData),
                  service: serviceType, // "Attraction"
                  name: details.name,
                  coverImg: details.coverImg,
                  location: locationString,
                  viewOption: "List",
                };
              }
              
              // หากมี type อื่นๆ ที่ยังไม่รองรับ
              console.warn(`Unhandled review type or missing ID: ${type}`);
              return null;

            } catch (err) {
              console.error(
                `Failed to fetch details for review ${reviewData.id}:`,
                err
              );
              return null; // คืนค่า null ถ้า fetch ย่อยล้มเหลว
            }
          }
        );

        // รอให้ทุก Promises ทำงานเสร็จ
        const resolvedReviews = await Promise.all(reviewPromises);

        // กรองค่า null (ที่เกิดจาก error หรือ type ที่ไม่รองรับ)
        const validReviews = resolvedReviews.filter(
          (r) => r !== null
        ) as ReviewCardProps[];

        console.log("Mapped data: ", validReviews);

        // อัปเดต State ทั้งสอง
        setAllReviews(validReviews);
        setRemainReview(validReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReview();
  }, []); // ทำงานครั้งเดียวเมื่อ component โหลด

  // --- [MODIFIED] ---
  // ลบ State ที่ไม่ได้ใช้ (remainReview)
  // และเปลี่ยนไปใช้ allReviews แทน reviewsData
  // const [remainReview, setRemainReview] = useState(reviewsData);

  // Popup state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<ReviewCardProps | null>(null);

  const handleEdit = (review: ReviewCardProps) => {
    setSelectedReview(review);
    setIsEditing(true);
  };

  const handleDelete = (review: ReviewCardProps) => {
    if (!confirm(`Delete review for ${review.name}?`)) return;
    // --- [MODIFIED] ---
    // ลบออกจากทั้ง allReviews และ remainReview
    // (หมายเหตุ: นี่คือการลบใน state เท่านั้น ยังไม่ได้เรียก API ลบจริง)
    setAllReviews((prev) => prev.filter((r) => r.id !== review.id));
    setRemainReview((prev) => prev.filter((r) => r.id !== review.id));
  };

  const filterRemainReview = (filter: string) => {
    setFilterReview(filter === filterReview ? "All" : filter);
    if (filter === "All" || filter === filterReview) {
      // --- [MODIFIED] ---
      // ใช้ allReviews แทน reviewsData
      setRemainReview(allReviews);
    } else {
      // --- [MODIFIED] ---
      // ใช้ allReviews แทน reviewsData
      // และใช้ r.service === filter (ตัวพิมพ์ใหญ่ตรงกัน)
      setRemainReview(allReviews.filter((r) => r.service === filter));
    }
  };

  const sortByOption = (option: string) => {
    console.log("Sorting by:", option);

    const sortedReviews = [...remainReview];

    if (option === "date") {
      sortedReviews.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    } else if (option === "score") {
      sortedReviews.sort((a, b) => {
        const avgA =
          Object.values(a.score).reduce((sum, val) => sum + val, 0) /
          Object.keys(a.score).length;
        const avgB =
          Object.values(b.score).reduce((sum, val) => sum + val, 0) /
          Object.keys(b.score).length;
        return avgB - avgA;
      });
    }

    setRemainReview(sortedReviews);
  };

  const handleSave = (updatedReview: ReviewCardProps) => {
    // --- [MODIFIED] ---
    // อัปเดตทั้ง allReviews และ remainReview โดยใช้ id
    setAllReviews((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
    setRemainReview((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
  };

  return (
    <DefaultPage>
      <div className="bg-custom-white -m-1 p-2 pt-5 rounded-lg">
        <div className="flex gap-5">
          <ProfileNavbar />
          <div className="flex-1 flex flex-col gap-4 ">
            <h1 className="text-2xl font-extrabold text-custom-black">
              Reviews
            </h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-custom-white shadow p-2 rounded-[10px]">
              {["Hotel", "Rental Car", "Guide", "Attraction"].map((tab) => (
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
              ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-custom-black">
                {remainReview.length} reviews
              </span>
              <div className="flex gap-4">
                <select
                  defaultValue=""
                  className="text-custom-black d-select pr-5 pl-2 w-[10rem]"
                  onChange={(e) =>
                    sortByOption((e.target as HTMLSelectElement).value)
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
                  className="text-custom-black d-select pr-2 pl-2 max-w-[5rem]"
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

            {/* --- [NEW] --- Loading state */}
            {isLoading ? (
              <div className="text-center p-10">Loading reviews...</div>
            ) : (
              /* Reviews List */
              <div
                className={`gap-4 ${
                  viewOption === "Grid"
                    ? "grid grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col"
                }`}
              >
                {remainReview.length > 0 ? (
                  remainReview.map((r) => (
                    <ReviewCard
                      key={r.id} // --- [MODIFIED] --- ใช้ id ที่ไม่ซ้ำกัน
                      viewOption={viewOption}
                      {...r}
                      onEdit={() => handleEdit(r)}
                      onDelete={() => handleDelete(r)} // --- [MODIFIED] --- ส่ง r ไปเลย
                    />
                  ))
                ) : (
                  <div className="text-center p-10 text-gray-500">
                    No reviews found for this category.
                  </div>
                )}
              </div>
            )}
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