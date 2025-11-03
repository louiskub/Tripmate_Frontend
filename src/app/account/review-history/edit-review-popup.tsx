import React, { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import LocationIcon from "@/assets/icons/location-point.svg";

import axios from "axios";
import { authJsonHeader } from "@/utils/service/get-header";
import { endpoints } from "@/config/endpoints.config";
import { uploadBlobUrls } from "@/utils/service/upload";
import { getCookieFromName } from "@/utils/service/cookie"

interface EditReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: {
    name: string;
    coverImg?: string;
    service?: string;
    score: Record<string, number>;
    review: string;
    date: string;
    viewOption: string;
    img?: string[];
    location?: string;
  } | null;
}

interface RatingGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

// ✅ ฟังก์ชันกำหนดหัวข้อคะแนนตามประเภท
const RatingGroupByType = (type: string) => {
  if (type === "Hotel") return ["cleanliness", "comfort", "meal", "location", "service", "facilities"];
  // if (type === "restaurant") return ["Food Quality", "Service", "Ambiance", "Value for Money"];
  if (type === "attraction") return ["overall"];
  if (type === "Rental car") return ["overall"];
  if (type === "Guide") return ["knowledge", "communication", "punctuality", "safety", "route_planning", "local_insights"];
  return [];
};

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

const EditReviewPopup: React.FC<EditReviewPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxImages = 3;

  useEffect(() => {
    if (!initialData) return;
    setRatings(initialData.score ?? {});
    setComment(initialData.review ?? "");
    setExistingImages(initialData.img ?? []);
    setImages([]);
  }, [initialData]);

  const average =
    Object.keys(ratings).length === 0
      ? 0
      : Object.values(ratings).reduce((a, b) => a + b, 0) /
        Object.keys(ratings).length;

  const handleRatingChange = (label: string, value: number) => {
    setRatings((prev) => ({ ...prev, [label]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    if (existingImages.length + images.length + fileArray.length > maxImages) {
      alert("You can upload up to " + maxImages + " images.");
      return;
    }
    setImages((prev) => [...prev, ...fileArray]);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = {
        ...initialData,
        score: ratings,
        review: comment,
        img: [
          ...existingImages,
          ...images.map((i) => URL.createObjectURL(i)),
        ],
      };

      const imgForm = await uploadBlobUrls(updated.img)
      const resImg = await axios.post(endpoints.review.uploadImg(updated.id), imgForm, {
        headers: {
          Authorization: `Bearer ${getCookieFromName("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("resImg :", resImg)



      const metrics = RatingGroupByType(updated.service)
      const formData = {
        "comment": updated.review,
        "image": resImg.data.image.slice(-updated.img.length),
        // "userId": localStorage.getItem("userId")
      }
      for(let i=0; i<metrics.length; i++){
        formData[`score${i+1}`] = updated.score[metrics[i]]
      }
      const res = await axios.patch(endpoints.review.edit(updated.id), formData, authJsonHeader())
      console.log("res1", res)
      
      // // "JR3887CJUVOZ"
      // console.log("Updated review data:", updated);
      // console.log("Form Data", formData)
      onSave?.(updated);
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
        {/* Header */}
        <div className="h-11 p-2.5 border-b border-neutral-200 flex justify-between items-center">
          <div className="text-custom-black text-xl font-bold">Edit Review</div>
          <button
            onClick={onClose}
            aria-label="Close popup"
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="p-3 border-b border-neutral-200 flex gap-3 items-center">
          {/* <div className="w-16 h-16 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]" /> */}
          <img src={initialData?.coverImg} alt="" className="w-16 h-16 rounded-[10px] object-cover" />
          <div className="flex-1">
            <div className="font-bold text-custom-black text-base">
              {initialData?.name || ""}
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-3 h-3 fill-dark-blue text-dark-blue"
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-custom-black">
              <LocationIcon className="w-3.5 h-3.5" />
              <span>{initialData?.location}</span>
            </div>
          </div>
        </div>

        {/* Ratings + Comment */}
        <div className="flex border-b border-neutral-200">
          <div className="flex-[1.1] p-4 border-r border-neutral-200 flex flex-col items-center gap-4 justify-start">
            {Object.keys(ratings).length > 0 ? (
              Object.entries(ratings).map(([label, value]) => (
                <RatingGroup
                  key={label}
                  label={label}
                  value={value}
                  onChange={(v) => handleRatingChange(label, v)}
                />
              ))
            ) : (
              <div className="text-gray text-sm italic">
                No rating categories available
              </div>
            )}
          </div>

          <div className="flex-[1.2] p-5 flex flex-col items-center justify-start gap-4 text-left">
            {/* Overall */}
            <div className="flex items-center gap-2 self-start">
              <div className="text-custom-black text-sm font-medium">
                Overall
              </div>
              <div className="bg-pale-blue rounded-[10px] flex items-center gap-1 px-3 py-1 shadow-sm border border-dark-blue/30">
                <div className="text-dark-blue text-xl font-bold">
                  {average.toFixed(1)}
                </div>
                <div className="text-gray text-xs">/10</div>
              </div>
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="comment"
                className="text-custom-black text-sm font-medium"
              >
                Comment
              </label>
              <textarea
                id="comment"
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
              {existingImages.map((src, index) => (
                <div key={`existing-${index}`} className="relative w-20 h-20">
                  <img
                    src={src}
                    alt={`existing-${index}`}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.map((img, index) => (
                <div key={`upload-${index}`} className="relative w-20 h-20">
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

              {/* Upload button */}
              {existingImages.length + images.length < maxImages && (
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
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReviewPopup;
