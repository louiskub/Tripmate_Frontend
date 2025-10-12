"use client";
import VendorPageLayout from '@/components/layout/vendor-layout'
import UploadImg from '@/components/vendor/upload-img';
import { useLocalStorage } from '@/hooks/use-storage';
import { useEffect, useRef, useState } from 'react';


const Input = ({ label, type = "text", id }: { label: string; type?: string; id: string }) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium">{label}</span>
    <input
      type={type}
      className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
      id={id}
      name={id}
      {...(type == "number" ? { min: 0 } : {})}
      placeholder={`Enter ${label.toLowerCase()} here!`}
    />
  </label>
);

const Textarea = ({ label, id }: { label: string; id: string }) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium">{label}</span>
    <textarea id={id} name={id} className="border border-gray-300 rounded-md p-1 h-15 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder={`Enter ${label.toLowerCase()} here!`} />
  </label>
);

const SelectOption = ({ label, id, options }: { label: string; id: string; options: string[] }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">{label}</span>
      <select
        className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        id={id}
        name={id}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

const CarForm = () => {
  return (
    <>
      <Input key="name" label="Car Name" id="name" type="text" />
      <SelectOption label="Tags" id="tags" options={["SUV", "Sedan", "Hatchback"]} />
      <Input key="price" label="Price Per Day" id="price" type="number" />
      <Input label="Google map link" id="google-map" />
      <Textarea label="Description" id="description" />
      <Input label="Policies" id="policies" />
    </>
  )
}

const GuideForm = () => {
  return (
    <>
      <Input key="name" label="Post Name" id="name" type="text"  />
      <Textarea label="Description" id="description" />
      <SelectOption label="Province" id="province" options={["Bangkok", "Chiang Mai", "Phuket"]} />
      <Input label="Google map link" id="google-map" />
      <Input label="Duration" id="duration" />
      <Input label="Cost" id="cost" type="number" />
    </>
  )
}

const RestaurantForm = () => {
  return (
    <>
      <Input key="name" label="Restaurant Name" id="name" type="text" />
      <SelectOption label="Tags" id="tags" options={["Thai", "Italian", "Japanese"]} />
      <SelectOption label="Province" id="province" options={["Bangkok", "Chiang Mai", "Phuket"]} />
      <Input key="google-map" label="Google map link" id="google-map" type="text" />
      <Textarea key="description" label="Description" id="description" />
      <Input key="contact" label="Contact" id="contact" type="text" />
    </>
  )
}

const HotelForm = () => {
  return (
    <>
      <Input key="name" label="Hotel Name" id="name" type="text" />
      <SelectOption label="Tags" id="tags" options={["Luxury", "Budget", "Boutique"]} />
      <SelectOption label="Province" id="province" options={["Bangkok", "Chiang Mai", "Phuket"]} />
      <Input key="google-map" label="Google map link" id="google-map" type="text" />
      <Textarea key="description" label="Description" id="description" />
      <Input key="contact" label="Contact" id="contact" type="text" />
    </>
  )
}

function capitalizeFirstLetter(val: unknown) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const Page = () => {
    const [vendorType] = useLocalStorage('vendorType', "car");
    const [coverImgInput, setCoverImgInput] = useState<File | null>(null);
    const [menuImgInput, setMenuImgInput] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    let labelText = capitalizeFirstLetter(vendorType);
    if (vendorType == "car") {
      labelText = "Rental Car";
    }

    const handleSubmit = async () => {
      const formEl = formRef.current;
      if (!formEl) return;

      const fd = new FormData(formEl);

      if (coverImgInput) {
        const coverImgBlob = new Blob([await coverImgInput.arrayBuffer()], { type: coverImgInput.type });
        console.log("coverImgBlob: ", coverImgBlob);
      }
      if (menuImgInput) {
        const menuImgBlob = new Blob([await menuImgInput.arrayBuffer()], { type: menuImgInput.type });
        console.log("menuImgBlob: ", menuImgBlob);
      }
      const data = {
        ...Object.fromEntries(fd.entries()),
        coverImg: coverImgInput,
        menuImg: menuImgInput,
      }
      console.log("Form Data: ", data);
      console.log(fd.get("tags"))
      console.log(formEl)
    }




    return (
        <VendorPageLayout>
            {/* <AccountNav /> */}
            <h1 className="text-2xl font-extrabold mb-4">Create {labelText}</h1>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-col gap-5 items-center flex-1'>
                <UploadImg text={`${vendorType} Img`} onFileChange={(file) => setCoverImgInput(file)} id="cover-img" />
                {
                  vendorType == "restaurant" ? <UploadImg text="Menu Img" onFileChange={(file) => setMenuImgInput(file)} id="menu-img" /> : null
                }
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="bg-sky-500 text-white px-4 py-2 rounded-md font-semibold hover:cursor-pointer hover:bg-sky-600"
                    onClick={handleSubmit}
                  >
                    Create {labelText}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-2 gap-3 bg-custom-white p-6 rounded-lg border border-blue-300">
                <h2 className="text-2xl font-bold">{labelText} Details</h2>
                <form ref={formRef}>
                  {
                    vendorType == "car" ? <CarForm /> :
                    vendorType == "guide" ? <GuideForm /> :
                    vendorType == "restaurant" ? <RestaurantForm /> :
                    vendorType == "hotel" ? <HotelForm /> :
                    null
                  }
                </form>
              </div>
            </div>
        </VendorPageLayout>
    );
};

export default Page;
