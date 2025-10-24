import React, { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import LocationIcon from "@/assets/icons/location-point.svg";

interface RatingGroupProps {
  label: string;
  onChange: (value: number) => void;
}

const RatingGroup: React.FC<RatingGroupProps> = ({ label, onChange }) => {
  const [rating, setRating] = useState(0);
  const handleSelect = (value: number) => {
    setRating(value);
    onChange(value);
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2 my-[-5px]">
      <div className="text-custom-black text-sm font-medium">{label}</div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex gap-1">
          {[...Array(10)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i + 1)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition font-medium ${
                rating === i + 1
                  ? "bg-dark-blue text-white shadow-sm"
                  : "bg-pale-blue text-custom-black hover:bg-sky-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="w-full flex justify-between text-[0.6rem] text-gray">
          <span>Terrible</span>
          <span>Perfect</span>
        </div>
      </div>
    </div>
  );
};

const Textarea = ({ label, id }: { label: string; id: string }) => (
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor={id} className="text-custom-black text-sm font-medium">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      className="border border-gray-300 rounded-md p-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-dark-blue"
      placeholder="Write your review..."
    />
  </div>
);

const EditReviewPopup: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const maxImages = 3;
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    service: 0,
    facilities: 0,
    comfort: 0,
    value: 0,
  });

  const average =
    Object.values(ratings).reduce((a, b) => a + b, 0) /
      Object.values(ratings).filter((v) => v > 0).length || 0;

//   useEffect(() => {
//     if 
//     document.body.style.overflow = "hidden";
//     document.body.style.overflow = "auto";
//   }, [isOpen]);
  const changeIsOpen = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    if (images.length + fileArray.length > maxImages) {
      alert(`อัปโหลดได้สูงสุด ${maxImages} รูปเท่านั้น`);
      return;
    }
    setImages((prev) => [...prev, ...fileArray]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("average", average.toFixed(1));
      Object.entries(ratings).forEach(([key, value]) =>
        formData.append(key, value.toString())
      );
      images.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Submit failed");
      alert("✅ Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed top-0 left-0 bg-black/50 z-[100] w-full h-full flex justify-center items-center` + (isOpen ? "" : " hidden")}>
      <div className="w-[70%] max-w-[800px] bg-custom-white rounded-[10px] flex flex-col overflow-hidden shadow-lg animate-fade-in">
        {/* Header */}
        <div className="h-11 p-2.5 border-b border-neutral-200 flex justify-between items-center">
          <div className="text-custom-black text-xl font-bold">Review</div>
          <button 
            onClick={() => changeIsOpen()}
            className="cursor-pointer text-gray-400 hover:text-black transition">
            ✕
          </button>
        </div>

        {/* Hotel Info */}
        <div className="p-3 border-b border-neutral-200 flex flex-col gap-1">
          <div className="flex gap-2.5 items-center">
            <div className="w-16 h-16 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="font-bold text-custom-black text-base">
                Centara Grand Mirage Beach Resort Pattaya
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
                <span>Pattaya, Thailand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="flex border-b border-neutral-200 min-h-[400px]">
          {/* Left */}
          <div className="flex-[1.1] p-4 border-r border-neutral-200 flex flex-col items-center gap-4 justify-center">
            <RatingGroup
              label="Cleanliness"
              onChange={(v) => setRatings((p) => ({ ...p, cleanliness: v }))}
            />
            <RatingGroup
              label="Service"
              onChange={(v) => setRatings((p) => ({ ...p, service: v }))}
            />
            <RatingGroup
              label="Facilities"
              onChange={(v) => setRatings((p) => ({ ...p, facilities: v }))}
            />
            <RatingGroup
              label="Comfort"
              onChange={(v) => setRatings((p) => ({ ...p, comfort: v }))}
            />
            <RatingGroup
              label="Value for money"
              onChange={(v) => setRatings((p) => ({ ...p, value: v }))}
            />
          </div>

          {/* Right */}
          <div className="flex-[1.2] p-5 flex flex-col items-center justify-start gap-4 text-left">
            {/* Overall */}
            <div className="flex items-center gap-2 mt-2 mb-2 self-start">
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

            <Textarea label="Comment" id="comment" />

            {/* Uploaded Section */}
            <div className="flex flex-col w-full items-start gap-2 mt-1">
              <div className="text-sm font-medium text-custom-black">
                Upload Images
                <span className="text-gray text-xs ml-1">
                  ({images.length}/{maxImages})
                </span>
              </div>

              <div className="flex flex-wrap gap-3 justify-start">
                {images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`upload-${index}`}
                      className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
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
        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex justify-end gap-2.5 border-t border-neutral-200 bg-gray-50">
          <button
            disabled={isSubmitting}
            onClick={() => changeIsOpen()}
            className="h-8 px-3 rounded-[10px] border border-dark-blue text-dark-blue text-sm font-semibold hover:bg-dark-blue hover:text-white transition"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`h-8 px-4 rounded-[10px] text-sm font-semibold flex items-center gap-1 transition ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-dark-blue text-white hover:bg-blue-900"
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                {/* <div className="w-3.5 h-3.5 bg-white rounded-full" /> */}
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReviewPopup;
