"use client"

import { useState } from 'react';
import SideNav from '@/components/guide-manage/sidenav';
import Navbar from '@/components/navbar/navbar';
import SectionCard from '@/components/guide-manage/ProfileSectionCard';
import EditModal from '@/components/guide-manage/ProfileEditModal';
import { BadgeCheck, Mail, Phone, MessageSquare, AtSign, Banknote } from 'lucide-react';

// --- Base Mock Data ---
const initialProfile = {
  name: "John Doe",
  title: "Professional Tour Guide",
  avatarUrl: "https://placehold.co/128x128/3B82F6/FFFFFF?text=JD",
  status: "Super Guide",
  memberSince: "January 2022",
  languages: "Thai, English, Chinese",
  specialties: "Culture, Food, History",
  location: "Bangkok, Thailand",
  availableDays: "Mon - Sun",
  workingHours: "8:00 AM - 8:00 PM",
  baseRateHalf: 80,
  baseRateFull: 150,
  groupSizeLimit: 8,
  email: "johndoe@tripmate.com",
  phone: "+66 89-123-4567",
  lineId: "johndoe_guide",
  bank: "Kasikorn Bank",
  accountNo: "123-1-12345-1",
  promptPay: "012-345-6789",
};

// --- Reusable Input Component for Forms ---
const FormInput = ({ label, id, value, onChange, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type="text" 
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
    </div>
);

// --- FORM COMPONENTS for each section ---

const EditProfileForm = ({ currentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: currentData.name });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <div className="space-y-4">
            <FormInput label="Name" id="name" value={formData.name} onChange={handleChange} />
            <FormInput label="Title" id="title" value={currentData.title} disabled={true} />
            <div className="mt-6 flex gap-3"><button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg">Save</button><button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg">Cancel</button></div>
        </div>
    );
};

const EditStatsForm = ({ currentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        languages: currentData.languages,
        specialties: currentData.specialties,
        location: currentData.location,
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <div className="space-y-4">
            <FormInput label="Member Since" id="memberSince" value={currentData.memberSince} disabled={true} />
            <FormInput label="Languages" id="languages" value={formData.languages} onChange={handleChange} />
            <FormInput label="Specialties" id="specialties" value={formData.specialties} onChange={handleChange} />
            <FormInput label="Location" id="location" value={formData.location} onChange={handleChange} />
            <div className="mt-6 flex gap-3"><button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg">Save</button><button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg">Cancel</button></div>
        </div>
    );
};

const EditAvailabilityForm = ({ currentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        availableDays: currentData.availableDays,
        workingHours: currentData.workingHours,
        baseRateHalf: currentData.baseRateHalf,
        baseRateFull: currentData.baseRateFull,
        groupSizeLimit: currentData.groupSizeLimit,
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <div className="space-y-4">
            <FormInput label="Available Days" id="availableDays" value={formData.availableDays} onChange={handleChange} />
            <FormInput label="Working Hours" id="workingHours" value={formData.workingHours} onChange={handleChange} />
            <FormInput label="Base Rate (Half Day)" id="baseRateHalf" value={formData.baseRateHalf} onChange={handleChange} />
            <FormInput label="Base Rate (Full Day)" id="baseRateFull" value={formData.baseRateFull} onChange={handleChange} />
            <FormInput label="Group Size Limit" id="groupSizeLimit" value={formData.groupSizeLimit} onChange={handleChange} />
            <div className="mt-6 flex gap-3"><button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg">Save</button><button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg">Cancel</button></div>
        </div>
    );
};

const EditContactForm = ({ currentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        email: currentData.email,
        phone: currentData.phone,
        lineId: currentData.lineId,
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <div className="space-y-4">
            <FormInput label="Email" id="email" value={formData.email} onChange={handleChange} />
            <FormInput label="Phone" id="phone" value={formData.phone} onChange={handleChange} />
            <FormInput label="Line ID" id="lineId" value={formData.lineId} onChange={handleChange} />
            <div className="mt-6 flex gap-3"><button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg">Save</button><button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg">Cancel</button></div>
        </div>
    );
};

