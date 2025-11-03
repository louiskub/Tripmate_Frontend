import React, { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";
import LocationIcon from "@/assets/icons/location-point.svg";
import axios from "axios"
import {endpoints} from "@/config/endpoints.config"
import {authJsonHeader} from "@/utils/service/get-header"
import {uploadBlobUrls, uploadFile} from "@/utils/service/upload"
import { getCookieFromName } from "@/utils/service/cookie"

interface CreateReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // initialData?: {
  //   name: string;
  //   location: string;
  //   type: string;          // ✅ เพิ่ม type เช่น "hotel" | "restaurant" | "attraction" | "rental car"
  //   star?: number;
  //   coverImg?: string;
  // } | null;
  initialData?: {
    name: string;
    location: string;
    type: string;          // ✅ เพิ่ม type เช่น "hotel" | "restaurant" | "attraction" | "rental car"
    star?: number;
    coverImg?: string;

    serviceId: string; 
    bookingId: string;
  } | null;
}


// example initialData
// const initialData = {
//     name: "Kimpton Paris Hotel",
//     coverImg: "https://static51.com-hotel.com/uploads/hotel/84844/photo/vibe-hotel-gold-coast_17307266811.jpg",
//     location: "Paris, France",
//     star: 3,
//     type: "attraction",
// }
{/* <CreateReviewPopup
                isOpen={isEditing}
                initialData={initialData}
                onClose={() => setIsEditing(false)} 
            /> */}


