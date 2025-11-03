"use client";

import { useState, useRef } from "react";
import SideNav from "@/components/guide-manage/sidenav";
import Navbar from "@/components/navbar/navbar";
import SectionCard from "@/components/guide-manage/ProfileSectionCard";
import EditModal from "@/components/guide-manage/ProfileEditModal";
import {
  BadgeCheck,
  Mail,
  Phone,
  MessageSquare,
  AtSign,
  Banknote,
  Camera,
} from "lucide-react";

// ---------------------------
// MOCK DATA
// ---------------------------
const mockGuide = {
  id: "svc-004",
  name: "Arisa Jassaasd",
  description:
    "มีใบอนุญาตมัคคุเทศก์ เชี่ยวชาญธรรมชาติและวัฒนธรรมท้องถิ่น",
  image:
    "http://161.246.5.236:9000/images/15a75408-ecf9-4c63-a6c5-020bd94dd5fd.jpg",
  rating: "9.4",
  hourlyRate: "500",
  dayRate: "3000",
  availability: {
    mon_fri: "09:00-18:00",
    weekend: "09:00-16:00",
  },
  contacts: {
    line: "@arisa-guide",
    email: "arisa.guide@example.com",
    phone: "+66-8-1234-5678",
  },
  languages: ["Thai", "English", "Japanese"],
  specialties: ["Trekking", "Local Culture", "Photography"],
  locationSummary: "ประจำเชียงใหม่ รับงานทั้งภาคเหนือ",
  verified: true,
};

// ---------------------------
// TRANSFORM MOCK DATA
// ---------------------------
const transformMock = (g: typeof mockGuide) => ({
  id: g.id,
  name: g.name,
  title: g.description,
  avatarUrl: g.image,
  status: g.verified ? `Verified Guide (${g.rating})` : `Guide (${g.rating})`,
  languages: g.languages.join(", "),
  specialties: g.specialties.join(", "),
  location: g.locationSummary,
  availableDays: "Mon-Fri, Weekend",
  workingHours: `Mon-Fri: ${g.availability.mon_fri}, Weekend: ${g.availability.weekend}`,
  baseRateHalf: parseFloat(g.hourlyRate),
  baseRateFull: parseFloat(g.dayRate),
  email: g.contacts.email,
  phone: g.contacts.phone,
  lineId: g.contacts.line,
  bank: "Kasikorn Bank",
  accountNo: "123-4-56789-0",
  promptPay: "012-345-6789",
});

