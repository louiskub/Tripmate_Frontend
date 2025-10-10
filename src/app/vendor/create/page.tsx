"use client";
import VendorPageLayout from '@/components/layout/vendor-layout'
import UploadImg from '@/components/vendor/upload-img';
import { useLocalStorage } from '@/hooks/use-storage';
import { useRef, useState } from 'react';


const Input = ({ label, type = "text", id }: { label: string; type?: string; id: string }) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium">{label}</span>
    <input
      type={type}
      className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
      id={id}
    />
  </label>
);

const Textarea = ({ label, id }: { label: string; id: string }) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium">{label}</span>
    <textarea id={id} className="border border-gray-300 rounded-md p-1 h-15 focus:outline-none focus:ring-2 focus:ring-sky-400" />
  </label>
);

const RentalForm = () => {
  return (
    <form className="flex flex-col flex-2 gap-3 bg-custom-white p-6 rounded-lg border border-blue-300">
      <h2 className="text-2xl font-bold">Rental Car Details</h2>

      <Input label="Rental Car Title" id="title"/>
      <Input label="Tags" id="tags" />
      <Input label="Price per day" type="number" id="price" />
      <Input label="Google map link" id="google-map" />
      <Textarea label="Description" id="description" />
      <Input label="Policies" id="policies" />
    </form>
  );
};

const Page = () => {
    const [vendorType] = useLocalStorage('vendorType', "Car");
    const [coverImgInput, setCoverImgInput] = useState<File | null>(null);
    const [menuImgInput, setMenuImgInput] = useState<File | null>(null);
    
    let labelText = vendorType
    if (vendorType == "Car") {
      labelText = "Rental Car";
    }

    const handleSubmit = async () => {
      const form = document.querySelector('form');
      const data = {
        title: (form?.querySelector('#title') as HTMLInputElement)?.value,
        tags: (form?.querySelector('#tags') as HTMLInputElement)?.value,
        price: (form?.querySelector('#price') as HTMLInputElement)?.value,
        googleMap: (form?.querySelector('#google-map') as HTMLInputElement)?.value,
        description: (form?.querySelector('#description') as HTMLTextAreaElement)?.value,
        policies: (form?.querySelector('#policies') as HTMLInputElement)?.value,
      };

      if (coverImgInput) {
        const coverImgBlob = new Blob([await coverImgInput.arrayBuffer()], { type: coverImgInput.type });
        console.log("coverImgBlob: ", coverImgBlob);
      }
    }

    return (
        <VendorPageLayout>
            {/* <AccountNav /> */}
            <h1 className="text-2xl font-extrabold mb-4">Create {labelText}</h1>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-col gap-5 items-center flex-1'>
                <UploadImg text={`${vendorType} Img`} onFileChange={(file) => setCoverImgInput(file)} />
                {
                  vendorType == "Restaurant" ?
                  <UploadImg text="Menu Img" onFileChange={(file) => setMenuImgInput(file)} />
                  :
                  null
                }
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="bg-sky-500 text-white px-4 py-2 rounded-md font-semibold hover:cursor-pointer hover:bg-sky-600"
                    onClick={handleSubmit}
                  >
                    Create Rental Car
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <RentalForm />
            </div>
        </VendorPageLayout>
    );
};

export default Page;