interface RatingGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingGroup: React.FC<RatingGroupProps> = ({ label, value, onChange }) => (
  <div className="w-full flex flex-col justify-start items-start gap-1">
    <div className="text-custom-black text-sm font-medium">{label}</div>
    <div className="flex gap-[3px] flex-wrap">
      {[...Array(10)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition font-medium text-sm
            ${
              value === i + 1
                ? "bg-dark-blue text-white shadow-sm"
                : "bg-pale-blue text-custom-black hover:bg-sky-100"
            }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </div>
);

// ✅ ฟังก์ชันกำหนดหัวข้อคะแนนตามประเภท
const RatingGroupByType = (type: string) => {
  if (type === "Hotel") return ["cleanliness", "comfort", "meal", "location", "service", "facilities"];
  // if (type === "restaurant") return ["Food Quality", "Service", "Ambiance", "Value for Money"];
  if (type === "attraction") return ["overall"];
  if (type === "Rental car") return ["overall"];
  if (type === "Guide") return ["knowledge", "communication", "punctuality", "safety", "route_planning", "local_insights"];
  return [];
};

const CreateReviewPopup: React.FC<CreateReviewPopupProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxImages = 3;

  // ✅ เมื่อเปิด popup หรือเปลี่ยน type ให้กำหนดคะแนนเริ่มต้นตามประเภท
  useEffect(() => {
    if (initialData?.type) {
      const categories = RatingGroupByType(initialData.type);
      const defaultRatings: Record<string, number> = {};
      categories.forEach((label) => {
        defaultRatings[label] = 0;
      });
      setRatings(defaultRatings);
    }
  }, [initialData]);

  const average =
    Object.values(ratings).reduce((a, b) => a + b, 0) /
      (Object.keys(ratings).length || 1) || 0;

  const handleRatingChange = (label: string, value: number) => {
    setRatings((prev) => ({ ...prev, [label]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    if (images.length + fileArray.length > maxImages) {
      alert("You can upload up to " + maxImages + " images.");
      return;
    }
    setImages((prev) => [...prev, ...fileArray]);
  };

  // ✅ ส่งข้อมูลทั้งหมดรวมถึง type
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = {
        "userId": localStorage.getItem("userId"),
        // "placeId": initialData?.bookingId,
        "placeId": null,
        "comment": comment,
        "serviceId": initialData?.serviceId,
        "status": initialData?.type.toLowerCase()
      }

      Object.entries(ratings).forEach(([label, value], index) => {
        formData[`score${index + 1}`] =  value.toString();
      });
      const res = await axios.post(endpoints.review.create, formData, authJsonHeader())
      const reviewId = res.data.id

      const formImg = await uploadFile(images)
      const resImg = await axios.post(endpoints.review.uploadImg(reviewId), formImg, {
        headers: {
          Authorization: `Bearer ${getCookieFromName("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // console.log("Upload Img success:", res.data)
      // console.log("Slice", res.data.pictures.slice(-images.length))
      // console.log("res", res)
      // const formData = new FormData();
      // formData.append("name", initialData?.name ?? "");
      // formData.append("location", initialData?.location ?? "");
      // formData.append("type", initialData?.type ?? "unknown");
      // formData.append("comment", comment);

      // Object.entries(ratings).forEach(([key, value]) => {
      //   formData.append(`score[${key}]`, value.toString());
      // });

      // images.forEach((image) => {
      //   formData.append("images", image);
      // });

      // const response = await fetch("/api/reviews", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save review");
      // }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center">
      <div className="w-[70%] max-w-[800px] bg-custom-white rounded-[10px] flex flex-col overflow-hidden shadow-lg animate-fade-in">
        <div className="h-11 p-2.5 border-b border-neutral-200 flex justify-between items-center">
          <div className="text-custom-black text-xl font-bold">Create Review</div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Info section */}
        <div className="p-3 border-b border-neutral-200 flex gap-3 items-center">
          {initialData?.coverImg && (
            <img
              src={initialData.coverImg}
              alt=""
              className="w-16 h-16 rounded-[10px] object-cover"
            />
          )}
          <div className="flex-1">
            <div className="font-bold text-custom-black text-base">
              {initialData?.name || ""}
            </div>
            <div className="flex gap-1">
              {[...Array(initialData?.star || 0)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-3 h-3 fill-dark-blue text-dark-blue"
                />
              ))}
              {[...Array(5 - (initialData?.star || 0))].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-3 h-3 fill-gray-300 text-gray-300"
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-custom-black">
              <LocationIcon className="w-3.5 h-3.5" />
              <span>{initialData?.location}</span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-neutral-200">
          <div className="flex-[1.1] p-4 border-r border-neutral-200 flex flex-col items-center gap-4 justify-start">
            {Object.entries(ratings).map(([label, value]) => (
              <RatingGroup
                key={label}
                label={label}
                value={value}
                onChange={(v) => handleRatingChange(label, v)}
              />
            ))}
          </div>

          <div className="flex-[1.2] p-5 flex flex-col items-center justify-start gap-4 text-left">
            <div className="flex items-center gap-2 self-start">
              <div className="text-custom-black text-sm font-medium">Overall</div>
              <div className="bg-pale-blue rounded-[10px] flex items-center gap-1 px-3 py-1 shadow-sm border border-dark-blue/30">
                <div className="text-dark-blue text-xl font-bold">{average.toFixed(1)}</div>
                <div className="text-gray text-xs">/10</div>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-custom-black text-sm font-medium">Comment</label>
              <textarea
                className="border border-gray-300 rounded-md p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-dark-blue resize-none overflow-hidden"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  const target = e.target;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
                style={{ minHeight: "96px" }}
              />
            </div>

            {/* Images */}
            <div className="flex flex-wrap gap-3 justify-start w-full">
              {images.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`upload-${index}`}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < maxImages && (
                <label className="w-20 h-20 border border-gray rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 transition">
                  <div className="text-gray text-2xl">＋</div>
                  <div className="text-gray text-xs">Add</div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex justify-end gap-2.5 border-t border-neutral-200 bg-gray-50">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-[10px] border border-dark-blue text-dark-blue text-sm font-semibold hover:bg-dark-blue hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-8 px-4 rounded-[10px] bg-dark-blue text-white text-sm font-semibold hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReviewPopup;