// ---------------------------
// FORM INPUT
// ---------------------------
const FormInput = ({ label, id, value, onChange, disabled = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

// ---------------------------
// MAIN COMPONENT
// ---------------------------
export default function GuideProfilePage() {
  const [profile, setProfile] = useState(transformMock(mockGuide));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: null });

  // ---------------------------
  // MODAL CONTROL
  // ---------------------------
  const closeModal = () => setIsModalOpen(false);

  const openModal = (title: string, content: any) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  // ---------------------------
  // FORM SECTIONS
  // ---------------------------
  const EditProfileForm = ({ currentData, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: currentData.name,
      title: currentData.title,
    });
    const [previewUrl, setPreviewUrl] = useState(currentData.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: any) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <Camera size={16} />
            Change Image
          </button>
        </div>
        <FormInput label="Name" id="name" value={formData.name} onChange={handleChange} />
        <FormInput label="Title" id="title" value={formData.title} onChange={handleChange} />
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onSave(formData, previewUrl)}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const EditContactForm = ({ currentData, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      email: currentData.email,
      phone: currentData.phone,
      lineId: currentData.lineId,
    });
    const handleChange = (e: any) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
      <div className="space-y-4">
        <FormInput label="Email" id="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Phone" id="phone" value={formData.phone} onChange={handleChange} />
        <FormInput label="Line ID" id="lineId" value={formData.lineId} onChange={handleChange} />
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg">
            Save
          </button>
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const EditQuickStatsForm = ({ currentData, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      languages: currentData.languages,
      specialties: currentData.specialties,
      location: currentData.location,
    });
    const handleChange = (e: any) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
      <div className="space-y-4">
        <FormInput label="Languages" id="languages" value={formData.languages} onChange={handleChange} />
        <FormInput label="Specialties" id="specialties" value={formData.specialties} onChange={handleChange} />
        <FormInput label="Location" id="location" value={formData.location} onChange={handleChange} />
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg">
            Save
          </button>
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const EditAvailabilityForm = ({ currentData, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      availableDays: currentData.availableDays,
      workingHours: currentData.workingHours,
      baseRateHalf: currentData.baseRateHalf,
      baseRateFull: currentData.baseRateFull,
    });
    const handleChange = (e: any) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
      <div className="space-y-4">
        <FormInput label="Available Days" id="availableDays" value={formData.availableDays} onChange={handleChange} />
        <FormInput label="Working Hours" id="workingHours" value={formData.workingHours} onChange={handleChange} />
        <FormInput label="Hourly Rate" id="baseRateHalf" value={formData.baseRateHalf} onChange={handleChange} />
        <FormInput label="Full-Day Rate" id="baseRateFull" value={formData.baseRateFull} onChange={handleChange} />
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg">
            Save
          </button>
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const EditPaymentForm = ({ currentData, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      bank: currentData.bank,
      accountNo: currentData.accountNo,
      promptPay: currentData.promptPay,
    });
    const handleChange = (e: any) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
      <div className="space-y-4">
        <FormInput label="Bank" id="bank" value={formData.bank} onChange={handleChange} />
        <FormInput label="Account No." id="accountNo" value={formData.accountNo} onChange={handleChange} />
        <FormInput label="PromptPay" id="promptPay" value={formData.promptPay} onChange={handleChange} />
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg">
            Save
          </button>
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // ---------------------------
  // UPDATE HANDLER
  // ---------------------------
  const handleProfileUpdate = (updatedData: any, newImage?: string) => {
    setProfile({
      ...profile,
      ...updatedData,
      avatarUrl: newImage || profile.avatarUrl,
    });
    setIsModalOpen(false);
  };

  // ---------------------------
  // UI HELPERS
  // ---------------------------
  const DetailRow = ({ label, value }: any) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="font-semibold text-gray-800 text-right">{value ?? "—"}</span>
    </div>
  );

  const ContactRow = ({ icon, label, value }: any) => (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">{value ?? "—"}</p>
      </div>
    </div>
  );

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">Guide Profile</h1>
              <p className="text-gray-500 mt-1">Manage your professional guide information</p>
            </div>
            <button
              onClick={() =>
                openModal(
                  "Edit Profile",
                  <EditProfileForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Edit Profile
            </button>
          </div>

          <SectionCard>
            <div className="flex items-center gap-6">
              <img src={profile.avatarUrl} alt="Guide Avatar" className="w-24 h-24 rounded-full object-cover" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                <p className="text-gray-500">{profile.title}</p>
                <div className="flex items-center gap-2 mt-2 text-blue-600 font-semibold">
                  <BadgeCheck size={20} />
                  <span>{profile.status}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <SectionCard
              title="Quick Stats"
              onEdit={() =>
                openModal(
                  "Edit Quick Stats",
                  <EditQuickStatsForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />
                )
              }
            >
              <DetailRow label="Languages" value={profile.languages} />
              <DetailRow label="Specialties" value={profile.specialties} />
              <DetailRow label="Location" value={profile.location} />
            </SectionCard>

            <SectionCard
              title="Availability & Pricing"
              onEdit={() =>
                openModal(
                  "Edit Availability & Pricing",
                  <EditAvailabilityForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />
                )
              }
            >
              <DetailRow label="Available Days" value={profile.availableDays} />
              <DetailRow label="Working Hours" value={profile.workingHours} />
              <DetailRow label="Hourly Rate" value={`฿${profile.baseRateHalf}`} />
              <DetailRow label="Full-Day Rate" value={`฿${profile.baseRateFull}`} />
            </SectionCard>

            <SectionCard
              title="Contact"
              onEdit={() =>
                openModal(
                  "Edit Contact",
                  <EditContactForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />
                )
              }
            >
              <ContactRow icon={<Mail size={20} className="text-gray-500" />} label="Email" value={profile.email} />
              <ContactRow icon={<Phone size={20} className="text-gray-500" />} label="Phone" value={profile.phone} />
              <ContactRow icon={<MessageSquare size={20} className="text-gray-500" />} label="Line ID" value={profile.lineId} />
            </SectionCard>

            <SectionCard
              title="Payment Methods"
              onEdit={() =>
                openModal(
                  "Edit Payment Methods",
                  <EditPaymentForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />
                )
              }
            >
              <ContactRow
                icon={<Banknote size={20} className="text-gray-500" />}
                label={`Bank: ${profile.bank}`}
                value={`Account: ${profile.accountNo}`}
              />
              <ContactRow icon={<AtSign size={20} className="text-gray-500" />} label="PromptPay" value={profile.promptPay} />
            </SectionCard>
          </div>
        </main>
      </div>

      <EditModal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>
        {modalContent.content}
      </EditModal>
    </div>
  );
}
