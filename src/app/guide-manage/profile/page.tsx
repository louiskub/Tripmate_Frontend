"use client"

// 1. เพิ่ม useRef
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import SideNav from "@/components/guide-manage/sidenav"
import Navbar from "@/components/navbar/navbar"
import SectionCard from "@/components/guide-manage/ProfileSectionCard"
import EditModal from "@/components/guide-manage/ProfileEditModal"
import { endpoints } from "@/config/endpoints.config"
import { getCookieFromName, getToken } from "@/utils/service/cookie"

// 2. เพิ่ม uploadBlobUrls (จากโค้ดเดิม)
import { uploadBlobUrls } from "@/utils/service/upload"

import {
  BadgeCheck,
  Mail,
  Phone,
  MessageSquare,
  AtSign,
  Banknote,
  Camera, // 3. เพิ่ม Camera icon
} from "lucide-react"

// --- Base Mock Data (ใช้เป็นค่าเริ่มต้นก่อน API โหลด) ---
const initialProfile = {
  id: "svc-000",
  name: "Loading...",
  title: "Professional Tour Guide",
  avatarUrl: "https://placehold.co/128x128/CCCCCC/FFFFFF?text=...",
  status: "Loading...",
  // memberSince: "...", // <-- 1. ลบ field นี้ออก
  languages: "...",
  specialties: "...",
  location: "...",
  availableDays: "...",
  workingHours: "...",
  baseRateHalf: 0,
  baseRateFull: 0,
  groupSizeLimit: 8,
  email: "...",
  phone: "...",
  lineId: "...",
  bank: "Kasikorn Bank",
  accountNo: "123-1-12345-1",
  promptPay: "012-345-6789",
}