const EditPaymentForm = ({ currentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        bank: currentData.bank,
        accountNo: currentData.accountNo,
        promptPay: currentData.promptPay,
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <div className="space-y-4">
            <FormInput label="Bank" id="bank" value={formData.bank} onChange={handleChange} />
            <FormInput label="Account No." id="accountNo" value={formData.accountNo} onChange={handleChange} />
            <FormInput label="PromptPay" id="promptPay" value={formData.promptPay} onChange={handleChange} />
            <div className="mt-6 flex gap-3"><button onClick={() => onSave(formData)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg">Save</button><button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg">Cancel</button></div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function GuideProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const handleProfileUpdate = (updatedData) => {
    setProfile(prevProfile => ({ ...prevProfile, ...updatedData }));
    closeModal();
  };

  const openModal = (title) => {
    let formContent;
    switch (title) {
        case "Profile":
            formContent = <EditProfileForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />;
            break;
        case "Quick Stats":
            formContent = <EditStatsForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />;
            break;
        case "Availability & Pricing":
            formContent = <EditAvailabilityForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />;
            break;
        case "Contact":
            formContent = <EditContactForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />;
            break;
        case "Payment Methods":
            formContent = <EditPaymentForm currentData={profile} onSave={handleProfileUpdate} onCancel={closeModal} />;
            break;
        default:
            formContent = <p>No edit form available for this section.</p>;
    }
    setModalContent({ title, content: formContent });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // --- Sub-components for cleaner layout ---
  const DetailRow = ({ label, value }) => ( <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"><span className="text-base font-medium text-gray-600">{label}</span><span className="text-base font-semibold text-gray-800 text-right">{value}</span></div>);
  const ContactRow = ({ icon, label, value }) => (<div className="flex items-start gap-3"><div className="mt-1">{icon}</div><div><p className="font-semibold text-gray-800">{label}</p><p className="text-gray-600">{value}</p></div></div>);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Profile Management</h1>
            <p className="text-base text-gray-500 mt-1">Update your guide profile and settings</p>
          </div>
          <div className="mt-6 space-y-6">
            <SectionCard onEdit={() => openModal("Profile")}>
              <div className="flex items-center gap-6">
                <img src={profile.avatarUrl} alt="Guide Avatar" className="w-24 h-24 rounded-full" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                  <p className="text-xl font-semibold text-gray-500">{profile.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-base font-semibold text-blue-600"><BadgeCheck size={20} /><span>{profile.status}</span></div>
                </div>
              </div>
            </SectionCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Quick Stats" onEdit={() => openModal("Quick Stats")}>
                    <div className="space-y-1"><DetailRow label="Member since" value={profile.memberSince} /><DetailRow label="Languages" value={profile.languages} /><DetailRow label="Specialties" value={profile.specialties} /><DetailRow label="Location" value={profile.location} /></div>
                </SectionCard>
                <SectionCard title="Availability & Pricing" onEdit={() => openModal("Availability & Pricing")}>
                     <div className="space-y-1"><DetailRow label="Available Days" value={profile.availableDays} /><DetailRow label="Working Hours" value={profile.workingHours} /><DetailRow label="Base Rate (Half Day)" value={`$${profile.baseRateHalf}`} /><DetailRow label="Base Rate (Full Day)" value={`$${profile.baseRateFull}`} /><DetailRow label="Group Size Limit" value={`${profile.groupSizeLimit} people`} /></div>
                </SectionCard>
                <SectionCard title="Contact" onEdit={() => openModal("Contact")}>
                    <div className="space-y-4"><ContactRow icon={<Mail size={20} className="text-gray-500"/>} label="Email" value={profile.email} /><ContactRow icon={<Phone size={20} className="text-gray-500"/>} label="Phone" value={profile.phone} /><ContactRow icon={<MessageSquare size={20} className="text-gray-500"/>} label="Line ID" value={profile.lineId} /></div>
                </SectionCard>
                <SectionCard title="Payment Methods" onEdit={() => openModal("Payment Methods")}>
                    <div className="space-y-4"><ContactRow icon={<Banknote size={20} className="text-gray-500"/>} label={`Bank: ${profile.bank}`} value={`Account: ${profile.accountNo}`} /><ContactRow icon={<AtSign size={20} className="text-gray-500"/>} label="PromptPay" value={profile.promptPay} /></div>
                </SectionCard>
            </div>
          </div>
        </main>
      </div>
      <EditModal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>{modalContent.content}</EditModal>
    </div>
  );
}