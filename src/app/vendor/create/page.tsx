"use client";

import ThemeToggle from '@/components/navbar/toggle-theme'
import VendorPageLayout from '@/components/layout/vendor-layout'
import VendorSideNavbar, {UploadImg}  from '@/components/navbar/side-nav-variants/vendor-side-navbar'
import AdminNavbar from "@/components/navbar/default-nav-variants/admin-navbar";

import PersonIcon from '@/assets/icons/person.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import UploadIcon from '@/assets/icons/upload.svg'


// export default function CreateService() {
//   return (
//     <VendorPageLayout>
//         <UploadImg />
//     </VendorPageLayout>
//   )
// }
// app/create-rental-car/page.tsx

// app/create-rental-car/page.tsx

import React, { useState } from "react";

const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col gap-2 p-2">
      <NavItem label="Dashboard" active />
      <NavItem label="Rental Cars" />
      <NavItem label="Booking History" />
    </aside>
  );
};

const AccountNav = () => {
  return (
    <aside className="w-48 bg-white border-r border-gray-200 flex flex-col gap-2 p-2">
      <NavItem label="Total Cars" active />
      <NavItem label="Available Cars" />
      <NavItem label="Active Rentals" />
      <NavItem label="Under Repair" />
      <div className="mt-auto">
        <NavItem label="Add New Car" />
        <NavItem label="Remove Car" />
      </div>
    </aside>
  );
};

const NavItem = ({ label, active }: { label: string; active?: boolean }) => (
  <div
    className={`px-4 py-2 rounded-md cursor-pointer ${
      active ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
    }`}
  >
    {label}
  </div>
);

const RentalForm = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form className="flex flex-col gap-3 bg-white p-6 rounded-lg border border-blue-300 flex-1">
      <h2 className="text-2xl font-bold">Rental Car Details</h2>

      <Input label="Rental Car Title" />
      <Input label="Tags" />
      <Input label="Price per day" type="number" />
      <Input label="Google map link" />
      <Textarea label="Description" />
      <Input label="Policies" />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-sky-500 text-white px-4 py-2 rounded-md font-semibold"
        >
          Create Rental Car
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const Input = ({ label, type = "text" }: { label: string; type?: string }) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium">{label}</span>
    <input
      type={type}
      className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
    />
  </label>
);

const Textarea = ({ label }: { label: string }) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium">{label}</span>
    <textarea className="border border-gray-300 rounded-md p-1 h-15 focus:outline-none focus:ring-2 focus:ring-sky-400" />
  </label>
);

const Page = () => {
    return (
        <VendorPageLayout>
            {/* <AccountNav /> */}
            <h1 className="text-2xl font-extrabold mb-4">Create Rental Car</h1>
            <div className='flex flex-row gap-5'>
                <UploadImg /> 
                <RentalForm />
            </div>
                
        </VendorPageLayout>
    );
};

export default Page;