// --- Reusable Input Component for Forms ---
const FormInput = ({ label, id, value, onChange, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
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
)

// --- FORM COMPONENTS for each section ---

// 4. แก้ไข EditProfileForm
const EditProfileForm = ({ currentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: currentData.name,
    title: currentData.title,
  })

  // --- NEW: State สำหรับรูปภาพ ---
  const [previewUrl, setPreviewUrl] = useState(currentData.avatarUrl)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  // ------------------------------

  // Handler นี้ตัวเดียวใช้ได้ทั้ง Name และ Title
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  // --- NEW: Handler สำหรับการเลือกไฟล์ ---
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      //   setImageFile(file)
      const url = URL.createObjectURL(file)
      console.log("url: ", url)
      // setImageFile(url)
      setImageFile(url)
      setPreviewUrl(url) // สร้าง URL พรีวิว
    }
  }
  // ------------------------------------

  return (
    <div className="space-y-4">
      {/* --- NEW: UI สำหรับอัปโหลดรูป --- */}
      <div className="flex flex-col items-center gap-4">
        <img
          src={previewUrl}
          alt="Profile Preview"
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
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Camera size={16} />
          Change Image
        </button>
      </div>
      {/* --------------------------------- */}

      <FormInput
        label="Name"
        id="name"
        value={formData.name}
        onChange={handleChange}
      />
      <FormInput
        label="Title"
        id="title"
        value={formData.title} // FIXED: ใช้ formData.title
        onChange={handleChange} // FIXED: ใช้ handleChange
        // disabled={true} // (เอาออกเพื่อให้แก้ไขได้)
      />
      <div className="mt-6 flex gap-3">
        <button
          // 5. MODIFIED: ส่ง imageFile ไปด้วย
          onClick={() => onSave(formData, imageFile)}
          className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const EditStatsForm = ({ currentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    languages: currentData.languages,
    specialties: currentData.specialties,
    location: currentData.location,
  })
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const prepareData = (obj: any) => {
    // (แก้ type เป็น any)
    // language
    obj.languages = obj.languages
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) // ทำให้เป็น array
    obj.specialties = obj.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) // ทำให้เป็น array
    onSave(obj)
  }

  return (
    <div className="space-y-4">
      {/* <-- 2. ลบ FormInput "Member Since" ออกจากตรงนี้ --> */}
      <FormInput
        label="Languages (comma separated)"
        id="languages"
        value={formData.languages}
        onChange={handleChange}
      />
      <FormInput
        label="Specialties (comma separated)"
        id="specialties"
        value={formData.specialties}
        onChange={handleChange}
      />
      <FormInput
        label="Location"
        id="location"
        value={formData.location}
        onChange={handleChange}
      />
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => prepareData(formData)}
          className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const EditAvailabilityForm = ({ currentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    availableDays: currentData.availableDays,
    workingHours: currentData.workingHours,
    baseRateHalf: currentData.baseRateHalf,
    baseRateFull: currentData.baseRateFull,
    groupSizeLimit: currentData.groupSizeLimit,
  })
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  return (
    <div className="space-y-4">
      <FormInput
        label="Available Days"
        id="availableDays"
        value={formData.availableDays}
        onChange={handleChange}
      />
      <FormInput
        label="Working Hours"
        id="workingHours"
        value={formData.workingHours}
        onChange={handleChange}
      />
      <FormInput
        label="Base Rate (Half Day)"
        id="baseRateHalf"
        value={formData.baseRateHalf}
        onChange={handleChange}
      />
      <FormInput
        label="Base Rate (Full Day)"
        id="baseRateFull"
        value={formData.baseRateFull}
        onChange={handleChange}
      />
      <FormInput
        label="Group Size Limit"
        id="groupSizeLimit"
        value={formData.groupSizeLimit}
        onChange={handleChange}
      />
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const EditContactForm = ({ currentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    email: currentData.email,
    phone: currentData.phone,
    lineId: currentData.lineId,
  })
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  return (
    <div className="space-y-4">
      <FormInput
        label="Email"
        id="email"
        value={formData.email}
        onChange={handleChange}
      />
      <FormInput
        label="Phone"
        id="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <FormInput
        label="Line ID"
        id="lineId"
        value={formData.lineId}
        onChange={handleChange}
      />
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const EditPaymentForm = ({ currentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bank: currentData.bank,
    accountNo: currentData.accountNo,
    promptPay: currentData.promptPay,
  })
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  return (
    <div className="space-y-4">
      <FormInput
        label="Bank"
        id="bank"
        value={formData.bank}
        onChange={handleChange}
      />
      <FormInput
        label="Account No."
        id="accountNo"
        value={formData.accountNo}
        onChange={handleChange}
      />
      <FormInput
        label="PromptPay"
        id="promptPay"
        value={formData.promptPay}
        onChange={handleChange}
      />
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/**
 * ฟังก์ชันสำหรับแปลงข้อมูล API
 * (API data) ไปเป็นโครงสร้างที่หน้าเว็บคาดหวัง (Profile data)
 */
const transformApiData = (apiData, baselineProfile) => {
  // (บรรทัดนี้ในไฟล์ของคุณถูก comment ไว้อยู่แล้ว - ถูกต้องครับ)
  //   const memberSince = new Date(apiData.service.createdAt).toLocaleDateString(
  //     "en-US",
  // ...

  // จัดรูปแบบสถานะ
  const status = apiData.verified
    ? `Verified Guide (${apiData.rating} Rating)`
    : `Guide (${apiData.rating} Rating)`

  // จัดรูปแบบเวลาทำงาน
  const workingHours = `Mon-Fri: ${apiData.availability.mon_fri}, Weekend: ${apiData.availability.weekend}`

  return {
    ...baselineProfile, // ใช้ baseline เป็นค่าเริ่มต้น (เผื่อ API ไม่มีข้อมูลบางส่วน)

    // เขียนทับด้วยข้อมูลจาก API
    id: apiData.id,
    name: apiData.name,
    title: apiData.description, // (อันนี้คุณแก้ไว้แล้ว - ถูกต้องครับ)
    // 6. MODIFIED: ใช้ pictures[0] เป็น avatar
    avatarUrl: apiData.image || baselineProfile.avatarUrl, // (อันนี้คุณแก้ไว้แล้ว - ถูกต้องครับ)
    status: status, // API 'verified' & 'rating' -> 'status'
    // memberSince: memberSince, // (อันนี้คุณแก้ไว้แล้ว - ถูกต้องครับ)
    languages: (apiData.languages || []).join(", "), // API Array -> String
    specialties: (apiData.specialties || []).join(", "), // API Array -> String
    location: apiData.locationSummary, // API 'locationSummary' -> 'location'
    availableDays: "Mon-Fri, Weekend", // จาก keys ของ API 'availability'
    workingHours: workingHours, // จาก values ของ API 'availability'
    baseRateHalf: parseFloat(apiData.hourlyRate), // API 'hourlyRate' -> 'baseRateHalf'
    baseRateFull: parseFloat(apiData.dayRate), // API 'dayRate' -> 'baseRateFull'
    groupSizeLimit: baselineProfile.groupSizeLimit, // API ไม่มี, ใช้ค่าเดิม
    email: apiData.contacts.email, // API 'contacts.email' -> 'email'
    phone: apiData.contacts.phone, // API 'contacts.phone' -> 'phone'
    lineId: apiData.contacts.line, // API 'contacts.line' -> 'lineId'

    // ข้อมูลการเงิน (Bank) ไม่มีใน API ที่ให้มา
    // จึงใช้ข้อมูลจาก baselineProfile (mock) ไปก่อน
    bank: baselineProfile.bank,
    accountNo: baselineProfile.accountNo,
    promptPay: baselineProfile.promptPay,
  }
}

// --- MAIN PAGE COMPONENT ---
export default function GuideProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", content: null })

  // 4. เพิ่ม useEffect เพื่อดึงข้อมูลเมื่อหน้าโหลด
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // --- ส่วนนี้คือการเรียก API จริง (สมมติ ID คือ svc-004) ---
        const response = await axios.get(
          endpoints.guide.detail(localStorage.getItem("serviceId"))
        )
        const apiData = response.data

        // 5. แปลงข้อมูลและอัปเดต State
        console.log("API Data:", apiData)
        const transformedData = transformApiData(apiData, initialProfile)
        setProfile(transformedData)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        // หาก fetch ไม่สำเร็จ หน้าเว็บจะยังแสดงข้อมูล "Loading..."
      }
    }

    fetchProfile()
  }, []) // [] หมายถึงให้รันแค่ครั้งเดียวตอนหน้าโหลด

  // 7. MODIFIED: แก้ไข handleProfileUpdate
  const handleProfileUpdate = async (updatedData, imageFile = null) => {
    try {
      let dataToPatch = { ...updatedData }
      const serviceId = localStorage.getItem("serviceId")

      // --- NEW: ตรรกะการอัปโหลดรูป ---
      if (imageFile) {
        console.log("Uploading new image...")

        // 1. สร้าง FormData (จาก util ที่คุณมี)
        const formData = await uploadBlobUrls([imageFile])

        // 2. กำหนด Endpoint (สมมติว่ามี)
        const uploadEndpoint = endpoints.serviceManage.guide.uploadImg(serviceId)

        // 3. POST รูป
        const uploadRes = await axios.post(uploadEndpoint, formData, {
          headers: {
            Authorization: `Bearer ${getCookieFromName("token")}`,
            "Content-Type": "multipart/form-data",
          },
        })

        console.log("Upload success:", uploadRes.data)

        dataToPatch.image = uploadRes.data.pictures.slice(-1)[0]
        // 4. นำ URL ใหม่ไปใส่ในข้อมูลที่จะ Patch
        // (อ้างอิงจาก transformApiData ที่ใช้ pictures[0] เป็น avatar)
        // if (uploadRes.data.pictures && uploadRes.data.pictures.length > 0) {
        //   dataToPatch.pictures = uploadRes.data.pictures // ส่ง array รูปใหม่
        // } else {
        //   console.warn("Could not find 'pictures' array in upload response.")
        // }
      }
      // -----------------------------

      // 5. Patch ข้อมูล (text และ/หรือ URL รูปใหม่)
      const res = await axios.patch(
        endpoints.guide.detail(serviceId),
        dataToPatch,
        {
          headers: {
            Authorization: `Bearer ${getCookieFromName("token")}`,
            "Content-Type": "application/json",
          },
        }
      )

      console.log("edit success", res.data)

      // 6. อัปเดต State ด้วยข้อมูลที่ API ส่งกลับมา (สำคัญมาก)
      // ต้อง re-transform เพื่อให้ avatarUrl และอื่นๆ อัปเดตถูกต้อง
      const transformedData = transformApiData(res.data, profile)
      setProfile(transformedData)

      closeModal()
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const openModal = (title) => {
    let formContent
    switch (title) {
      case "Profile":
        formContent = (
          <EditProfileForm
            currentData={profile}
            onSave={handleProfileUpdate}
            onCancel={closeModal}
          />
        )
        break
      case "Quick Stats":
        formContent = (
          <EditStatsForm
            currentData={profile}
            onSave={handleProfileUpdate}
            onCancel={closeModal}
          />
        )
        break
      case "Availability & Pricing":
        formContent = (
          <EditAvailabilityForm
            currentData={profile}
            onSave={handleProfileUpdate}
            onCancel={closeModal}
          />
        )
        break
      case "Contact":
        formContent = (
          <EditContactForm
            currentData={profile}
            onSave={handleProfileUpdate}
            onCancel={closeModal}
          />
        )
        break
      case "Payment Methods":
        formContent = (
          <EditPaymentForm
            currentData={profile}
            onSave={handleProfileUpdate}
            onCancel={closeModal}
          />
        )
        break
      default:
        formContent = <p>No edit form available for this section.</p>
    }
    setModalContent({ title, content: formContent })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  // --- Sub-components for cleaner layout ---
  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-base font-medium text-gray-600">{label}</span>
      <span className="text-base font-semibold text-gray-800 text-right">
        {value}
      </span>
    </div>
  )
  const ContactRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 p-7 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Profile Management
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Update your guide profile and settings
            </p>
          </div>
          <div className="mt-6 space-y-6">
            <SectionCard onEdit={() => openModal("Profile")}>
              <div className="flex items-center gap-6">
                <img
                  src={profile.avatarUrl}
                  alt="Guide Avatar"
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {profile.name}
                  </h1>
                  <p className="text-xl font-semibold text-gray-500">
                    {profile.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-base font-semibold text-blue-600">
                    <BadgeCheck size={20} />
                    <span>{profile.status}</span>
                  </div>
                </div>
              </div>
            </SectionCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard
                title="Quick Stats"
                onEdit={() => openModal("Quick Stats")}
              >
                <div className="space-y-1">
                  {/* <-- 3. ลบ DetailRow "Member since" ออกจากตรงนี้ --> */}
                  <DetailRow label="Languages" value={profile.languages} />
                  <DetailRow
                    label="Specialties"
                    value={profile.specialties}
                  />
                  <DetailRow label="Location" value={profile.location} />
                </div>
              </SectionCard>
              <SectionCard
                title="Availability & Pricing"
                onEdit={() => openModal("Availability & Pricing")}
              >
                <div className="space-y-1">
                  <DetailRow
                    label="Available Days"
                    value={profile.availableDays}
                  />
                  <DetailRow
                    label="Working Hours"
                    value={profile.workingHours}
                  />
                  <DetailRow
                    label="Base Rate (Per Hour)"
                    value={`฿${profile.baseRateHalf}`}
                  />
                  <DetailRow
                    label="Base Rate (Full Day)"
                    value={`฿${profile.baseRateFull}`}
                  />
                  <DetailRow
                    label="Group Size Limit"
                    value={`${profile.groupSizeLimit} people`}
                  />
                </div>
              </SectionCard>
              <SectionCard title="Contact" onEdit={() => openModal("Contact")}>
                <div className="space-y-4">
                  <ContactRow
                    icon={<Mail size={20} className="text-gray-500" />}
                    label="Email"
                    value={profile.email}
                  />
                  <ContactRow
                    icon={<Phone size={20} className="text-gray-500" />}
                    label="Phone"
                    value={profile.phone}
                  />
                  <ContactRow
                    icon={<MessageSquare size={20} className="text-gray-500" />}
                    label="Line ID"
                    value={profile.lineId}
                  />
                </div>
              </SectionCard>
              <SectionCard
                title="Payment Methods"
                onEdit={() => openModal("Payment Methods")}
              >
                <div className="space-y-4">
                  <ContactRow
                    icon={<Banknote size={20} className="text-gray-500" />}
                    label={`Bank: ${profile.bank}`}
                    value={`Account: ${profile.accountNo}`}
                  />
                  <ContactRow
                    icon={<AtSign size={20} className="text-gray-500" />}
                    label="PromptPay"
                    value={profile.promptPay}
                  />
                </div>
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.content}
      </EditModal>
    </div>
  )
}